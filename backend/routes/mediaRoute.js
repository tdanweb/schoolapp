import express from "express";
import { uploadMedia } from "../controllers/mediaController.js";
import { TestUser } from "../models/User.js";
//import upload from "../middlewares/uploads.js";
import upload2, { cloudinary } from "../cloudinaryMedia.js";

const router = express.Router();


router.post("/add", upload2.single("image"), (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({
                success: false,
                msg: 'No File Uploaded. Kindly Select a valid file'
            });
        }
        /*
        const user = await TestUser.create({
            username: 
        });
*/

    
        res.status(200).json({
            msg: "Image Uploaded",
            url: req.file.path,
            public_id: req.file.filename
        });
        
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})



export default router;