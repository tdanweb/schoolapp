import User, { Generator } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { Teacher } from "../models/Staff.js";
import Student from "../models/Student.js";
import { GeneralSettings } from "../models/AppSettings.js";
import Attendance, { AdditionalRecords } from "../models/Results&Scores.js";
//data number generator

const generateId = async (num) => {
    const id = await Generator.findOneAndUpdate({title: num},
        {$inc: {counts: 1}}, { upsert: true, new: true}
    )

    return(String(id.counts).padStart(4, "0"));
}

export {generateId};

// [===== Adding Users ==========]
//get user to approve...
export const getUsers = async (req, res) => {
    try {
        const total = await User.countDocuments();
        const page = Number(req.query.page) || 1
        const LIMIT = Number(req.query.LIMIT) || 40
        const skip = (page - 1) * LIMIT

        //const num = 2244  //`SCH${await generateId("reg-no")}`
        const users = await User.find() //({thisUser: "staff" || "parent", approved: false})  //({approved: false})
        .sort({ createdAt: -1})
        .skip(skip)
        .limit(LIMIT)
        .select("fullname lastname regNo email thisUser phone approved");
       // .skip(page - 1) * LIMIT   .limit(LIMIT)
        

        res.status(201).json({
            users, msg: "Fetched Users Successfully!", total, page
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Unable to get Users"})
    }
}

// [===== Posting =======]
 export async function addUser (req, res)  {
 try {   
    // Check if user already exists
    const { lastname, fullname, fullName, email, password, thisUser, phone, ...form } = req.body;
    const mypass = await bcrypt.hash(password, 10)
    

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User Email already exists' });
    }

    // Create new user
    let user;
    const regNo = `SCH${await generateId("reg-no")}` 
    if((regNo === "SCH0001" || regNo === "SCH0002") && (thisUser === "staff")){
        user = "chief-admin"
    }else{
        user = thisUser
    }

    const approved = user === "applicant" || user === "chief-admin";

    const newUser = new User({lastname, fullname: fullName || fullname, 
        email: user === "applicant" ? regNo : email,
        mail: email, 
        password: mypass, phone, 
        approved, regNo, thisUser: user, ...form});
    const savedUser = await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: savedUser, success: true});
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
    }
}

// [======Signing In User========]
export const logInUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email})  || await User.findOne({regNo: email});

        if(!user) {
            return res.status(400).json({msg: "Email or Reg No. is not Valid!"})
        }
        
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({msg: "Invalid credentials"  });
}

        const approved = user.approved;
        if(!approved){
            return res.status(400).json({msg: "Opps, seems the account is not yet approved. Contact the School Admin.."  });
        }

        if(user.thisUser === "applicant"){
            return res.status(400).json({msg: "This is an applicant account. Applicants can only be logged in to the admission Portal"})
        }

//        
        const TOKEN = jwt.sign({id: user._id, thisUser: user.thisUser, regNo: user.regNo}, process.env.JWT_SECRET, {expiresIn: "7d"});

        res.cookie("token", TOKEN, {
            httpOnly: true,
            secure: false, //process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });   

    res.status(201).json({
        success: true,
        msg: "Now Logged IN",
        user: user.regNo,
        name: user.fullname,
        role: user.thisUser,
        id: user._id,
        token: TOKEN //jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
    })
    } catch (error) {
        res.status(500).json({
            success: false,
            error,
            msg: "Unable to Log You in as error occured in the Server. Kindly contact Admin!"
        })
    }
}

export const logInApplicant = async(req, res) => {

    try {
        const {id, password} = req.body;
        const userInfo = await User.findOne({regNo: id, thisUser: "applicant"}) || await User.findOne({email: id, thisUser: "applicant"});

        if(!userInfo) {
            return res.status(400).json({msg: "Email or Reg No. is not Valid! Please check again"})
        }
        const isMatch = await bcrypt.compare(password, userInfo.password);
        if (!isMatch) {
            return res.status(400).json({msg: "Invalid credentials"  });
        }

        res.status(200).json({
        msg: "Welcome, Dear Applicant " + userInfo.fullname,
        success: true,
        user: {
           appId:  userInfo.regNo, name: userInfo.fullname,
           email: userInfo.email, phone: userInfo.phone,
           lastname: userInfo.lastname,
           timeLoggedIn: new Date().getTime()
        }
    });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Network Error!" })
    }
}


//test protected route
export const protectedRoute = async (req, res) => {
    try {
        res.status(200).json({msg: "Welcome Brother"});
    } catch (error) {
        res.status(500).json({
            msg: "Unable to access protected route",
            error
        })
    }
}

//[====== Authorized: Approving Users ==========]
export const approveUser = async (req, res) => {
    //only chief admin and admins allowed
    const {regNo, user} = req.body
    try {
        /*
        const checkUser =  await User.findOne({ regNo })
        if(checkUser.thisUser !== "chief-admin"){
            return res.status(400).json({
                msg: "Access Denied! Only Admin can do this Operation.."
            })
        }
*/
        const updateUser = await User.findOneAndUpdate(
            {regNo: user}, {approved: true}, {new: true}
        );

        res.status(200).json({
            msg: "You've successfully approved this User: " + 
            updateUser.fullname + " - " + user,
            success: true
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "A Problem Occured!"
        })
    }
}

//[====== Authorized: Approving Users ==========]
export const unapproveUser = async (req, res) => {
    //only chief admin and admins allowed
    const {regNo, user} = req.body
    try {
        /*
        const checkUser =  await User.findOne({ regNo })
        if(checkUser.thisUser !== "chief-admin"){
            return res.status(400).json({
                msg: "Access Denied! Only Admin can do this Operation.."
            })
        }
*/
        const updateUser = await User.findOneAndUpdate(
            {regNo: user}, {approved: false}, {new: true}
        );

        res.status(200).json({
            msg: "You've unapproved this User: " + 
            updateUser.fullname + " - " + user,
            success: true
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "A Problem Occured!"
        })
    }
}

//new auth route for protection
export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({
                msg: "Not authenticated"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if(!user){
            return res.status(401).json({
                msg: "User no longer exists"
            });
        };

        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({
            msg: "Invalid or expired Session"
        })
    }
}

//test route
export const testAuth = async (req, res) => {
    res.status(200).json({
        user: req.user,
        msg: "Server Successfully Connected!"
    });
}

export const profileLoader = async (req, res) => {
    const {id} = req.params;

    try {
        const user = await User.findById(id)

        if(user.approved === false){
            return res.status(400).json({msg: "Account is not yet approved..", success: false});
        }

        if(user.thisUser === "admin" || user.thisUser === "staff" || user.thisUser === "chief-admin"){
            const staff = await Teacher.findOne({regNo: user.regNo});
            
            if(!staff){
               return res.status(400).json({
                    msg: "Seems you're yet to enrol, Kindly Complete your Registration",
                    success: false,
                    staffRegRequired: true,
                    user
                });
            }

            res.status(201).json({
                msg: "Staff User Profile Found",
                success: true,
                staff
            });
        } else  if(user.thisUser === "student"){
            const stu = await Student.findOne({regNo: id});
            res.status(201).json({
                msg: "Student User Profile Found",
                success: true,
                stu
            });
        } else {
            res.status(401).json({
                msg: "User Profile not Supported for this User Type",
                success: false
            });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Server/Network Error..."
        })
    }
}


// [============Get STudents for e.g attendance/result uploads ================]
export const getStudentForWork = async (req, res) => {
    const {id} = req.params;

    try {
        const term = await GeneralSettings.findOne({ _id: "general-setup" });

        const students = await Student.find({
            realClassId: id,
            status: "active"
        })
        .select("regNo admissionNo passportUrl currentFee realClassId personalInfo academic realContact realClassNow");


        const studentWithFee = students.map((student) => {
            const feeInfo = student.currentFee.find((fee) => 
                fee.session === term.setUps.currentSession && fee.term === term.setUps.currentTerm
            )

            return {
                ...student.toObject(),
                feeInfo: feeInfo || null
            }
        });

        //you could get their attendance records...
        const attdRec = await Attendance.find({
            week: term.setUps.schoolWeek,
            session: term.setUps.currentSession,
            term: term.setUps.currentTerm,
            classId: id
        });

        //previous additional records too

        const additionalRecords = await AdditionalRecords.find({
            classId: id,
            session: term.setUps.currentSession,
            term: term.setUps.currentTerm,
        });
        
        res.status(201).json({
            msg: "Students Successfully fetched!",
            students: studentWithFee,
            attendanceRecords: attdRec || null,
            additionalRecords,
            success: true
        });

    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: "Students Not Found!",
            success: false
        });
    }
}