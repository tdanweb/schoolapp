import express from "express";
import { AdditionalRecords, Attendance, ResultPin } from "../models/Results&Scores.js"
import { Teacher } from "../models/Staff.js";
import Student from "../models/Student.js";
import { GeneralSettings, TermSettings } from "../models/AppSettings.js";
import Result from "../models/Results.js";

export async function recordAttendanceInBulk(req, res){

    try {
        const attdArray = req.body //  {arr. regNo, score, etc}


        if(!Array.isArray(attdArray)){
            return res.status(400).json({
                msg: "Operation Failed!.   Please Send a List of Marked Students Records"
            })
        };

        const ops = attdArray.map(doc => ({
            updateOne: {
                filter: {_id: doc._id}, //set _id from frontend
                update: {$set: doc},
                upsert: true
            }
        }));

        const attd = await Attendance.bulkWrite(ops, { ordered: false })

        res.status(201).json({ msg: "Attendance Submitted", students: attd})
    } catch (error) {
        console.log(error)
        res.status(400).json({msg: "An Error Occured, Try Again"})
    }
}



// [========================]
//    Recorder...
// [========================]
export async function GetStudentsInfoForRecording(req, res){

    try {
        const {id} = req.params;
        const staff = await Teacher.findOne({regNo: id}).select("assignedSubjects specialRoles staffId fullname displayName");

/*
        const students = await Student.find({ status: "active", realClassId: "class-id"})
        .select("admissionNo regNo fullName")  //aactually it's count docs
*/
        if(!staff){
            return res.status(401).json({
                msg: "Staff Profile not Found!"
            })
        }
        res.status(201).json({
            staff,
            assignment: staff.assignedSubjects,
            msg: "Welcome Back, user...."
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({msg: "An Error Occured, Try Again"})     
    }
}

// ========= Get Selected Class Subjects =================
export const getStudentList = async (req, res) => {
    try {
    const {classId, arm, department, mainClass } = req.query
    
    let stuList;
    if(!arm && !classId && !department){
        stuList = await Student.find({status: "active", realClassNow: {
            mainClass
        }}).sort({ createdAt: -1 })
        .select("regNo admissionNo personalInfo passporturl")
    } else {
        stuList = await Student.find({status: "active", realClassId: classId}).sort({ createdAt: -1 })
        .select("regNo admissionNo personalInfo passporturl")  
    }

    res.status(200).json({
        msg: "Gotten Users",
        students: stuList
    })
    } catch (error) {
        console.log(error)
        res.status(400).json({msg: "An Error Occured, Try Again"})            
    }
}


//====== Get Details for Uploading =======
export const getStudentListForResultsUpload = async (req, res) => {


    try {
        const {classId, staffId, forClass, subject} = req.query;
        
        const Setting = await GeneralSettings.findOne({_id: "general-setup"}).select("setUps");
        if(!classId || !staffId || !forClass || !Setting){
            //error
            res.status(400).json({
                msg: "Unable to get Class List at the moment. You can contact school admin as some required parameters are not found..."
            })
        }

        //validate staff here...

        const set_up = Setting.setUps;

        const prevResults = await Result.find({
            classId, session: set_up.currentSession, term: set_up.currentTerm, subject
        }); //.select("")

        const classList = await Student.find({realClassId: classId}).select("regNo admissionNo passportUrl personalInfo");

        res.status(201).json({
            success: true,
            params: req.query,
            previousScores: prevResults,
            classList,
            currentSettings: set_up,
            msg: "Your Students List has been fetched!"
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: "An Error Occured, Try Again"})     
    }
}

// [==================]
// UPLOADING RESULTS, MAIN AND ADDITIONALS
// [==================]

//get prev records by classId, then upload....
export const uploadAdditionalRecords = async (req, res) => {

    //use editing and upsert true
}

// Download / fetch a unique student result
export const getOneStudentResult = async (req, res) => {
    const {
        admissionNo,
        session,
        term,
        checkerPin
    } = req.query;

    try {
        // --------------------------------------------------
        // 1. Validate required query parameters
        // --------------------------------------------------
        if (!admissionNo || !session || !term || !checkerPin) {
            return res.status(400).json({
                msg: "Admission number, session, term and result-checking PIN are required."
            });
        }

        // --------------------------------------------------
        // 2. Check general result-viewing settings
        // --------------------------------------------------
        const settings = await GeneralSettings
            .findOne({ _id: "general-setup" })
            .select("setUps");

        // --------------------------------------------------
        // 3. Check selected term/session
        // --------------------------------------------------
        const thisTerm = await TermSettings
            .findOne({
                session,
                termName: term
            })
            .select("termName resultsPublished session");

        // Safely check settings and term
        if (
            !settings ||
            !settings.setUps?.resultsViewing ||
            !thisTerm ||
            !thisTerm.resultsPublished
        ) {
            return res.status(400).json({
                msg:
                    "Operation Failed!.. Either Results for Selected Term/Session " +
                    "is not available or Results Checking is Temporarily disabled. " +
                    "You can contact the School Admin for assistance."
            });
        }

        // --------------------------------------------------
        // 4. Validate result-checking PIN
        // --------------------------------------------------
        const checkPin = await ResultPin.findOne({
            pin: checkerPin
        });

        if (!checkPin) {
            return res.status(400).json({
                msg: "The Pin you entered is invalid."
            });
        }

        // Make sure defaults exist even if older PIN records
        // don't have these fields
        const useCount = Number(checkPin.useCount || 0);
        const rounds = Number(checkPin.rounds || 1);

        // --------------------------------------------------
        // 5. Check if PIN has exhausted its usage
        // --------------------------------------------------
        if (useCount >= rounds) {
            return res.status(400).json({
                msg: "The Pin you entered is invalid or already used up..!"
            });
        }

        // --------------------------------------------------
        // 6. Check if PIN is already attached to another student
        // --------------------------------------------------
        if (
            checkPin.user &&
            checkPin.user !== admissionNo
        ) {
            return res.status(400).json({
                msg: "Pin already used for another Result..."
            });
        }

        // --------------------------------------------------
        // 7. If PIN belongs to this student, make sure it is
        //    being used for the same session and term
        // --------------------------------------------------
        if (checkPin.user) {

            if (
                checkPin.session !== session ||
                checkPin.term !== term
            ) {
                return res.status(400).json({
                    msg: "This Pin has already been used for another term/session."
                });
            }
        }

        // --------------------------------------------------
        // 8. Find student
        // --------------------------------------------------
        const student = await Student
            .findOne({ admissionNo })
            .select(
                "personalInfo passportUrl club_house regNo medical currentFee realClassNow"
            );

        if (!student) {
            return res.status(400).json({
                msg: "Student Records not found!"
            });
        }

        // --------------------------------------------------
        // 9. Get additional records
        // --------------------------------------------------
        const additional =
            await AdditionalRecords.findOne({
                userID: admissionNo,
                session,
                term
            }) || null;

        // --------------------------------------------------
        // 10. Get student's results
        // --------------------------------------------------
        const allResults = await Result.find({
            admissionNo,
            session,
            term
        });

        if (!allResults || allResults.length < 2) {
            return res.status(400).json({
                msg: "Student Results not sufficiently available!"
            });
        }

        // --------------------------------------------------
        // 11. Consume / attach PIN
        // --------------------------------------------------

        // First time this PIN is being used
        if (!checkPin.user) {
            checkPin.user = admissionNo;
            checkPin.session = session;
            checkPin.term = term;
        }

        // Increment usage
        checkPin.useCount = useCount + 1;

        await checkPin.save();

        // --------------------------------------------------
        // 12. Return result
        // --------------------------------------------------
        return res.status(200).json({
            msg: "Students Results Fetched Successfully!",

            term: thisTerm,

            otherRecords: additional,

            results: allResults,

            studentClass: {
                mainClass: allResults[0].mainClass,
                classId: allResults[0].classId
            },

            student,

            // Don't return the actual PIN
            pin: "verified"
        });

    } catch (error) {

        console.error(
            "getOneStudentResult Error:",
            error
        );

        return res.status(500).json({
            msg: "Network/Server Error..."
        });
    }
};