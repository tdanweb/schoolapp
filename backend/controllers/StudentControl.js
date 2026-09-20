import Student from "../models/Student.js";
import mongoose from "mongoose";
import { generateId } from "./UserControls.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Applicant from "../models/Applicant.js";
import { ClassDetail, GeneralSettings, TermSettings } from "../models/AppSettings.js";
/*
|--------------------------------------------------------------------------
| ADD / EDIT STUDENT
|--------------------------------------------------------------------------
| If admissionNo or regNo already exists:
| - Update the existing student
|
| If neither exists:
| - Create a new student
|--------------------------------------------------------------------------
*/

export const addStudent = async (req, res) => {
  
  try {
    let admNo; let regNum
    const {admissionNo, regNo} = req.body;

    const setting = await GeneralSettings.findById("general-setup");

    if(!setting.setUps.registrationIsOpened){
      return res.status(400).json({
        msg: "Students Enrollement is Disabled presently!",
        success: false
      })
    }

    if(admissionNo){
      //TRIGGER REUSE
      admNo = admissionNo
      regNum = regNo;
    } else {
      admNo = `AIA/${await generateId("admission-no")}`;
      regNum = `SCH${await generateId("reg-no")}`
    }


    const {
      personalInfo,
      contact,
      academic,
      guardians,
      medical
    } = req.body;


    // Required fields
    if (
      !admNo ||
      !regNum ||
      !personalInfo?.surname ||
      !personalInfo?.firstName ||
      !personalInfo?.gender ||
      !personalInfo?.dob ||
      !academic?.currentClass ||
      !academic?.session ||
      !academic?.term ||
      !guardians?.name 
    ) {
      return res.status(400).json({
        success: false,
        msg: "Please provide all required student information",
      });
    }

    /*
    // Check if student already exists
    const existingStudent = await Student.findOne({
      $or: [{ admissionNo: admNo }, { regNo: regNum }],
    });

    // =========================
    // EDIT EXISTING STUDENT
    // =========================

    if (existingStudent) {
      existingStudent.admissionNo = admNo;
      existingStudent.regNo = regNum;
      existingStudent.personalInfo = personalInfo;
      existingStudent.contact = contact;
      existingStudent.academic = academic;
      existingStudent.guardians = guardians;
      existingStudent.medical = medical;


      await existingStudent.save();

      return res.status(200).json({
        success: true,
        msg: "Student updated successfully",
        student: existingStudent,
      });
    }
*/
    // =========================
    // ADD NEW STUDENT
    // =========================
    const realClassNow = await ClassDetail.findById(academic.currentClass).select("classId mainClass department arm feeInfo");
    if (!realClassNow) {
      return res.statu(401).json({msg: "Class not Found"})
    }
    //create fee
    const studentFee = {
      total: realClassNow.feeInfo.total,
      session: setting.setUps.currentSession,
      term: setting.setUps.currentTerm,
      breakdown: realClassNow.feeInfo.breakdown
    };

    const mypass = await bcrypt.hash(regNum, 10);

    const studentLogins = await User.create({
      regNo: regNum, 
      lastname: personalInfo.surname,
      fullname: personalInfo.surname.toUpperCase() + " " + personalInfo.firstName, 
      thisUser: "student", 
      password: mypass, //hashed password
      approved: true,
      phone: contact.phone,
      email: regNum,
      mail: contact.email,
      passport: personalInfo.passport
    });

    const student = await Student.create({
      ...req.body,
      admissionNo: admNo,
      regNo: regNum,
      personalInfo: {
        ...personalInfo,
        fullname: personalInfo.surname.toUpperCase() + " " + personalInfo.firstName
      },
      contact,
      academic,
      guardians,
      medical,
      realClassNow,
      realClassId: realClassNow.classId,
      realClass: realClassNow.mainClass,
      realClassArm: realClassNow.arm,
      realDepartment: realClassNow.department,
      currentFee: [studentFee]
    });

    return res.status(201).json({
      success: true,
      msg: "Student registered successfully",
      student,
      logins: "Your Email is: " + studentLogins.mail + " and REG. NUM: " + regNum + 
      ". Your Portal access ID is your Registration No, and initial password is also your Registration No. You can change your password later"
      //initial password is reg NO in capital letters
    });

  } catch (error) {
    console.error("ADD STUDENT ERROR:", error);

    // Duplicate unique field
    if (error.code === 11000) {
      console.log(error)
      return res.status(409).json({
        success: false,
        msg: "Admission number or registration number already exists",
      });
    }

    return res.status(500).json({
      success: false,
      msg: "Unable to register student, Server Error",
      error: error.message,
    });
  }
};


/*
|--------------------------------------------------------------------------
| FETCH ONE STUDENT PROFILE
|--------------------------------------------------------------------------
| Find student by:
| - MongoDB ID
| - Admission Number
|
| Used for student profile preview
|--------------------------------------------------------------------------
*/
export const loadStudent = async (req, res) => {

  try {
    const {regNo, admissionNo} = req.body;
    const streamId = "2026-27" //universally set by the admin in GeneraAPpSettings....

    const findStudent = await Student.findOne({regNo, admissionNo}).select("regNo admissionNo");

    if(findStudent){
      return res.status(400).json({
        msg: "This Student is already enrolled on the School Portal...",
        success: false
      })
    }

    const checkApplicant = await Applicant.findOne({regNo, admissionNo, status: "admitted", streamId});
    if(!checkApplicant){
      return res.status(400).json({
        success: false,
        msg: "Unable to  get this Applicant. Please make sure The ID submitted are correct, the Candidate is already admitted, and the admission session is for stream: " + streamId
      });
    } else{
      return res.status(200).json({
        msg: "User Details Fetched",
        success: true,
        student: checkApplicant
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Error in the Server"
    });

    console.log(error.message)
  }
}


//getting profile
export const getStudent = async (req, res) => {
  try {
    const  {regNo, admissionNo} = req.query;
  

    if (!regNo && !admissionNo) {
      return res.status(400).json({
        success: false,
        msg: "Student registration number or admission number is required",
      });
    }
    const student = await Student.findOne({regNo}) || await Student.findOne({admissionNo});
    if (!student) {
      return res.status(404).json({
        success: false,
        msg: "Student not found",
      });
    }
    const stu_class = await ClassDetail.findById(student.academic.currentClass).select("classId mainClass")

    return res.status(200).json({
      success: true,
      msg: "Profile Found for: " + student.personalInfo.surname + ", " + student.personalInfo.firstName,
      student,
      stu_class
    });
  } catch (error) {
    console.error("GET STUDENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch student",
      error: error.message,
    });
  }
};


/*
|--------------------------------------------------------------------------
| FETCH ALL STUDENTS
|--------------------------------------------------------------------------
| 30 students per page
|
| Returns:
| - admissionNo
| - full name
| - class
| - status
|
| Supports:
| - Pagination
| - Search
|--------------------------------------------------------------------------
*/

export const getAllStudents = async (req, res) => {

  const page = req.query.page
  try {
    res.status(201).send({
      msg: "Server Connected!"
    })
  } catch (error) {
    
  }

  return;


  // [================= Complicated Fetched Functions... =====================]
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = 30;

    const skip = (page - 1) * limit;

    const search = req.query.search?.trim();

    const filter = {};

    /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */

    if (search) {
      filter.$or = [
        {
          admissionNo: {
            $regex: search,
            $options: "i",
          },
        },

        {
          regNo: {
            $regex: search,
            $options: "i",
          },
        },

        {
          "personalInfo.surname": {
            $regex: search,
            $options: "i",
          },
        },

        {
          "personalInfo.firstName": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const [students, totalStudents] = await Promise.all([
      Student.find(filter)
        .select(
          "admissionNo regNo personalInfo.surname personalInfo.firstName personalInfo.otherName academic status"
        )
        .populate({
          path: "academic.currentClass",
          select: "name",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Student.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalStudents / limit);

    const formattedStudents = students.map((student) => ({
      _id: student._id,

      admissionNo: student.admissionNo,

      regNo: student.regNo,

      name: [
        student.personalInfo?.surname,
        student.personalInfo?.firstName,
        student.personalInfo?.otherName,
      ]
        .filter(Boolean)
        .join(" "),

      classInfo: student.academic?.currentClass
        ? {
            _id: student.academic.currentClass._id,
            name: student.academic.currentClass.name,
            arm: student.academic.arm,
          }
        : null,

      status: student.status,
    }));

    return res.status(200).json({
      success: true,

      students: formattedStudents,

      pagination: {
        currentPage: page,
        limit,
        totalStudents,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("GET ALL STUDENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch students",
      error: error.message,
    });
  }
};