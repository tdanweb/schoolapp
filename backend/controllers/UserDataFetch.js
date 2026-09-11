import express from "express";
import mongoose from "mongoose";
import { ClassDetail, GeneralSettings, TermSettings } from "../models/AppSettings.js";
import Student from "../models/Student.js";
import User, { Parent } from "../models/User.js";
import { Teacher } from "../models/Staff.js";
import { ShortUpdate } from "../models/Post.js";

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