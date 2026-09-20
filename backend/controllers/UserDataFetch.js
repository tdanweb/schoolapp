import express from "express";
import mongoose from "mongoose";
import { ClassDetail, GeneralSettings, TermSettings } from "../models/AppSettings.js";
import Student from "../models/Student.js";
import User, { Parent } from "../models/User.js";
import { Teacher } from "../models/Staff.js";
import { ShortUpdate } from "../models/Post.js";
import { WeeklyScore } from "../models/Results.js";

export const fetchDashBoard = async (req, res) => {
    //get dashBord

    try {
        //if admin or chief-admin......
        const settings = await GeneralSettings.findOne({_id: "general-setup"}).select("setUps");
        const term = await TermSettings.findOne({_id: settings.setUps.currentSession + " " + settings.setUps.currentTerm});

        const cls = await ClassDetail.countDocuments();
        const stus = await Student.countDocuments({
            status: "active"
        });
        const allFee = await Student.find({ status: "active" }).select("currentFee");
        const staffInfo = await Teacher.countDocuments({activeStaff: true});

        return res.status(201).json({
            msg: "Admin Dashboard Details",
            settings: settings.setUps,
            term,
            totalClass: cls,
            studentNo: stus,
            noOfStaff: staffInfo,
            feeDetails: getFee(settings.setUps, allFee)
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Network Error"
        })
    }
};


export async function fetchOtherUserDashboard (req, res) {

    try {
        const {id} = req.params;

        const user = await User.findOne({_id: id, approved: true});
        if(!user) return res.status(401).json({
            msg: "User not found or profile not approved!"
        });

        const regNo = user.regNo; const thisUser = user.thisUser;

        const settings = await GeneralSettings.findOne({_id: "general-setup"}).select("setUps");
        const term = await TermSettings.findOne({_id: settings.setUps.currentSession + " " + settings.setUps.currentTerm});

        //check type
        const isParent = thisUser === "parent"
        const isStaff = thisUser === "staff" || thisUser === "admin2" || thisUser === "admin" || thisUser === "chief-admin"
        const isStudent = thisUser === "student"

        const updates = await ShortUpdate.find({
            audience: thisUser
        })
        .populate("poster", "fullname regNo staffType displayName")
        .sort({ createdAt: -1 })
        .limit(3);

        //parent account
        if(isParent){
            const parent = await Parent.findOne({regNo}) || null;


            if(!parent){
              const students = await Student.find({
                 status: "active",
                 parentId: null
             }).select("regNo admissionNo personalInfo.surname personalInfo.firstName realClassId");

                
                return res.status(201).json({
                    parent, success: false, students, isParent, msg: "Parent Profile not found, Kindly complete your Registration below!", 
                    parentInfo: {
                        regNo: user.regNo, 
                        fullname: user.fullname,
                        contactMail: user.email,
                        contactPhone: user.phone,
                        occupation: "",
                        address: ""
                    }
                })
            }

  // ---------------------------------------------------------
  // Parent profile has not been completed
  // ---------------------------------------------------------

  // ---------------------------------------------------------
  // Get the parent's wards
  // ---------------------------------------------------------
  const wards = parent.wards || [];

  const wardRegNos = wards
    .map((ward) => ward.regNo)
    .filter(Boolean);

  // ---------------------------------------------------------
  // Get actual active student records
  // ---------------------------------------------------------
  const students = await Student.find({
    regNo: { $in: wardRegNos },
    status: "active",
  })
    .select(`
      _id
      regNo
      admissionNo
      personalInfo
      passportUrl
      realClassNow
      realClass
      realClassArm
      realDepartment
      realClassId
      currentFee
      status
    `)
    .lean();

  // ---------------------------------------------------------
  // Build student information for parent dashboard
  // ---------------------------------------------------------
  const studentList = students.map((student) => ({
    _id: student._id,

    regNo: student.regNo,
    admissionNo: student.admissionNo,

    personalInfo: {
      surname: student.personalInfo?.surname || "",
      firstName: student.personalInfo?.firstName || "",
      otherName: student.personalInfo?.otherName || "",
      gender: student.personalInfo?.gender || "",
      dob: student.personalInfo?.dob || null,
    },

    fullname: [
      student.personalInfo?.firstName,
      student.personalInfo?.otherName,
      student.personalInfo?.surname,
    ]
      .filter(Boolean)
      .join(" "),

    passportUrl: student.passportUrl || "",

    class: {
      mainClass: student.realClass,
      arm: student.realClassArm,
      classId: student.realClassId,
      department: student.realDepartment,
    },

    realClassNow: student.realClassNow,

    // Current fees
    currentFee: student.currentFee || [],

    status: student.status,
  }));

  // ---------------------------------------------------------
  // Summary
  // ---------------------------------------------------------
  const totalFees = studentList.reduce(
    (sum, student) =>
      sum +
      student.currentFee.reduce(
        (feeSum, fee) => feeSum + (fee.total || 0),
        0
      ),
    0
  );

  const totalPaid = studentList.reduce(
    (sum, student) =>
      sum +
      student.currentFee.reduce(
        (feeSum, fee) => feeSum + (fee.paid || 0),
        0
      ),
    0
  );

  const totalBalance = totalFees - totalPaid;

  // ---------------------------------------------------------
  // Send parent dashboard data
  // ---------------------------------------------------------
 // const settingz = await GeneralSettings.findOne({_id: "general-setup"});
  return res.status(200).json({
    success: true,
    userType: "parent",
    isParent: true,
    setting: settings.setUps,
    updates,
    parent: {
      _id: parent._id,
      regNo: parent.regNo,
      fullname: parent.fullname,
      contactMail: parent.contactMail,
      contactPhone: parent.contactPhone,
      occupation: parent.occupation,
      address: parent.address,

      wardCount: studentList.length,
      wards: studentList,
    },

    summary: {
      totalWards: studentList.length,

      activeWards: studentList.filter(
        (student) => student.status === "active"
      ).length,

      totalFees,
      totalPaid,
      totalBalance,
    },

    msg: `Welcome back, ${parent.fullname}`,
  });


        }

        //
        //  STAFF DASHBOARD
        //
        if(isStaff) { 
        const data = await Teacher.findOne({ regNo, activeStaff: true })
            .select("staffId fullname displayName assignedClass assignedSubjects specialRoles regNo")

        if(!data) return res.status(401).json({
            msg: "User not found or profile not approved!"
        });

        //fetching dashboard, class info firs..
        const staffClass = data.assignedClass; 
        //Staff Account
        let classInfo = null; let classFeeDetails = null; let classAttendance = null
        if(staffClass){
            classInfo = await ClassDetail.findOne({
                classId: staffClass.classId, mainClass: staffClass.mainClass
            }).select("subjectOffered");

            const totalStudents = await Student.countDocuments({status: "active", realClassId: staffClass.classId})
            const feeDetail = await Student.find({status: "active", realClassId: staffClass.classId}).select("currentFee");
            classFeeDetails = getFee(settings.setUps, feeDetail);

            res.status(200).json({
                msg: "Staff Data Fetched....",
                totalStudents,
                classFeeDetails,
                updates,
                staff: data
            });
        }


        }


        //
        // STUDENT DASHBOARD
        //
        if(isStudent){
            const data = await Student.findOne({regNo, status: 'active'})
            .select("personalInfo currentFee realClass realClassId regNo admissionNo passportUrl club_house")
            .lean()
            const currentInfo = await GeneralSettings.findOne({_id: "general-setup"}).select("setUps");
            if(!data) return res.status(400).json({
                msg: "Student not found...."
            })

            const stuClass = await ClassDetail.findOne({classId: data.realClassId}).select("classTeacher subjectsOffered mainClass classId");

            res.status(201).json({
                student: data,
                success: true,
                updates,
                classInfo: stuClass,
                current: currentInfo.setUps,
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error Occured in the Server..."
        })
    }
}

export async function getFeeInfo (req, res) {
    try {
        const {user} = req.query; //regNo from frontend/...

        const check = await User.findOne({regNo: user, approved: true}).select("regNo fullname thisUser");
        const setUp = await GeneralSettings.findOne({_id: "general-setup"});
        const settings = setUp.setUps

        if(!check){
          return  res.status(400).json({
                msg: "User Account not Available....."
            });
        }

        const isStaff = check.thisUser === "admin2" || check.thisUser === "admin" || check.thisUser === "chief-admin"
        const isParent = check.thisUser === "parent"

        //get payHistory along....
       
        if(isStaff){
            //get student fee
            const allStudents = await Student.find({status: "active"}).select("admissionNo realClassId regNo passportUrl currentFee");
            const staffInfo = await Teacher.findOne({regNo: user, activeStaff: true}).select("fullname email phone staffType signature specialRoles")

            res.status(201).json({
                students: allStudents,
                staffInfo,
                settings,
                feeInfo: getFee(settings, allStudents)
            })

            return;
        }


        //parent account
        if(isParent){
            const parent = await Parent.findOne({regNo: user, status: "active"})

            if(!parent){
                return res.status(400).json({msg: "Parent Account Nof Found!"})
            }

            const wards = parent.wards

            return res.status(201).json({
                parent
            })
        }

        //otherwise treat as student
        const student = await Student.findOne({regNo: user, status: "active"}).select("personalInfo passportUrl admissionNo realClassId realClass currentFee")
        if(!student){
          return  res.status(400).json({
                msg: "Student Account not Available....."
            });
        }

        res.status(201).json({
            student, settings
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Network Error"
        })        
    }
};



// weekly performance of students...
export async function GetCAOfStudent(req, res) {
  try {
    const { regNo } = req.query;

    if (!regNo) {
      return res.status(400).json({
        msg: "Registration number is required.",
      });
    }

    const settings = await GeneralSettings.findById("general-setup");

    if (!settings) {
      return res.status(400).json({
        msg: "General settings are not available...",
      });
    }

    const set_up = settings.setUps;
    const week = set_up.schoolWeek;

    // ---------------------------------------------------
    // 1. CHECK IF USER IS A PARENT
    // ---------------------------------------------------
    const isParent = await Parent.findOne({ regNo });

    if (isParent) {
      const wardList = [];
      let allScores = [];

      // Get all wards from the parent record
      for (const ward of isParent.wards) {
        const student = await Student.findOne({
          _id: ward.studentId,
          status: "active",
        }).select(
          "admissionNo regNo realClassId personalInfo.surname personalInfo.firstName personalInfo.otherName"
        );

        // Skip ward if student record no longer exists/is inactive
        if (!student) continue;

        const classInfo = await ClassDetail.findOne({
          classId: student.realClassId,
        }).select("subjectOffered -_id");

        if (!classInfo) continue;

        // Get this ward's weekly CA
        const wardScores = await WeeklyScore.find({
          admissionNo: student.admissionNo,
          session: set_up.currentSession,
          term: set_up.currentTerm,
          classId: student.realClassId,
        })
          .select(
            "studentId max score week subject admissionNo day -_id"
          )
          .populate(
            "studentId",
            "personalInfo.surname personalInfo.firstName personalInfo.otherName realClassId -_id"
          );

        // Add this ward's scores to the common score array
        allScores = [...allScores, ...wardScores];

        // Information frontend can use to separate/display wards
        wardList.push({
          studentId: student._id,
          fullname: `${student.personalInfo?.firstName || ""} ${
            student.personalInfo?.otherName || ""
          } ${student.personalInfo?.surname || ""}`.trim(),
          admissionNo: student.admissionNo,
          regNo: student.regNo,
          classId: student.realClassId,
          subjects: classInfo.subjectOffered.map((sub) => sub.name),
        });
      }

      return res.status(200).json({
        success: true,
        msg: "Your wards' scores have been fetched!",
        thisTermScores: allScores,
        appSettings: set_up,
        week,
        isParent: true,
        wardList,
      });
    }

    // ---------------------------------------------------
    // 2. NORMAL STUDENT
    // ---------------------------------------------------
    const verify = await Student.findOne({
      regNo,
      status: "active",
    }).select(
      "admissionNo regNo realClassId personalInfo.surname personalInfo.firstName personalInfo.otherName -_id"
    );

    if (!verify) {
      return res.status(400).json({
        msg: "Unable to get User Weekly Scores.. Access denied",
      });
    }

    const classInfo = await ClassDetail.findOne({
      classId: verify.realClassId,
    }).select("subjectOffered -_id");

    if (!classInfo) {
      return res.status(400).json({
        msg: "Class information is not available...",
      });
    }

    const myCa = await WeeklyScore.find({
      admissionNo: verify.admissionNo,
      session: set_up.currentSession,
      term: set_up.currentTerm,
      classId: verify.realClassId,
    })
      .select(
        "studentId max score week subject admissionNo day -_id"
      )
      .populate(
        "studentId",
        "personalInfo.surname personalInfo.firstName personalInfo.otherName realClassId -_id"
      );

    res.status(200).json({
      success: true,
      msg: "Your scores have been fetched!",
      thisTermScores: myCa,
      appSettings: set_up,
      week,
      isParent: false,
      subjects: classInfo.subjectOffered.map((sub) => sub.name) || [],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "Network or Server Error...",
    });
  }
}



const getFee = (params, arr) => {
    let total = 0; let paid = 0
  //  total: , paid: 
  for(let p=0; p<arr.length; p++){
    let fee = arr[p].currentFee //also an array...

    const n  = fee.findIndex(k => k.session === params.currentSession && k.term === params.currentTerm);
    total += fee[n].total || 0
    paid += fee[n].paid || 0
  }

  return({
    total, paid, outstanding: total-paid
  })
}