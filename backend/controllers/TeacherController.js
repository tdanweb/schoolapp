import { ClassDetail } from "../models/AppSettings.js";
import { Teacher } from "../models/Staff.js";
import User from "../models/User.js";
import { generateId } from "./UserControls.js";
//getting user to use preevious unfo to register their profiles


export const loadStaffUser = async (req, res) => {
   //validate token
   const { user, regNo } = req.query;

   try {
    // check for staff profile
       const staff = await Teacher.findOne({regNo: regNo});
       if(staff){
        return res.status(400).json({
            success: false,
            msg: "This Staff Member is already Enrolled! You cannot edit this Profile. Feature is not yet supported."
        })
       }

       const getuser = await User.findOne({regNo: regNo});
       if(!getuser.approved){
        return res.status(400).json({
            success: false,
            msg: "Account is not yet approved! Contact Admin.."
        }) 
};

       if(getuser.thisUser === "applicant" || getuser.thisUser === "student" || getuser === "parent"){
        return res.status(400).json({
            success: false,
            msg: "Unable to get this User. The User is not a Staff!" + getuser.thisUser
        })
       } 

       res.status(200).json({
        regNo,
        user2: getuser.thisUser,
        lastname: getuser.lastname,
        fullname: getuser.fullname,
        passportUrl: getuser.passport,
        email: getuser.email,
        phone: getuser.phone
       });

   } catch (err) {
     res.status(400).json({
            success: false,
            error: err,
            msg: "Unable to get this User"
        })
   }
}


export const getStaffForClass = async (req, res) => {
    try {
        const {id} = req.params;

        const staff = await Teacher.findOne({regNo: id})
        .select("regNo specialRoles assignedClass assignedSubjects staffType fullname signature");

        let allClasses;
        if(staff.staffType === "admin" || staff.staffType === "chief-admin"){
            //send all class available for selection: attendance rec, and fee info view
            allClasses = await ClassDetail.find();
        } else{
            allClasses = null
        }

        if(!staff) return res.status(401).json({ success: false, msg: "Staff not found"});
        res.status(201).json({
            staff,
            msg: "Successfully fetched the Staff: " + id + " - " + staff.fullname,
            classes: allClasses
        });

    } catch (error) {
      res.status(400).json({
        msg: "Server/Network Error"
      })  
    }
}
export const registerStaff = async (req, res) => {
    try {
        const { regNo, fullname, displayName, othernames, lastname,  email, nin, phone, passportUrl, signature} = req.body;
        //generate staffId
        const theStaff = await User.findOne({regNo, approved: true});
        if(!theStaff) {
            return res.status(400).json({ msg: "You need to first create an account before enrolling as a Staff Member", success: false});
        }

        const check = await Teacher.findOne({regNo});

        if(check) {
            //editttingggg
           return res.status(400).json({
                msg: "User already Registered!",
                success: false
            });
        }

        const staffId = `STA${await generateId("staff-no")}`
        const staffType = theStaff.thisUser === "staff" ? "regular" : theStaff.thisUser;
        
        const newStaff = await Teacher.create({
            ...req.body,
            staffId,
            regNo,
            staffType,
            fullname,
            othernames,
            displayName,
            lastname,
            email,
            nin,
            phone,
            passportUrl,
            signature
        });
        
        if(!newStaff){ return res.status(401).json({
             msg: "Unable to add User, Kindly Check the User Reg No, and NIN if it's not being used by another Staff Member",
             success: false})}

        res.status(200).json({
            success: true,
            newStaff,
            msg: "Staff Registration Successful. Details have been Uploaded!"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Failed! Unable to Register this User..."})
    }
}

export const updateStaff = async (req, res) => {
    
};

export const getStaff = async (req, res) => {

   let isAdmin = false;
    try {
      const {page, limit} = req.query;
      const skip = (page - 1) * limit;
    const staff = await Teacher.find({activeStaff: true}).sort({ createdAt: -1 })
    .select("staffId regNo staffType fullname email phone specialRoles assignedSubjects staffCategory assignedClass");
    res.status(201).json({
        msg: "Teachers Data Fetched!",
        staff
    })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            msg: "Network Error"
        })
    }
}


//admin roles... 
//assigning duties: setting permission e.g makeClassTeacher, assign subject, make admin, set other permissions
//chief-admin/ authorized admins onle
export const setStaffRole = async (req, res) => {
    //protect with chief-admin tokens
    const {id} = req.params
    const { 
         regNo, 
         staffType, 
         staffCategory,
         // only in case of someone being made admin 
         specialRoles,
         assignedClass,
         //assignedSubjects, as subAssignment
         subAssignment
        } = req.body
        // specialRoles, isClassTeacher, assignedClass, subjectTeacher, assignedSubjects, staffCategory} = req.body; 

    try {
        const checkUser = await User.findOne({_id: id});
        if(!checkUser || checkUser.thisUser !== "chief-admin"){
            return res.status(400).json({
                msg: "You're not Authourized to perform this Operation",
                success: false
            });
        }
        //remove previous class and subjects allocation
        const staffGet = await Teacher.findOne({regNo}).select("assignedSubjects assignedClass _id regNo staffId email fullname");



// ==========================================
// 1. REMOVE STAFF FROM PREVIOUS SUBJECTS
// ==========================================

const oldSubjects = staffGet.assignedSubjects;

if (oldSubjects?.length > 0) {

  for (const item of oldSubjects) {

    const oldClassId = item.forClass?.classId;
    const subjectAbb = item.abb;

    if (!oldClassId || !subjectAbb) continue;

    await ClassDetail.findOneAndUpdate(
      {
        classId: oldClassId,
        "subjectOffered.abb": subjectAbb
      },
      {
        $pull: {
          "subjectOffered.$.teachers": {
            regNo: staffGet.regNo
          }
        }
      }
    );
  }
}


// ==========================================
// 2. REMOVE STAFF FROM PREVIOUS CLASS TEACHER
// ==========================================

const oldClassId = staffGet.assignedClass?.classId;

if (oldClassId) {

  await ClassDetail.findOneAndUpdate(
    {
      classId: oldClassId,
      "classTeacher.regNo": staffGet.regNo
    },
    {
      $set: {
        classTeacher: null  
      }
    }
  );
}


// ==========================================
// 3. SET STAFF AS CLASS TEACHER IN NEW CLASS
// ==========================================
const newClassId = assignedClass.classId
if (newClassId) {

  await ClassDetail.findOneAndUpdate(
    {
      classId: newClassId
    },
    {
      $set: {
        classTeacher: {
          regNo: staffGet.regNo,
          email: staffGet.email,
          staffId: staffGet.staffId,
          fullname: staffGet.fullname
        }
      }
    },
    {
      new: true
    }
  );
}


// ==========================================
// 4. SET STAFF IN NEW SUBJECT ASSIGNMENTS
// ==========================================

if (subAssignment?.length > 0) {

  for (const item of subAssignment) {

    const newClassId = item.forClass?.classId;
    const subjectAbb = item.abb;

    if (!newClassId || !subjectAbb) continue;

    await ClassDetail.findOneAndUpdate(
      {
        classId: newClassId,
        "subjectOffered.abb": subjectAbb
      },
      {
        $addToSet: {
          "subjectOffered.$.teachers": {
            regNo: staffGet.regNo,
            staffId: staffGet.staffId,
            fullname: staffGet.fullname,
            email: staffGet.email
          }
        }
      }
    );
  }
}


const staffEdit = await Teacher.findOneAndUpdate(
  { regNo },
  {
    $set: {
      staffType,
      specialRoles,
      assignedSubjects: subAssignment,
      assignedClass,
      staffCategory
    }
  },
  { new: true }
);

res.status(200).json({
  msg: "Staff Details have been updated.",
  staff: staffEdit
});
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: "An Error Occured!"
        })
    }
}


//assigning roles
export const getStaffToAssign = async (req, res) => {
    try {
        const all50Staff = await Teacher.find()
        .sort({ createdAt: -1 })
        .select("staffId regNo staffType fullname email specialRoles assignedSubjects assignedClass");

        const classes = await ClassDetail.find().sort({ createdAt: -1 })
        .select("classId mainClass department arm subjectOffered");

        if(all50Staff.length < 1){
            res.status(401).json({
                msg: " no teaher added yet!"
            })
        }
        res.status(201).json({
            staff: all50Staff,
            classes,
            success: true,
            msg: "Teachers fetched!"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Unable to fetch staff members..."
        })
    }
}