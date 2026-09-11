import mongoose from "mongoose";

const breakdown = new mongoose.Schema({
    title: String,
    amount: Number
}, {_id: false});

//will be updated via postMany... if uniqueId exist, don't create new one
const StudentFeeSchema = new mongoose.Schema(
  {
    admissionNo: {
      type: String,
      required: true,
    },

    regNo: {
      type: String,
      required: true,
    },

    term: {
      type: String,
      required: true,
    },

    session: {
      type: String,
      required: true,
    },

    paymentId: {
      type: String,
      unique: true,
      required: true,
    },

    classId: {
      type: String,
      required: true,
    },

    fullname: {
      type: String,
      required: true,
    },

    totalFee: {
      type: Number,
      default: 0,
    },

    totalPaid: {
      type: Number,
      default: 0,
    },

    balanced: {
      type: Boolean,
      default: false,
    },

    payer: {
      type: String,
    },

    datedPaid: {
      type: Date,
      default: Date.now,
    },

    comment: {
      type: String,
    },

    method: {
      type: String,
      required: true,
      enum: ["cash-at-hand", "bank-transfer", "online"],
    },

    adminStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  {
    timestamps: true,
  }
);

const StudentFee = mongoose.model("StudentFee", StudentFeeSchema);



const Fee = new mongoose.model("Fee", StudentFeeSchema)
export default StudentFee;