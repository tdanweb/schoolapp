import express from "express";
import { ClassDetail, GeneralSettings, TermSettings } from "../models/AppSettings.js";
import Student from "../models/Student.js";
import User from "../models/User.js";
import { Teacher } from "../models/Staff.js";

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

        res.status(201).json({
            msg: "Backend Connected!..."
        })
        //Staff Account


        if(isStaff) { 
        const data = await Teacher.findOne({ regNo, activeStaff: true })
            .select("staffId fullname displayName assignedClass assignedSubjects specialRoles regNo")

        if(!data) return res.status(401).json({
            msg: "User not found or profile not approved!"
        });

        //fetching dashboard, class info firs..
        const staffClass = data.assignedClass; let classInfo = null; let classFeeDetails = null; let classAttendance = null
        if(assignedClass){
            classInfo = await ClassDetail.findOne({
                classId: staffClass.classId, mainClass: staffClass.mainClass
            }).select("subjectOffered");

            const totalStudents = await Student.countDocuments({status: "active"})
            const feeDetail = await Student.find({status: "active", realClassId: staffClass.classId}).select("currentFee");
            classFeeDetails = getFee(settings.setUps, feeDetail);

            res.status(200).json({
                msg: "Staff Data Fetched....",
                totalStudents,
                classFeeDetails,
                staff: data
            });

        }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error Occured in the Server..."
        })
    }
}