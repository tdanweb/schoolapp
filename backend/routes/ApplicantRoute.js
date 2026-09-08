import Applicant, {RegPin} from "../models/Applicant.js";
import express from "express";
import User from "../models/User.js";
import { AdmissionSetting, GeneralSettings } from "../models/AppSettings.js";

const router = express.Router();


//purchase pin...
router.post("/applicant/pay", async(req, res) => {

    const {regNo, pin, session} = req.body;
    try {
        const chk = await User.findOne({regNo, thisUser: "applicant"});
        const settings = await AdmissionSetting.findById("admission").select("settings");

        if(!settings || !chk) return res.status(400).json({
            msg: "Unable to proceed with Payment at the moment"
        })
        const available = settings.admissionStatus === "ongoing" && settings.session === session;

        //if(!available) return res.status(400).json({ msg: "Cannot Procceed with this Payment, Seems Registration has ended for the session " + session + 
          //  ". You can contact the admission admin for more information."});

        //check paid
        const paid = await RegPin.findOne({regNo, session});
        if(paid) return res.status(400).json({
            msg: "Seems you've already initiated a previous payment, you can reload the portal to confirm this.."
        })

            const payment = await RegPin.create({
                ...req.body,
                _id: "pin-" + pin
            });

            res.status(200).json({
                msg: "Your Pin has been created!", pin, session, regNo
            });
        //check if registration for admission still on
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Network/Server Error!"
        })
    }
});

//get payer pin
router.get("/applicant/get-pay", async (req, res) => {
    try {
       const {regNo, session} = req.query;

      // res.status(201).json({ msg: "done", success: true, regNo, session})
       const pin = await RegPin.findOne({ regNo, session });
       if(!pin) return res.status(400).json({ success: false, msg: "You are yet to pay the application Fee"});

        res.status(201).json({
            msg: "Payment Successful",
            pin, 
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Network/Server Error!" })      
    }
})

// POST /applicant/register
router.post("/applicant/reg", async (req, res) => {
  try {
    const {
      pin,
      session,

      fullName,
      surname,
      otherName,
      dob,
      nationality,
      stateOfOrigin,
      lga,
      gender,
      streamId,

      contact,
      academic,
      previousSchools,
      medical,
      sponsor,
    } = req.body;


    //get configured settings
    const set_up = await AdmissionSetting.findOne({_id: "admission"});
    const general_set_up = await GeneralSettings.findOne({_id: "general-setup"});
    if(!set_up || !general_set_up){
      return res.status(400).json({
        msg: "Applicant Registration is currently disabled, Contact School Admin!"
      })
    }

    const thisSession = set_up.settings.session;
    const allowed = general_set_up.setUps.admissionPortal;

    if(!allowed){
      return res.status(400).json({
        msg: "Registration is not available at the moment. Please contact the school Admin"
      })
    }

    // =========================================
    // 1. CHECK REQUIRED VALUES
    // =========================================

    if (!pin || !session) {
      return res.status(400).json({
        success: false,
        msg: "Registration PIN and session are required",
      });
    }

    // =========================================
    // 2. VERIFY REGISTRATION PIN
    // =========================================

    const pinData = await RegPin.findOne({
      pin,
      session
    });

    if (!pinData) {
      return res.status(400).json({
        success: false,
        msg: "Invalid registration PIN or session",
      });
    }

    // =========================================
    // 3. GET REGISTRATION NUMBER
    // =========================================

    const regNo = pinData.regNo;
    if (!regNo) {
      return res.status(400).json({
        success: false,
        msg: "Registration number is missing from PIN record",
      });
    }
    // =========================================
    // 4. CHECK IF APPLICANT ALREADY EXISTS
    // =========================================

    const existingApplicant = await Applicant.findOne({
      regNo,
    });

    if (existingApplicant) {
      return res.status(409).json({
        success: false,
        msg: "This registration has already been submitted",
      });
    }


    // =========================================
    // 5. BASIC REQUIRED FIELD VALIDATION
    // =========================================

    if (
      !fullName ||
      !surname ||
      !otherName ||
      !dob ||
      !gender ||
      !academic?.classOnAdmission
    ) {
      return res.status(400).json({
        success: false,
        msg: "Please complete all required applicant information",
      });
    }


    // =========================================
    // 6. CREATE APPLICANT
    // =========================================

    const applicant = await Applicant.create({
      admissionNo: "",
      regNo,
      fullName,
      surname,
      otherName,
      dob,
      nationality: nationality || "Nigeria",
      stateOfOrigin,
      lga,

      // Passport will be added separately
      passportUrl: "",
      passportId: "",
      gender,
      streamId: thisSession,
      status: "under review",
      // Since PIN was already verified/payment generated
      payment: true,
      examinationDetails: {
        status: "pending",
        score: 0,
        rating: 0,
        seatNo: "",
        examDate: "",
        examVenue: "",
      },
      feePaid: true,
      contact,
      academic: {
        classOnAdmission: academic.classOnAdmission,
        arm: academic.arm || "",
        department: academic.department || "",
        session,
        term: academic.term || "First",
      },
      previousSchools,
      medical,
      sponsor,
      applicationDate: new Date(),
    });

    // =========================================
    // 8. RESPONSE
    // =========================================

    return res.status(201).json({
      success: true,
      msg: "Application submitted successfully",
      applicant: {
        regNo: applicant.regNo,
        fullName: applicant.fullName,
        status: applicant.status,
      },
    });

  } catch (error) {

    console.error("Applicant registration error:", error);

    return res.status(500).json({
      success: false,
      msg: "Unable to complete registration",
      error: error.message,
    });
  }
});

//get one applicant
router.get("/applicant/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const applicant = await Applicant.findOne({regNo: id});

        if(!applicant) return res.status(400).json({ msg: "Unable to get this Appliant"})

        res.status(200).json({
            applicant, msg: "Welcome Back, " + applicant.surname.toUpperCase()
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Network Error...."
        })
    }
})


//for admin controls
router.get("/applicants/all", async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 25
        const SKIP = (page-1) * limit;

        const set = await AdmissionSetting.findOne({_id: "admission"}).select("settings");

        const total = await Applicant.countDocuments({ streamId: set.settings.session })

        const applicants = await Applicant.find({streamId: set.settings.session})
        .skip(SKIP).limit(limit).sort({ createdAt: -1 })
        .select("_id regNo fullName gender streamId admissionNo status feePaid examinationDetails");

        res.status(201).json({
            applicants, success: true, msg: "data fetched..",
            pagination: {
                total,
                page,
                limit,
                totalPages: 5, //Math.ceil(total/limit),
                hasNextPage: true, // page < Math.ceil(total/limit),
                hasPrevpage: true //page> 1
            }
        });
    } catch (error) {
        console.log(error)
        console.log(error);
        res.status(500).json({
            msg: "Network Error...."
        })
    }
})

//get all applicants for a specific session
router.get("/applicants/session/:sessionId", async (req, res) => {
    const { sessionId } = req.params;

    try {
        const applicants = await Applicant.find({ sessionId });

        res.status(200).json({
            applicants,
            success: true,
            msg: "Applicants fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching applicants:", error);
        res.status(500).json({
            success: false,
            msg: "Network Error...."
        });
    }
});


//bulkwrite applicant exam date
router.put("/applicants/assign", async(req, res) => {

  try {
    const {id} = req.params
    const data = req.body;

    if(!Array.isArray(data)){
      return res.status(400).json({
        msg: "Please send in list of students to be assigned"
      })
    }; 

    //validate chief admin later

    const assigned = await Applicant.bulkWrite(
      data.map(applicant => ({
        updateOne: {
          filter: {  regNo: applicant.regNo},
          update: {
            $set: {
              examinationDetails: applicant.examinationDetails
            }
          }
        }
      }))
    );

    res.status(200).json({
      msg: "Applicants Information Successfully Updated",
      success: true
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Server Error!"
    })
  }
})
export default router;