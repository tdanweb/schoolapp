import express from "express";
const router = express.Router();

import Result from "../models/Results.js"
import { staffAuth } from "../middlewares/auth.js";
import { AdditionalRecords } from "../models/Results&Scores.js";
import { Teacher } from "../models/Staff.js";
import { GeneralSettings } from "../models/AppSettings.js";

// POST /result/bulk-upload
router.post("/bulk-upload", staffAuth, async (req, res) => {
  try {
    const results = req.body.results;

  //  return res.status(201).json({msg: "Backend Connected", user: req.userId})

    // Basic validation
    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({
        msg: "Results array is required",
      });
    }

    // Verify uploader
    if (
      !req.userId ||
      !["staff", "admin", "chief-admin"].includes(req.userId.thisUser)
    ) {
      return res.status(403).json({
        msg: "You are not authorized to upload results",
      });
    }

    // TODO:
    // If the uploader is a staff member, recheck that the staff
    // is actually authorized to upload results for these subjects/classes.

    const operations = results.map((result) => {
      const ca1 = Number(result.ca1) || 0;
      const ca2 = Number(result.ca2) || 0;
      const exam = Number(result.exam) || 0;

      const caTotal = ca1 + ca2;
      const total = caTotal + exam;
      //const total = Math.ceil((88+total1)/2); send from frontend

      // Build the unique result ID on the server
      const resultId = [
        result.admissionNo,
        result.session,
        result.term,
        result.classId,
        result.subject,
      ].join("-");

      return {
        updateOne: {
          filter: {
            _id: resultId,
          },

          update: {
            $set: {
              admissionNo: result.admissionNo,
              subject: result.subject,
              classId: result.classId,
              mainClass: result.mainClass || "",
              arm: result.arm || "",
              session: result.session,
              term: result.term,
              department: result.department || "",
              grade: result.grade,
              position: result.position || "",
              remark: result.remark,
              ca1,
              ca2,
              exam,
              total,
              recorderId: "https://staff-sign here.."  //req.userId._id,
            },
          },

          upsert: true,
        },
      };
    });

    const bulkResult = await Result.bulkWrite(operations);

    return res.status(200).json({
      msg: "Results uploaded successfully",
      inserted: bulkResult.upsertedCount,
      updated: bulkResult.modifiedCount,
      matched: bulkResult.matchedCount,
      total: results.length,
    });

  } catch (error) {
    console.error("Bulk result upload error:", error);

    return res.status(500).json({
      msg: "Failed to upload results",
      error: error.message,
    });
  }
});



// Bulk upload / update additional student records
router.post("/upload-records", staffAuth, async (req, res) => {
  try {
    const { records } = req.body;
    const { regNo, classId } = req.query;

    // ------------------------------------
    // VALIDATE RECORDS
    // ------------------------------------
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        msg: "records must be a non-empty array",
      });
    }

    // ------------------------------------
    // GET STAFF
    // ------------------------------------
    const teacher = await Teacher.findOne({
      regNo,
      activeStaff: true,
    }).select("assignedClass signature");

    if (!teacher) {
      return res.status(404).json({
        msg: "Active staff member not found",
      });
    }

    // ------------------------------------
    // CHECK STAFF CLASS
    // ------------------------------------
    // Adjust this depending on how assignedClass
    // is stored in your schema.

    const assignedClass = teacher.assignedClass.classId;

    if (
      assignedClass &&
      String(assignedClass) !== String(classId)
    ) {
      return res.status(403).json({
        msg: "You are not authorized to upload records for this class",
      });
    }

    // ------------------------------------
    // GET GENERAL SETTINGS
    // ------------------------------------
    const setting = await GeneralSettings.findOne({
      _id: "general-setup",
    }).select("setUps");

    if (!setting) {
      return res.status(500).json({
        msg: "General settings not found",
      });
    }

    // ------------------------------------
    // CURRENT SESSION / TERM
    // ------------------------------------
    const thisSession = setting?.setUps?.currentSession || "";
    const thisTerm = setting?.setUps?.currentTerm || "";

    if (!thisSession || !thisTerm) {
      return res.status(400).json({
        msg: "Current session or term is not properly configured",
      });
    }

    const sign = teacher.signature || "";

    // ------------------------------------
    // CREATE BULK OPERATIONS
    // ------------------------------------
    const operations = records.map((item) => {
      const {
        admissionNo,
        userID,
        teacherComment,
        principalComment,
        generalComment,
        psychoScores,
        affectiveScores,
        promotion,
      } = item;

      if (!admissionNo) {
        throw new Error("Every record must have an admissionNo");
      }

      // Unique record ID
      const recordId = `${admissionNo}-${thisSession}-${thisTerm}`;

      return {
        updateOne: {
          filter: {
            admissionNo,
            session: thisSession,
            term: thisTerm,
          },

          update: {
            $set: {
              userID,

              teacherComment: {
                text: teacherComment?.text || "",
                signature: sign,
              },

              principalComment: principalComment || "",
              generalComment: generalComment || "",

              psychoScores: psychoScores || [],
              affectiveScores: affectiveScores || [],

              promotion: promotion || {},
            },

            $setOnInsert: {
              _id: recordId,
              admissionNo,
              session: thisSession,
              term: thisTerm,
            },
          },

          upsert: true,
        },
      };
    });

    // ------------------------------------
    // BULK WRITE
    // ------------------------------------
    const result = await AdditionalRecords.bulkWrite(operations);

    return res.status(200).json({
      msg: "Additional records uploaded successfully",
      totalSubmitted: records.length,
      inserted: result.upsertedCount,
      updated: result.modifiedCount,
    });

  } catch (error) {
    console.error("Bulk additional records error:", error);

    return res.status(500).json({
      msg: "Failed to upload additional records",
      error: error.message,
    });
  }
});
//fetching whole results


//getting previous records
export default router;