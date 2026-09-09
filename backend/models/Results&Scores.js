import mongoose from "mongoose";

//main test scores, Psychomotor, Affective, Term/Session Comments.. {pricipal, classTeacher: edit/update & signature/regNo, Fullname} and attendances as well
const attendanceSchema = new mongoose.Schema({
    week: {type: Number},
    classId: String,
    day: String,
    regNo: String,
    dated: Date,
    mor: Boolean,
    aft: Boolean,
    term: String,
    session: String,
    _id: String
}, {
    timestamps: true
});

export const PinSchema = new mongoose.Schema({
    refId: {type: String, required: true},
    pin: {
        type: String, trim: true, unique: true
    },
    view: String,
    user: {type: String,  default: ""},
    term: {type: String,  default: ""},
    session: {type: String,  default: ""},
    rounds: {type: Number, default: 3},
    useCount: {type: Number, default: 0},
    price: Number
}, {
    timestamps: true
});


//additionals to students results
const additionalSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      unique: true,
      required: true,
    },

    admissionNo: {
      type: String,
      required: true,
    },

    userID: {
      type: String,
    },

    term: {
      type: String,
      required: true,
    },

    session: {
      type: String,
      required: true,
    },
    classId: {
        type: String,
        required: true
    },
    teacherComment: {
      text: String,
      signature: String,
    },

    principalComment: {
      text: String,
      signature: String,
    },

    generalComment: String,

    psychoScores: {
      punctuality: String,
      neatness: String,
      handwriting: String,
      sports: String,
      creativity: String,
      leadership: String,
    },

    affectiveScores: {
      attentiveness: String,
      cooperation: String,
      honesty: String,
      responsibility: String,
      politeness: String,
      self_control: String,
    },

    promotion: {
      type: String,
      default: "NIL",
    },
  },
  {
    timestamps: true,
  }
);


const AdditionalRecords = new mongoose.model("AdditionalRecord", additionalSchema);
const Attendance = new mongoose.model("Attendance", attendanceSchema)
export  {Attendance, AdditionalRecords} ;
export default Attendance;
export const ResultPin = new mongoose.model("Resultpin", PinSchema)