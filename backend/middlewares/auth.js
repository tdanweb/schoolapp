import jwt from "jsonwebtoken";
import express from "express";
import User from "../models/User.js";
import { Teacher } from "../models/Staff.js";


const authMiddleware = (req, res, next) => {

    try {
    const authHeader = req.headers.authorization;
    
    
     req.msg = "Connected Here"
    //return res.status(200).json({msg: "API is working", user: {name: "Daniel Betiku", role: "Chief Admin"}});
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(400).json({msg: "No Token Provided, Authorization Denied!"})
    }

    const token = authHeader?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  

    next();
      
    } catch (error) {
       res.status(400).json({
        msg: "Invalid  or Expired Token Supplied"
       }) 
    }
};


export const auth2 = async (req, res, next) => {
    const token = req.cookies.token;
  //  return res.status(200).json({ msg: "Auth Connected " + token});

    if(!token){
        return res.status(401).json({
            msg: "No Authentication Provided!"
        })
    }

    try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.userId = decoded;
       next();
    } catch (error) {
        res.status(401).json({
            msg: "Invalid or expired Session"
        })
    }
}


export const userAuth = async (req, res) => {
    try {
        const {token} = req.query;
    if(!token){
        return res.status(401).json({
            msg: "No Authentication Provided!"
        })
    };

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const check = await User.findOne({_id: userId, approved: true});

        if(!check){
        return res.status(401).json({
            msg: "Invalid User Account!"
        })
    };

    res.status(200).json({
        token,
        user: {
            regNo: check.regNo, fullname: check.fullname, role: check.thisUser
        },
        msg: "User Validated!"
    })
    
    } catch (error) {
          res.status(401).json({
            msg: "Invalid or expired Session"
        })      
    }
}

export const staffAuth = async (req, res, next) => {
    const {token, useLts} = req.query;
   // return res.status(200).json({ msg: "Auth Connected " + token});

    if(!token){
        return res.status(401).json({
            msg: "No Authentication Provided!"
        })
    };

    try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       
       req.userId = decoded;
       req.useLastTerm = useLts || false;

       const user = decoded.thisUser;
       const isStaff = user === "staff" || user === "admin2" || user === "admin" || user === "chief-admin";
       const userCheck = await User.findOne({_id: decoded.id, approved: true});

       if(!isStaff && !userCheck){
        return res.status(403).json({
             msg: "Access Denied, You can contact School Admin for more details..."
        })
       }

       req.regNo = userCheck.regNo;
       next();
    } catch (error) {
        res.status(401).json({
            msg: "Invalid or expired Session"
        })
    }
}


export const adminPermissionAuths = async (req, res) => {
   const {token, regNo} = req.query;
   // return res.status(200).json({ msg: "Auth Connected " + token});

    if(!token){
        return res.status(401).json({
            msg: "No Authentication Provided!"
        })
    };

    try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       
       req.userId = decoded;

       const user = decoded.thisUser;
       const isStaff = user === "staff" || user === "admin2" || user === "admin" || user === "chief-admin";
       const userCheck = await User.findOne({_id: decoded.id, approved: true});

       if(!isStaff && !userCheck){
        return res.status(403).json({
             msg: "Access Denied, You can contact School Admin for more details..."
        })
       }

       const staff = await Teacher.findOne({regNo, activeStaff: true}).select("staffType staffCategory specialRoles") || null

       if(!staff){
        return res.status(403).json({
             msg: "Access Denied, You can contact School Admin for more details..."
        })     
       }

       res.status(201).json({
        staff, permission: staff?.specialRoles,
        role: userCheck?.thisUser
       });

    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: "Invalid or expired Session"
        })
    }
}
export default authMiddleware;

// admin only roles