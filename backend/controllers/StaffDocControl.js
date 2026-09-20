import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { StaffDocument } from "../models/Student.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();


// =========================================================
// MULTER
// =========================================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 500 * 1024,
  },

  fileFilter: (req, file, cb) => {

    const allowed = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(
        new Error(
          "Only PDF, JPG, PNG and WEBP files are allowed."
        )
      );
    }

    cb(null, true);
  },
});


// =========================================================
// UPLOAD STAFF DOCUMENT
// =========================================================

router.post(
  "/staff/documents/upload",
  authMiddleware,
  upload.single("file"),

  async (req, res) => {

    try {

      // Make sure this is a staff user
      let uploader = req.user?.thisUser

      if (uploader !== "staff" && uploader !== "admin2" && uploader !== "admin" && uploader !== "chief-admin") {
        return res.status(403).json({
          message: "Staff access required.",
        });
      }


      if (!req.file) {
        return res.status(400).json({
          message: "No file was uploaded.",
        });
      }


      const {
        title,
        type,
      } = req.body;


      if (!title?.trim()) {
        return res.status(400).json({
          message: "Document title is required.",
        });
      }


      if (!type?.trim()) {
        return res.status(400).json({
          message: "Document type is required.",
        });
      }


      // =====================================================
      // CLOUDINARY
      // =====================================================

      const isPdf =
        req.file.mimetype === "application/pdf";


      const resourceType = isPdf
        ? "raw"
        : "image";


      const uploadResult =
        await new Promise((resolve, reject) => {

          const stream =
            cloudinary.uploader.upload_stream(
              {
                folder: "staff_documents",

                resource_type: resourceType,

                // Let Cloudinary generate the public ID.
                use_filename: true,
                unique_filename: true,
              },

              (error, result) => {

                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }

              }
            );


          stream.end(req.file.buffer);

        });


      // =====================================================
      // SAVE DATABASE RECORD
      // =====================================================

      const document =
        await StaffDocument.create({
          staffId: req.user.id,

          title: title.trim(),

          type: type.trim(),

          url: uploadResult.secure_url,

          pubId: uploadResult.public_id,

          fileType: req.file.mimetype,
        });


      res.status(201).json({
        message: "Document uploaded successfully.",
        document,
      });


    } catch (error) {

      console.error(
        "STAFF DOCUMENT UPLOAD:",
        error
      );


      if (
        error instanceof multer.MulterError &&
        error.code === "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          message: "File must not be more than 500 KB.",
        });
      }


      return res.status(500).json({
        message:
          error.message ||
          "Failed to upload document.",
      });

    }

  }
);

router.get(
  "/staff/documents",
  authMiddleware,
  async (req, res) => {
    try {

if (!["admin", "staff", "admin2", "chief-admin"].includes(req.user?.thisUser)) {
    return res.status(403).json({
        message: "Access denied"
    });
}

      const documents =
        await StaffDocument.find({
          staffId: req.user.id,
        }).sort({
          createdAt: -1,
        });

      res.json({
        documents,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Failed to fetch documents.",
      });

    }
  }
);
export default router;