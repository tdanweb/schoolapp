import express from "express";
import mongoose from "mongoose";

const router = express.Router()
import { getStudentList, getStudentListForResultsUpload, GetStudentsInfoForRecording } from "../controllers/Result&AttendanceControllers.js";
import { setStaffRole } from "../controllers/TeacherController.js";
import { RegPin } from "../models/Applicant.js";
//create auth routes
import { ShortUpdate } from "../models/Post.js";
import { ResultPin } from "../models/Results&Scores.js";
import { Teacher } from "../models/Staff.js";
import User from "../models/User.js";
import { staffAuth } from "../middlewares/auth.js";
import Student from "../models/Student.js";

router.get("/staff/duty/subjects/:id", GetStudentsInfoForRecording); //list of assigned subjects by class..   query by staff regNO
router.get("/staff/record/list", getStudentList);  //specific list of students by class.. query by class query set in.....
router.put("/staff/roles/set/:id", setStaffRole)

// ======== IMPORTANT!!! --- Getting uploading list ----- =======
router.get("/staff/uploading-scores/list", getStudentListForResultsUpload)

//result pin generation
router.post("/staff/result-checker/generate", async (req, res) => {

    try {
     //   const { id } = req.params;

        const { qts, amount, rounds } = req.body;

        if (!qts || qts < 1 || qts > 100) {
            return res.status(400).json({
                success: false,
                msg: "Pin Generation Failed, Enter a Valid Quantity between 1 and 100"
            });
        }

    let pins = []

    for (let p = 0; p < qts; p++) {
       const pin1 = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
       const pin2 = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
       const pin3 = String(Math.floor(Math.random() * 10000)).padStart(4, "0");

           const pin = `${pin1}${pin2}${pin3}`;
           const view = `${pin1}-${pin2}-${pin3}`;

            const newPin = {
                pin,
                view,
                price:  parseInt(amount) || 1000,
                rounds: parseInt(rounds) || 3,
                // Empty until assigned
                refId: `${ 1}-${Date.now()}`
            }

            pins.push(newPin)
        }

    const savedPin = await ResultPin.insertMany( pins,
                {ordered: false})

        //}

//        const savedPins = await RegPin.insertMany(pins, {    ordered: false  });

        res.status(200).json({
            msg: `${savedPin.length} Pins have been created!`,
            savedPins: savedPin,
            success: true
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            msg: "Network or server error"
        });
    }
});



router.get("/staff/admin/pins", async(req, res) => {
    try {
        const pins = await ResultPin.find({regNo: ""})
        .sort({ createdAt: -1})

        res.status(200).json({
            pins, msg: "Access Unused Pins"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Network Error.."
        })
    }
})



router.get("/updates/:user", async (req, res) => {
    const { user } = req.params; //reg NO

    const findUser = await User.findOne({regNo: user}).select("thisUser")


    const userType = findUser?.thisUser || "parent"; // testing for now

    try {
        const updates = await ShortUpdate.find({
            audience: userType
        })
        .populate("poster", "fullname regNo staffType displayName")
        .sort({ createdAt: -1 })
        .limit(20);

        res.status(200).json({
            updates,
            msg: "Access Updates",
            forUser: userType
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Network Error.."
        });
    }
});


// Create short update
router.post("/update/post", 
    //add auth via req.headers.Authorization
    async (req, res) => {
    try {
        const { title, body, regNo, audience} = req.body;

        if (!title || !body || !regNo || !audience ) {
            return res.status(400).json({
                success: false,
                msg: "Title, body and poster and audience are required"
            });
        }

        /*Count words
        const wordCount = body.trim().split(/\s+/).length;

        if (wordCount > 50) {
            return res.status(400).json({
                success: false,
                msg: "Post body cannot exceed 50 words"
            });
        }

*/
        const poster1 = await Teacher.findOne({regNo}).select("fullname _id staffType specialRoles");
        const user = await User.findOne({regNo, approved: true}).select("thisUser fullname");

        const auth1 = user.thisUser === "admin" || user.thisUser === "chief-admin";
        const auth2 = poster1.specialRoles.canCreateUpdate;
        
        if(!auth1 && !auth2) {
            return res.status(400).json({
                msg: "Operation Failed, Your profile cannot be found or you cannot perform this action!"
            });
        }

        const post = await ShortUpdate.create({
            title: title.trim(),
            body: body.trim(),
            audience,
            poster: poster1._id
        });

        return res.status(201).json({
            success: true,
            msg: "Post created successfully",
            post
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            msg: "Server error while creating post"
        });
    }
});


// fee payment
router.put(
  "/admin/pay-fee",
   staffAuth,
  async (req, res) => {
    try {
      const regNo = req.regNo;

      const {
        admissionNo,
        comment,
        paymentAmount,
        paymentId,
        session,
        term,
        classId,
        adminStaff,
      } = req.body;

      const staff = await Teacher.findOne({
        regNo,
        activeStaff: true,
      })
        .select(
          "staffId regNo specialRoles signature fullname staffType"
        )
        .lean();

      if (!staff) {
        return res.status(401).json({
          msg: "Staff account not found or inactive.",
        });
      }

      const staffId = staff.staffId
      // Chief admin OR finance permission
      const auth2 =
        staff.staffType === "chief-admin" ||
        staff.specialRoles?.canManageFinance === true;

      if (!auth2) {
        return res.status(403).json({
          msg:
            "You are not Authorized to perform this operation. Contact School Admin for more...",
        });
      }

      const amount = Number(paymentAmount);

      if (!amount || amount <= 0) {
        return res.status(400).json({
          msg: "Enter a valid payment amount.",
        });
      }

      if (!admissionNo || !session || !term) {
        return res.status(400).json({
          msg: "Admission number, session and term are required.",
        });
      }

      // Find student and the fee record for the current
      // session and term
      const student = await Student.findOne({
        admissionNo,
        currentFee: {
          $elemMatch: {
            session,
            term,
          },
        },
      })
        .select(
          "admissionNo currentFee fullname realClassId regNo"
        )
        .lean();

      if (!student) {
        return res.status(404).json({
          msg:
            "Student or fee record for the specified session and term was not found.",
        });
      }

      const fee = student.currentFee.find(
        (item) =>
          item.session === session &&
          item.term === term
      );

      if (!fee) {
        return res.status(404).json({
          msg:
            "Fee record for this session and term was not found.",
        });
      }

      const total = Number(fee.total || 0);
      const paid = Number(fee.paid || 0);
      const outstanding = Math.max(total - paid, 0);

      if (outstanding <= 0) {
        return res.status(400).json({
          msg: "This student's fee has already been fully paid.",
          total,
          paid,
          outstanding,
        });
      }

      if (amount > outstanding) {
        return res.status(400).json({
          msg: "Payment cannot exceed outstanding balance.",
          total,
          paid,
          outstanding,
          paymentAmount: amount,
        });
      }

      // Update only the matching currentFee item
      const updatedStudent =
        await Student.findOneAndUpdate(
          {
            admissionNo,
            currentFee: {
              $elemMatch: {
                session,
                term,
              },
            },
          },
          {
            $inc: {
              "currentFee.$.paid": amount,
            },
          },
          {
            new: true,
          }
        ).lean();

      if (!updatedStudent) {
        return res.status(400).json({
          msg: "Payment could not be processed.",
        });
      }

      const updatedFee =
        updatedStudent.currentFee.find(
          (item) =>
            item.session === session &&
            item.term === term
        );

      const newPaid = Number(updatedFee?.paid || 0);
      const newOutstanding = Math.max(
        Number(updatedFee?.total || 0) - newPaid,
        0
      );

      return res.status(200).json({
        msg: "Payment recorded successfully.",
        payment: {
          paymentId:
            paymentId || `PAY-${Date.now()}`,

          admissionNo,
          session,
          term,
          classId,
          staffId,

          paymentAmount: amount,

          previousPaid: paid,
          newPaid,

          total: Number(updatedFee?.total || 0),
          outstanding: newOutstanding,

          balanced: newOutstanding === 0,

          comment: comment || "",
        },
      });
    } catch (error) {
        console.log(error)
      return res.status(500).json({
        msg:
          "Something went wrong while processing the payment.",
        error: error.message,
      });
    }
  }
);

export default router;
function pin(param){
    return  Math.floor(Math.random() * param);
}

async function verifyRole(role){

    try {
        
    } catch (error) {
        
    }
}

