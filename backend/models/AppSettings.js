import mongoose from "mongoose";

const updateSchema = new mongoose.Schema({
    //announcements instead
poster: {type: String, required: true},
regNo: {type: String},
content: { type: String, required: true},
title: String, //max 200 words... 1k chars,
imageUrl: String,
imageId: String,
thisUser: { type: String, required: true, enum: ["admin", "admin2", "chief-admin"]},

}, { timestamps: true});

export const HomeUpdate = new mongoose.model("homeupdate", updateSchema)


const GeneralSettingSchema = new mongoose.Schema({
    _id : {
        type: String, default: "general-setup", unique: true
    },
    setUps: {
    registrationIsOpened: {type: Boolean, default: false},
    schoolIsOn: {type: Boolean, default: false},
    schoolWeek: String,
    resultsUploading: {type: Boolean, default: false},
    resultsViewing: {type: Boolean, default: false},
    admissionPortal: {type: Boolean, default: false},
    attendanceMarking: {type: Boolean, default: false},
    feeManaging: {type: Boolean, default: false},
    currentTerm: {type: String}, //term string, term, session
    currentSession: String
    },

    //homeAnnouncements
    homepageUpdates: []
}, {
    timestamps: true
})

export const GeneralSettings = new mongoose.model("settings-1", GeneralSettingSchema);

const holidaySchema = new mongoose.Schema({
    name: String,
    date: Date
}, {_id: false});

const termSchema = new mongoose.Schema({
    _id: {
        type: String, unique: true, required: true
    },
    termName: String,
    session: String,
    termlyBreak: String,
    noOfWeeks: Number,
    notes: String,
    holidays: [holidaySchema],
    nextTerm: String,
    startDate: Date,
    resultsPublished: {type: Boolean, default: false},
    endDate: Date,
    calendar: []  //title, date, order: e.g 1 2 3...
}, {
    timestamps: true
})

export const TermSettings = new mongoose.model("settings-2", termSchema);
// [ ====== Subjects/Classes ===========]
const subjectSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    abb:  {type: String, required: true, trim: true},
    teachers: [] //just ids, fullname
}, {
    timestamps: true
});

const feeDetails = new mongoose.Schema({
    title: String, amount: Number
}, {
    _id: false 
})

const subSchema = new mongoose.Schema({
    name: {type: String, unique: false},
    abb:  {type: String, unique: false},
    teachers: Array
}, {
    _id: false, timestamps: false
});

const classSchema = new mongoose.Schema({
    classId: {type: String, required: true, trim: true, unique: true}, //e.g ss1-science-a, ss1-a, ss1-science
    mainClass: {type: String, required: true, uppercase: true},
    department: {type: String, uppercase: true},
    arm: {type: String, uppercase: true},
    classTeacher: {regNo: String, staffId: String, fullname: String, email: String},
    subjectOffered: [subSchema],
    classInfo: String,
    feeInfo: {total: Number, breakdown: [feeDetails]} //postMany student, session, term, payable, paid, history, completed
    //for fee use array.. [{ term, session, total, breakdown: [] }] // payment also counted in array
}, {
    timestamps: true
    //
});

export const ClassDetail = new mongoose.model("AllCLasses", classSchema);
export const Subject = new mongoose.model("Subject", subjectSchema);


//Applicants admission Setting

const admissionSchema = new mongoose.Schema({
    _id: {type: String, default: "admission", unique: true},

    settings: {
        admissionStatus: {
            type: String, default: "closed", enum: ["ongoing", "closed", "awaiting-result", "awaiting-exam", "admission-ongoing"]
        },
        examinationDate: String,
        applicationFee: {
            type: Number,
            default: 10000
        },
        notes: String,
        deadline: {type: Date},
        session: {type: String, required: true},
        term: {type: String, default: "First"},
        //others
        resultRealeased: {type: Boolean, default: false},
        examCompleted: { type: Boolean, default: false},
        admissionFinalized: { type: Boolean, default: false}
    }
}, {
    timestamps: true
});

export const AdmissionSetting = new mongoose.model("adm-setting", admissionSchema)