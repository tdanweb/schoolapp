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


//posting short updates...
router.post("/update/post", async (req, res) => {

})


router.get("/updates/:user", 
        async (req, res) => {
    try {
        const updates = await ShortUpdate.find()
        .populate("poster", "fullname regNo staffType specialRoles")
        .sort({createdAt: -1})
        .limit(20);

        res.status(200).json({
            updates, msg: "Access Updates"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({              
            msg: "Network Error.."
        })
    }   
}
)
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
        
        if(!poster1 || !poster1.specialRoles.includes("admin") && !poster1.specialRoles.includes("chief-admin")) {
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

export default router;
function pin(param){
    return  Math.floor(Math.random() * param);
}

async function verifyRole(role){

    try {
        
    } catch (error) {
        
    }
}