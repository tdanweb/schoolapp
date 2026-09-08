import express from "express";

const router = express.Router();

import {
  addStudent,
  getAllStudents,
  getStudent
} from "../controllers/StudentControl.js";

import upload2, {cloudinary} from "../cloudinaryMedia.js";

import User from "../models/User.js";
import Student from "../models/Student.js";
import { getStudentForWork } from "../controllers/UserControls.js";
import { recordAttendanceInBulk } from "../controllers/Result&AttendanceControllers.js";
import Applicant from "../models/Applicant.js";


router.post("/student/add", addStudent);

router.get("/students", getAllStudents);

router.get("/student/profile", getStudent);

router.get("/students/work/:id", getStudentForWork);

router.post(
  "/student/passport",
  upload2.single("image"),
  async (req, res) => {
    try {

      // 1. Verify file presence
      if (!req.file) {
        return res.status(400).json({
          success: false,
          msg: "No File Uploaded. Kindly select a valid file"
        });
      }


      // 2. Parse IDs safely
      let admissionNo;
      let regNo;

      if (req.body.ids) {

        const parsedIds = typeof req.body.ids === "string" ? JSON.parse(req.body.ids) : req.body.ids;

        admissionNo = parsedIds.admissionNo;
        regNo = parsedIds.regNo;

      } else {
        admissionNo = req.body.admissionNo;
        regNo = req.body.regNo;
      }


      // 3. Ensure at least one search key exists
      if (!admissionNo && !regNo) {

        // Since the image has already been uploaded to Cloudinary,
        // delete it if we don't have a student to attach it to.

        await cloudinary.uploader.destroy(
          req.file.filename,
          {
            resource_type: "image"
          }
        );

        return res.status(400).json({
          success: false,
          msg: "Please provide either an admissionNo or regNo"
        });
      }


      // 4. Build query
      const searchQuery = [];

      if (admissionNo) {
        searchQuery.push({ admissionNo });
      }

      if (regNo) {
        searchQuery.push({ regNo });
      }


      // 5. Find the student FIRST
      const existingStudent = await Student.findOne({
        $or: searchQuery
      });

      if (!existingStudent) {

        // Student doesn't exist.
        // Delete the newly uploaded Cloudinary image
        // so you don't have orphaned files.

        await cloudinary.uploader.destroy(
          req.file.filename,
          {
            resource_type: "image"
          }
        );

        return res.status(404).json({
          success: false,
          msg: "Student profile not found"
        });
      }


      // 6. Delete the student's OLD passport from Cloudinary
      if (existingStudent.passportId) {

        try {

          await cloudinary.uploader.destroy(
            existingStudent.passportId,
            {
              resource_type: "image"
            }
          );

        } catch (deleteError) {

          // Don't stop the whole request if the old
          // Cloudinary file no longer exists.

          console.error(
            "Old Cloudinary image deletion failed:",
            deleteError.message
          );
        }
      }


      // 7. Update Student document
      const updatedStudent = await Student.findOneAndUpdate(
        { $or: searchQuery },
        {
          passportUrl: req.file.path,
          passportId: req.file.filename
        },
        {
          new: true
        }
      );


      // 8. Update User document
      await User.findOneAndUpdate(
        { $or: searchQuery },
        {
          passport: req.file.path
        },
        {
          new: true
        }
      );


      // 9. Send success response
      return res.status(200).json({
        success: true,
        msg: "Image uploaded and profile updated successfully",

        url: req.file.path,
        public_id: req.file.filename,
        student: updatedStudent
      });

    } catch (error) {

      console.error("Passport upload error:", error);


      // IMPORTANT:
      // If something fails AFTER Cloudinary upload,
      // remove the newly uploaded image so it doesn't
      // remain unused in your Cloudinary account.

      if (req.file?.filename) {

        try {

          await cloudinary.uploader.destroy(
            req.file.filename,
            {
              resource_type: "image"
            }
          );

        } catch (deleteError) {

          console.error(
            "Failed to delete uploaded Cloudinary image:",
            deleteError.message
          );
        }
      }


      return res.status(500).json({
        success: false,
        msg: "Something went wrong while uploading passport",
        error: error.message
      });
    }
  }
);

// [ ====================Burrowed for Media Uploads ============]
router.post(
    "/applicant/upload-passport",
    upload2.single("passport"),
    async (req, res) => {

        let uploadedPublicId = null;
        try {
            const { regNo } = req.body;
            if (!regNo) {
                return res.status(400).json({
                    success: false,
                    msg: "Registration number is required"
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    msg: "Passport image is required"
                });
            }

            // Save Cloudinary public ID in case we need to delete it
            uploadedPublicId = req.file.filename;

            const applicant = await Applicant.findOne({ regNo });
            if (!applicant) {
                // Since Cloudinary already uploaded it, remove it
                await cloudinary.uploader.destroy(uploadedPublicId)
                return res.status(404).json({
                    success: false,
                    msg: "Applicant not found"
                });
            }

            // Set passport URL
            applicant.passportUrl = req.file.path;
            applicant.passportId = uploadedPublicId

            // If this fails, catch block deletes Cloudinary image
            await applicant.save();

            return res.status(200).json({
                success: true,
                msg: "Passport uploaded successfully",
                passportUrl: applicant.passportUrl
            });

        } catch (error) {

            console.error("Passport upload error:", error);

            // Remove Cloudinary upload if it succeeded
            // but something failed before/while saving MongoDB
            if (uploadedPublicId) {
                try {
                    await cloudinary.uploader.destroy(uploadedPublicId);
                    console.log("Uploaded passport deleted from Cloudinary");
                } catch (deleteError) {
                    console.error(
                        "Failed to delete Cloudinary upload:",
                        deleteError
                    );
                }
            }

            return res.status(500).json({
                success: false,
                msg: "Failed to upload passport"
            });
        }
    }
);


//results/scores route
router.post("/students/attd", recordAttendanceInBulk)


export default router;