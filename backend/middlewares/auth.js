import jwt from "jsonwebtoken";
import express from "express";

const authMiddleware = (req, res, next) => {
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
       req.useLastTerm = useLts;
       next();
    } catch (error) {
        res.status(401).json({
            msg: "Invalid or expired Session"
        })
    }
}
export default authMiddleware;

// admin only roles