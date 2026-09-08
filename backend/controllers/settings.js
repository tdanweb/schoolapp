import { ClassDetail, GeneralSettings, Subject, AdmissionSetting, HomeUpdate } from "../models/AppSettings.js";
import express from "express";
import {TermSettings} from "../models/AppSettings.js";
import { Teacher } from "../models/Staff.js";
import User from "../models/User.js";
import Applicant from "../models/Applicant.js";


export const getSettings = async (req, res) => {

    try {
    const settings = await GeneralSettings.findOne({_id: "general-setup"});
    if(!settings) return res.status(400).json({ msg: "No Settings configured yet"});

    const terms = await TermSettings.find().sort({ createdAt: -1 }).select("_id termName session");
    const termSetting = await TermSettings.findOne({ _id: settings.setUps.currentSession + " " + settings.setUps.currentTerm});
   
    res.status(200).json({
        msg: "Edit Web App Functionalities as Chief Admin",
        settings,
        terms,
        termSetting
    });

    } catch (error) {
        console.log(error);
        res.status(401).json({ msg: "Network Error, Try Again...."})
    }
};


export const updateSettings = async (req, res) => {
  try {
//    const user = await User.findById(req.params.userId);

    /*
    return res.status(200).json({
        msg: "You are Authenticated as " + user.thisUser + " and can update settings",
        user
    });
    */
    //use id track regno and whatever you need from his/her profile....
    const {currentSession, currentTerm} = req.body;

    const check = await TermSettings.findOne({ _id: currentSession + " " + currentTerm});
    if(!check){
        return res.status(400).json({ msg: "Selected Term has not been added!"});
    }

    const savedSettings = await GeneralSettings.findOne({_id: "general-setup"});

    if(savedSettings){
        if(savedSettings.setUps.currentSession !== currentSession || savedSettings.setUps.currentTerm !== currentTerm){
        const token = req.body.adminToken;

        if(token !== "daniel-1999"){
        return res.status(400).json({
            msg: "Settings not allowed for now! Delicate Task requires Admin Correct Access Token..."
        });
        }
    }

    //update site whole Information
    };

    check.resultsPublished = req.body.setting.termResultsPublished
    await check.save();

    const newSettings = await GeneralSettings.findOneAndUpdate({_id: "general-setup"}, 
        {$set: {
            setUps : req.body.setting,
            homepageUpdates: req.body.posts,
        }},
        {new: true, upsert: true, runValidators: true}
    );

    res.status(201).json({
        msg: "Settings Updated Successfully!",
        settings: newSettings
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
        msg: "Unable to Update Settings now...",
        error
    })
  }
};

// [ =========== Admission Settings =================]

export const admissionSettingUpdate = async (req, res) => {
    try {
        const {data} = req.body;

    const newSettings = await AdmissionSetting.findOneAndUpdate({_id: "admission"}, 
        {$set: {
            settings : req.body.setting
        }},
        {new: true, upsert: true, runValidators: true}
    );

    res.status(201).json({
        msg: "Admission Portal Settings Updated Successfully!",
        settings: newSettings
    });

    } catch (error) {
        res.status(500).json({
            msg: "Server Error!"
        })
    }
}

export const getAdmSettings = async (req, res) => {
    try {
        const data = await AdmissionSetting.findOne({_id: "admission"});
      
        if(!data){
            res.status(400).json({
                msg: "Admission Settings is yet to be configured!"
            });
        }

        const qts = await Applicant.countDocuments({ streamId: data.settings.session }) || 0
        res.status(201).json({
            settings: data.settings,
            qts,
            msg: "Gotten Configured Settings for the App."
        })
    } catch (error) {
        res.status(500).json({
            msg: "Server Error!"
        })  
    }
}



export const updatePost = async (req, res) => {
    try {
    const posting = await GeneralSettings.findOne({_id: "general-setup"}).select("homepageUpdates");
    if(posting.length <=4){
        //continue
        
    } else {

    }

    const updates = await GeneralSettings.findOneAndUpdate({_id: "general-setup"}, 
        {$set: {
            homepageUpdates : req.body
        }},
        {new: true, upsert: true, runValidators: true}
    );

    res.status(201).json({
        msg: "Post have been Updated",
        updates
    })
    } catch (error) {
    res.status(500).json({
        msg: "Unable to Update Settings now...",
        error
    })        
    }
};


//[======= Adding Terms and Holidays =======]
export const addTerm = async (req, res) => {
    try {
        const {termName, session} = req.body
        const isTermExist = await TermSettings.findOne({_id: session + " " + termName});

        if(isTermExist) {
            //edit here to update the term settings instead of creating a new one
            return res.status(400).json({msg: "Term Settings for this Session and Term already exist, Please Update it instead..."})
        }
        const newTerm = await TermSettings.create({
            _id: session + " " + termName,
            ...req.body
        });
        res.status(201).json({
            msg: "Term Settings Added Successfully!",
            term: newTerm
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Unable to Add Term now...",
            error
        })
    }
};


export  const addHoliday = async (req, res) => {
    try {
        const term = await TermSettings.findOne({_id: "term-setup"});
        term.holidays.push(req.body);
        await term.save();
        res.status(201).json({
            msg: "Holiday Added Successfully!",
            holidays: term.holidays
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Unable to Add Holiday now...",
            error
        })
    }
};


export const getTermSettings = async (req, res) => {
    try {
        const settings = await GeneralSettings.findOne({_id: "general-setup"});
       
       //this should only be for when setting up. What an Error
       // 
       /*
        const termSettings = await TermSettings.findOne({ _id: settings.setUps.currentSession + " " + settings.setUps.currentTerm});

        if(!termSettings) {
            return res.status(400).json({ msg: "No Term Settings Found, Please select a valid term..."})
        };  */
        if(!settings) {
            return res.status(400).json({ msg: "No Term Settings Found, Please add one..."})
        }   
        res.status(200).json({
            msg: "Term Settings Retrieved Successfully!",
            settings
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Unable to Retrieve Term Settings now...",
            error
        })
    }   
};


export const getAllTerms = async (req, res) => {
    try {
        const terms = await TermSettings.find().sort({ createdAt: -1 });
        res.status(201).json({
            success: true,
            terms
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Unable to get added terms"
        });
        console.log(error)
    }
}


// [====== Classroom and Subjects ==========]
export async function addSubject(req, res){
    //chief-admin only..
    const subjects = req.body;
    
    try {
        const check =  Array.isArray(subjects) || subjects.length > 0;

        if(!check){
            return res.status(200).json({success: false, msg: "Please Enter Valid Subjects"})
        }

        const saved = await Subject.insertMany(subjects, {
            ordered: false, runValidators: true
        });
        
        res.status(200).json({
            success: true,
            msg: saved.length + " Subjects Added Successfully...",
            saved
        });

    } catch (err) {
        res.status(500).json({
            success: false, msg: "Unable to add! An error Occured",
            error: err
        })
    }
};


export async function getAllSubjects(req, res){
    try {
        const subjects = await Subject.find()
        .sort({ createdAt: -1});
        //get Teacher 
        const teachers = await Teacher.find({ staffCategory: "teaching" })
        .sort({createdAt: -1})
        .select("regNo fullname email staffId");
        const classes = await ClassDetail.find()
        .sort({ createdAt: -1 })

        res.status(201).json({
            success: true,
            subjects,
            teachers,
            classes
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server Error",
            error
        })
    }
}

// [============= CLASSES ==============]
export async function addNewClass(req, res){
    const {mainClass, department, arm, classTeacherX, subjectOffered} = req.body; 

    const search = await ClassDetail.findOne({classId: mainClass + arm + " " + department})

    if(search){
        return res.status(400).json({
            msg: "This class has already being added! You can only edit things like Class Info, Class Teacher and Subjects Offered."
        }) }

    try {
       // const teacherx = await Teacher.findOne({regNo: classTeacher}).select("regNo staffId fullname");
       const idOfClass = (mainClass + arm + " " + department).trim();

       //if teacher is already assigned, disallow it's registration again...
       const tchr = await Teacher.findOne({ regNo: classTeacherX }).select("assignedClass fullname regNo staffId specialRoles");

       if(!tchr) return res.status(400).json({ msg: "The selected Staff Profile does not exist, Please Check the Reg. NO to check"})
       if(tchr.assignedClass.classId){
        return res.status(400).json({
            msg: "The Teacher seems to be assigned to another class. You must removed the assigned class before you can re-assign a teacher. Kindly check staff profile to confirm.."
        })
       }

        const teacher = await Teacher.findOneAndUpdate(
            {regNo: classTeacherX}, 
            { $set: {
                assignedClass: {arm, department, mainClass, classId: idOfClass },
                specialRoles: {isClassTeacher: true, ...tchr.specialRoles}
        } },
            {new: true, upsert: true}
        ).select("regNo fullname assignedClass email staffId"); //also change Teacher assigned class

        if(!teacher){
            return res.status(400).json({ msg: "This Staff Member cannot be found. Select a valid one"})
        }

 //       return res.status(200).json({ msg: "Teacher is Updated",  teacher });

        const clazz = await ClassDetail.create({
            ...req.body,
            
            classId: idOfClass,
            arm,
            department,
            classTeacher: {
                regNo: teacher.regNo,
                fullname: teacher.fullname,
                email: teacher.email,
                staffId: teacher.staffId
            },
            mainClass,
            subjectOffered
        });

        res.status(201).json({
            msg: "Your Class has been added!",
            data: clazz
        });

    } catch (error) {
        console.error(error.message)
        res.status(500).json({
            msg: "Server Error! Ensure you select a valid teacher",
            error
        })
    }
}


export const getAllClass = async (req, res) => {

    try {
        const num = await ClassDetail.countDocuments();
        const classes = await ClassDetail.find()
        .sort({ createdAt: -1 })
        .select("mainClass classId feeInfo");

        res.status(200).json({
            data: classes,
            msg: num + " Classes have been added by the Admin"
        })
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            msg: "Network Error! Unable to fetch class details",
            success: false
        })
    }
}

// [=========== HomePage Updates ---------------]
export const fetchHomePost = async (req, res) => {
    try {
        const posts = await HomeUpdate.aggregate([
            {
                $lookup: {
                    from: "teachers",
                    localField: "regNo",
                    foreignField: "regNo",
                    as: "user"
                }
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    posterName: "$user.fullname"
                }
            },
            {
                $project: {
                    poster: 0
                }
            }
        ])

        res.status(201).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: "Unable to fetch Home Post. Server Error"
        })
    }
}