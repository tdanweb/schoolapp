import mongoose from "mongoose";

const breakdown = new mongoose.Schema({
    title: String,
    amount: Number
}, {_id: false});

//will be updated via postMany... if uniqueId exist, don't create new one
const StudentFeeSchema = new mongoose.Schema({
    admissionNo: String,
    term: {type: String, required: true},
    session: { type: String, required: true},
    streamId: {type: String, unique: true, required: true},  //studentId-term-session-
    classId: {type: String, required: true},
    fullname: {type: String, required: true},
    feeBreakdown: [breakdown], //title, amount
    totalFee: Number,
    totalPaid: Number,
    balanced: {type: Boolean, default: false},
    payHistory: [], //date, amount, method, recorder, toBalance, notes
});

const Fee = new mongoose.model("Fee", StudentFeeSchema)
export default Fee;