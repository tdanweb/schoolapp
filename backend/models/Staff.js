import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    title: {type: String,  required: true}, //ID CARD, APP LETTER, LESSON NOTE, CV -- accept manual typing
    imageUrl: {type: String, required: true, unique: true},
    docType: {type: String, enum: ["id", "cv", "education", "letter", "passport", "signature"], default: "id"}
}, {
    timestamps: true
});

const assignedSubSchema = new mongoose.Schema({
    forClass: {mainClass: String, arm: String, department: String, classId: String},
    subject: String, 
    abb: String,
    faceView: String,
    num: String
}, {
    _id: false, timestamps: true
})

const specialRoleSchema = new mongoose.Schema({
  chiefAdmin: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  canManageStudents: { type: Boolean, default: false },
  canManageFinance: { type: Boolean, default: false },
  canUploadAssignedResults: { type: Boolean, default: false },
  canApproveUser: { type: Boolean, default: false },
  canManageAdmission: { type: Boolean, default: false },
  isClassTeacher: { type: Boolean, default: false },
  isSubjectTeacher: { type: Boolean, default: false },
  canCreateUpdate: { type: Boolean, default: false }

}, {
    timestamps: false,
    _id: false
});

const eduSchema = new mongoose.Schema({
    qualification: String, //type of certificates
    details: String,
    dateStarted: String,
    dateEnded: String,
}, {_id: false});

const teacherSchema = new mongoose.Schema({
    //take regNo: frontend, and staffId -- backend set it
    staffId: {
        type: String, unique: true, required: true
    },
    regNo: { type: String, unique: true, required: true},
  //  status: {type: String, default: "active", enum: ["active", "inactive"]},

    //contacts
    email: String, 
    phone: String,

    //credentials
    fullname: {type: String, required: true, trim: true},
    lastname: {type: String, required: true, trim: true},
    othernames: {type: String, trim: true},
    displayName: { type: String, required: true, trim: true},
    gender: String,
    dob: String,
    passportUrl: String,
    passportId: String,
    signature: String,
    signatureId: String,
    dateEmployed: String,
    activeStaff: {
        type: Boolean,
        default: true
    },
    nin: {type: String, required: true, unique: true},
    staffType: {type: String, enum: ["regular", "admin2", "admin", "chief-admin"], default: "regular"},
    staffCategory: {type: String, enum: ["teaching", "non-teaching", "admin-staff"], default: "teaching"}, //non teachers can't be assigned class/subjects
   
    //certificate details
    education: [eduSchema],
    specialization: String,
    //subjects taught
    designation: String, //subjects taught e.g English
    //documents uploaded
    docsUploaded: [documentSchema],

    //admin determines this
    assignedClass: {arm: String, classId: String, department: String, mainClass: String},
    specialRoles: specialRoleSchema,
    assignedSubjects: [assignedSubSchema]
}, {
    timestamps: true
});

export const Teacher = new mongoose.model("Teacher", teacherSchema);