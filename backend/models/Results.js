import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      unique: true,
    },
    admissionNo: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    mainClass: {
      type: String,
      default: ""
    },

    classId: {
      type: String,
      required: true,
    },

    arm: {
      type: String,
      required: true,
    },

    session: {
      type: String,
      required: true,
    },

    term: {
      type: String,
      required: true,
    },

    department: {
      type: String,
    },

    ca1: {
      type: Number,
      default: 0,
    },

    ca2: {
      type: Number,
      default: 0,
    },

    exam: {
      type: Number,
      default: 0,
    },
    lts: Number,
    total: {
      type: Number,
      default: 0,
    },
    remark: String,
    grade: String,
    position: String,
    
    recorderId: {
      type: String,
      required: true, //replace with signature url
    },
  },
  {
    timestamps: true
  });

const Result = mongoose.model("Result", resultSchema);
export default Result;


const weeklyAssessemmentSchema = new mongoose.Schema({
  admissionNo: {
    type: String, required: true
  },
  session: {
    type: String, required: true
  },
  studentId: {
 
  }
}, {

})