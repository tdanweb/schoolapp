import express from 'express';
import User, { Parent } from '../models/User.js';
import { addUser, approveUser, getUsers, logInApplicant, logInUser, profileLoader, protect, protectedRoute, testAuth } from '../controllers/UserControls.js';
import { getStaff, getStaffForClass, getStaffToAssign, loadStaffUser, registerStaff } from '../controllers/TeacherController.js';
import authMiddleware from '../middlewares/auth.js';
import { TermSettings } from '../models/AppSettings.js';
import { addNewClass } from '../controllers/settings.js';
import {Teacher} from '../models/Staff.js';
import upload2 from '../cloudinaryMedia.js';
import { cloudinary } from '../cloudinaryMedia.js';
import Student from '../models/Student.js';
import { fetchDashBoard } from '../controllers/UserDataFetch.js';

const router = express.Router();

// @route   POST /api/users
// @desc    Register a new user
router.get("/auth", testAuth)
router.get("/user/me", protect, testAuth);

// @access  Public
router.post('/user', addUser)
router.post("/user/login", logInUser)
router.get("/users", getUsers)
router.put("/user/approve", approveUser);
router.get("/user/protected", authMiddleware, protectedRoute);
router.get("/user/profile/:id", profileLoader);

//space for teachers profile
router.get("/user/staff/load", loadStaffUser);
router.post("/user/staff/enroll", registerStaff);

router.get("/user/staff", getStaff)
router.get("/user/get-staff", getStaffToAssign)
router.get("/user/staff/roles/:id", getStaffForClass)
//GET ONE STAFF BY ID:

//space for classroom...

// [===========Applicants =============]
router.post("/user/applicant/login", logInApplicant)



// ===============================
// ADD / REPLACE STAFF MEDIA
// ===============================

router.post(
  "/user/staff/add-media/:id",
  upload2.fields([
    { name: "passport", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // 1. GET STAFF & USER
      const staff = await Teacher.findById(req.params.id);
      if (!staff) {
        return res.status(404).json({ success: false, msg: "Staff record not found." });
      }

      const userId = await User.findOne({ regNo: staff.regNo });
      if (!userId) {
        return res.status(404).json({ success: false, msg: "Associated user account not found." });
      }

      // 2. READ MULTER-CLOUDINARY FILE OUTPUTS
      // Note: multer-storage-cloudinary populates file.path (URL) and file.filename (public_id)
      const passportFile = req.files?.passport?.[0];
      const signatureFile = req.files?.signature?.[0];

      if (!passportFile && !signatureFile) {
        return res.status(400).json({
          success: false,
          msg: "Please select a passport or signature to upload.",
        });
      }

      // 3. DELETE OLD PASSPORT IF NEW ONE UPLOADED
      if (passportFile && staff.passportId) {
        try {
          await cloudinary.uploader.destroy(staff.passportId, { resource_type: "image" });
        } catch (err) {
          console.error("Old passport cleanup failed:", err.message);
        }
      }

      // 4. DELETE OLD SIGNATURE IF NEW ONE UPLOADED
      if (signatureFile && staff.signatureId) {
        try {
          await cloudinary.uploader.destroy(staff.signatureId, { resource_type: "image" });
        } catch (err) {
          console.error("Old signature cleanup failed:", err.message);
        }
      }

      // 5. UPDATE DB RECORDS
      if (passportFile) {
        staff.passportUrl = passportFile.path;       // Cloudinary URL
        staff.passportId = passportFile.filename;    // Cloudinary Public ID
        userId.passport = passportFile.path;
      }

      if (signatureFile) {
        staff.signature = signatureFile.path;        // Cloudinary URL
        staff.signatureId = signatureFile.filename;  // Cloudinary Public ID
      }

      await staff.save();
      await userId.save();

      return res.status(200).json({
        success: true,
        msg: "Staff media updated successfully.",
        staff,
      });
    } catch (error) {
      console.error("Staff media upload error:", error);
      return res.status(500).json({
        success: false,
        msg: "Unable to upload staff media.",
        error: error.message,
      });
    }
  }
);



//dashboard -- main point for getting basic details
router.get("/user/dashboard-home/:id", 
  //drop auth here
  async (req, res) => {
  const {id} = req.params;

  //const userId as decoded from auth.. then remove params
  return res.status(200).json({
    msg: "Dashboard Data Fetched for Home View Backend is well connected!",
    userId: id
  });
  try {
    const checkUser = await User.findById(id);

    if(!checkUser || !checkUser.approved){
      return res.status(400).json({
        msg: "The User Profile is unapproved or not found!"
      })
    }

    let user_data;

    if(checkUser.thisUser === "student") {
      user_data = await Student.findOne({regNo: checkUser.regNo}).select("personalInfo admissionNo regNo realClassNow");
      if(!user_data || user_data.status !== "active"){
        return res.status(400).json({
          msg: "The Student Profile is unapproved or not found!"
        });     
      }

      res.status(200).json({
        success: true,
        student: user_data
      });
    } 
    else 
      if (checkUser.thisUser === "parent") 
        {

    } else 
      {
    if(checkUser.thisUser !== "applicant") {
        user_data = await Teacher.findOne({regNo: checkUser.regNo}).select("specialRoles regNo staffId displayName fullname");


        if(!user_data){
          return res.status(400).json({
            msg: "Unable to get your data, kindly logout and login again if possible...", success: false
          });
        }

        let adminData = null;
        if(user_data.specialRoles.includes("admin") || user_data.specialRoles.includes("chief-admin")) { 
          //adminData = await fetchDashBoard();
         }

        res.status(200).json({
          msg: "Staff Data Fetched",
          staff: user_data,
          adminData: adminData,
          //classTeacher asssignmets
        });
      }
//strictly staff

    
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: "An error occured in the server."
    })
  }
});



router.get("/user/dashboard-main/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // =========================================================
    // 1. GET USER ACCOUNT
    // =========================================================
    const checkUser = await User.findById(id).lean();

    if (!checkUser) {
      return res.status(404).json({
        success: false,
        msg: "User account not found.",
      });
    }

    if (!checkUser.approved) {
      return res.status(403).json({
        success: false,
        msg: "Your user account has not been approved.",
      })
    }

    const userType = checkUser.thisUser;


    // =========================================================
    // 2. STUDENT DASHBOARD
    // =========================================================
    if (userType === "student") {
      const student = await Student.findOne({
        regNo: checkUser.regNo,
      })
        .select(`
          personalInfo
          regNo
          admissionNo
          realClassNow
          realDepartment
          realClass
          realClassArm
          status
          passportUrl
        `)
        .lean();

      if (!student || student.status !== "active") {
        return res.status(404).json({
          success: false,
          msg: "The Student Profile is unapproved or not found!",
        });
      }

      return res.status(200).json({
        success: true,
        userType: "student",

        student: {
          _id: student._id,
          regNo: student.regNo,
          admissionNo: student.admissionNo,

          fullname: [
            student.personalInfo?.firstName,
            student.personalInfo?.otherName,
            student.personalInfo?.surname,
          ]
            .filter(Boolean)
            .join(" "),

          personalInfo: student.personalInfo,

          passportUrl: student.passportUrl,

          class: {
            mainClass: student.realClass,
            arm: student.realClassArm,
            classId: student.realClassNow?.classId,
            department: student.realDepartment,
          },

          status: student.status,
        },

        msg: `Welcome back, ${student.personalInfo?.surname || "Student"}`,
      });
    }

    // =========================================================
    // 3. STAFF / ADMIN DASHBOARD
    // =========================================================
    if (
      userType === "staff" ||
      userType === "admin2" ||
      userType === "admin" ||
      userType === "chief-admin"
    ) {
      const staff = await Teacher.findOne({
        regNo: checkUser.regNo,
        activeStaff: true,
      })
        .select(`
          _id
          specialRoles
          regNo
          staffId
          displayName
          fullname
          staffCategory
          staffType
          passportUrl
          assignedClass
          assignedSubjects
        `)
        .lean();

      if (!staff) {
        return res.status(404).json({
          success: false,
          msg: "The Staff Profile is unapproved or not found!",
        });
      }

      return res.status(200).json({
        success: true,
        userType,

        staff: {
          _id: staff._id,
          regNo: staff.regNo,
          staffId: staff.staffId,

          fullname: staff.fullname,
          displayName: staff.displayName,

          staffCategory: staff.staffCategory,
          staffType: staff.staffType,

          passportUrl: staff.passportUrl,

          specialRoles: staff.specialRoles || {},

          assignedClass: staff.assignedClass || null,

          assignedSubjects: staff.assignedSubjects || [],

          // Useful for dashboard cards
          subjectCount: staff.assignedSubjects?.length || 0,

          isAdmin:
            staff.specialRoles?.isAdmin === true ||
            staff.specialRoles?.chiefAdmin === true ||
            userType === "admin" ||
            userType === "chief-admin",

          isChiefAdmin:
            staff.specialRoles?.chiefAdmin === true ||
            userType === "chief-admin",
        },

        msg: `Welcome back, ${
          staff.displayName || staff.fullname || "Staff"
        }`,
      });
    }

    // =========================================================
    // 4. PARENT DASHBOARD
    // =========================================================
    if (userType === "parent") {
      const parent = await Parent.findOne({
        regNo: checkUser.regNo,
      })
        .select(`
          _id
          regNo
          fullname
          email
          phone
          wards
          status
        `)
        .lean();

      if (!parent || parent.status !== "active") {
        return res.status(404).json({
          success: false,
          msg: "Parent's Profile is unapproved or not found!",
        });
      }

      /*
       * Parent wards are expected to contain student references/details.
       *
       * Example:
       * wards: [
       *   {
       *     studentId,
       *     fullname,
       *     admissionNo,
       *     regNo
       *   }
       * ]
       */

      const wards = parent.wards || [];

      // ---------------------------------------------------------
      // Get actual student information for the parent's wards
      // ---------------------------------------------------------
      const wardRegNos = wards
        .map((ward) => ward.regNo)
        .filter(Boolean);

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
          status
        `)
        .lean();

      // ---------------------------------------------------------
      // Build student dashboard information
      // ---------------------------------------------------------
      const studentList = students.map((student) => ({
        _id: student._id,

        regNo: student.regNo,
        admissionNo: student.admissionNo,

        fullname: [
          student.personalInfo?.firstName,
          student.personalInfo?.otherName,
          student.personalInfo?.surname,
        ]
          .filter(Boolean)
          .join(" "),

        passportUrl: student.passportUrl,

        class: {
          mainClass: student.realClass,
          arm: student.realClassArm,
          classId: student.realClassNow?.classId,
          department: student.realDepartment,
        },

        status: student.status,
      }));

      return res.status(200).json({
        success: true,
        userType: "parent",

        parent: {
          _id: parent._id,
          regNo: parent.regNo,
          fullname: parent.fullname,
          email: parent.email,
          phone: parent.phone,

          wardCount: studentList.length,

          wards: studentList,
        },

        // Convenient dashboard summary
        summary: {
          totalWards: studentList.length,

          activeWards: studentList.filter(
            (student) => student.status === "active"
          ).length,

          // Placeholder for future fee calculations
          totalFees: 0,
          totalPaid: 0,
          totalBalance: 0,
        },

        msg: `Welcome back, ${parent.fullname}`,
      });
    }

    // =========================================================
    // 5. UNKNOWN / UNSUPPORTED USER TYPE
    // =========================================================
    return res.status(403).json({
      success: false,
      msg: "You do not have access to this dashboard. Kindly contact the school admin for assistance.",
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    // Handle invalid MongoDB ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        msg: "Invalid user ID.",
      });
    }

    return res.status(500).json({
      success: false,
      msg: "An error occurred on the server.",
    });
  }
});


//get Parent or Student Profile by ID 
router.get("/user/profile-view/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    if (!user || !user.approved) {
      return res.status(404).json({ msg: "User not found or not approved" });
    }

    //thisUser
    if(user.thisUser !== "student" && user.thisUser !== "parent") {
      return res.status(400).json({ msg: "User is not a student or parent" });
    };

    if(user.thisUser === "student") {
      const studentProfile = await Student.findOne({ regNo: user.regNo });
      if (!studentProfile) {
        return res.status(404).json({ msg: "Student profile not found" });
      }

      res.status(200).json({ user, studentProfile, msg: "Student Profile Fetched" });
    } else if (user.thisUser === "parent") {
      const parentProfile = await Parent.findOne({ regNo: user.regNo });
      if (!parentProfile) {
        return res.status(404).json({ msg: "Parent profile not found or not yet enrolled.." });
      }
      res.status(200).json({ user, parentProfile, msg: "Parent Profile Fetched" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "An error occurred on the server." });
  }
})

export default router;