import mongoose from "mongoose";

const breakdownSchema = new mongoose.Schema({
 title: String, amount: Number
}, {
  _id: false,
});

const stuFee = new mongoose.Schema({
      total: {
        type: Number,
        default: 0,
      },
      breakdown: [breakdownSchema],
      session: String,
      term: String,
      paid: {
        type: Number,
        default: 0,
      },
}, {
  _id: false,
  timestamps: true
})

const studentSchema = new mongoose.Schema(
  {
    // =========================
    // IDENTIF//ICATION
    // =========================

    admissionNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    regNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    passportUrl: {
      type: String,
      default: ""
    },
    passportId: {
      type: String,
      default: ""     
    },
    // =========================
    // PERSONAL INFORMATION
    // =========================

    personalInfo: {
      surname: {
        type: String,
        required: true,
        trim: true,
      },
      passport: {
        type: String,
        trim: true
      },
      firstName: {
        type: String,
        required: true,
        trim: true,
      },

      otherName: {
        type: String,
        trim: true,
      },
      nin: String,
      gender: {
        type: String,
        enum: ["Male", "Female"],
        required: true,
      },

      dob: {
        type: Date,
        required: true,  //take note
      },
      religion: {
        type: String,
        trim: true,
      },

      nationality: {
        type: String,
        default: "Nigeria",
      },

      stateOfOrigin: {
        type: String,
        trim: true,
      },

      lga: {
        type: String,
        trim: true,
      },
      hobbies: String,
      passport: {
        type: String,
      },
    },

    // =========================
    // CONTACT INFORMATION
    // =========================

    contact: {
      phone: {
        type: String,
        trim: true,
      },

      email: {
        type: String,
        lowercase: true,
        trim: true,
      },

      address: {
        type: String,
        trim: true,
      },
    },

    // =========================
    // ACADEMIC INFORMATION
    // =========================

    academic: {
      classOnAdmission: {
        type: String
      },

      currentClass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AllClasses", // take note
        required: true,
      },
      
      arm: {
        type: String,
      },
      department: {
        type: String,
      },
      session: {
        type: String,
        required: true
      },

      term: {
        type: String,
        enum: ["First", "Second", "Third"],
        required: true,
      },
    },

    dateAdmitted: {
        type: Date,
        default: Date.now,
      },
    club_house: {
      type: String, default: "Academic/Blue"
    },

    parentAttached: String, //just regNo
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent"
    },

    previousSchools: 
        {
          schoolName: {
            type: String,
            trim: true,
          },
          from: {
            type: String,
          },
          till: {
            type: String,
          },
        },

    // =========================
    // PARENT / GUARDIAN
    // =========================
    guardians:
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        relationship: {
          type: String,
          trim: true,
        },

        phone: {
          type: String,
          trim: true,
        },

        email: {
          type: String,
          lowercase: true,
          trim: true,
        },

        occupation: {
          type: String,
          trim: true,
        },

        address: {
          type: String,
          trim: true,
        },
      },

    // =========================
    // MEDICAL INFORMATION
    // =========================

    medical: {
      bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      },

      genotype: {
        type: String,
        enum: ["AA", "AS", "SS", "AC", "SC"],
      },

      allergies: {
        type: String,
        trim: true,
      },

      disability: {
        type: String,
        trim: true,
      },

      otherIssues: {
        type: String,
        trim: true,
      },
    },
    // =========================
    // CURRENT FEES -- delicate
    // =========================
//determined by the class
    currentFee: [stuFee],
    // =========================
    // STUDENT CONTACT DETAILS
    // =========================

    realContact: {
      guardianMail: {
        type: String,
        lowercase: true,
        trim: true,
      },

      studentMail: {
        type: String,
        lowercase: true,
        trim: true,
      },

      guardianTel: {
        type: String,
        trim: true,
      },

      studentTel: {
        type: String,
        trim: true,
      },
    },

    // =========================
    // SYSTEM STATUS
    // =========================

    approved: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "left", "graduated", "transferred"],
      default: "active",
    },

    // =========================
    //Classes
    // =========================
    realClassNow: {
      classId: String, mainClass: String, arm: String, department: String
    },
    realClassId: {type: String, required: true},
    realClassArm: {type: String, default: ""},
    realDepartment: {type: String, default: ""},
    realClass: {type: String, required: true},
    parentId: String //id of student parent usually regNo....
  },

  {
    timestamps: true,
  }
);

const staffDocumentSchema = new mongoose.Schema(
  {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Login",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
    },

    pubId: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const  StaffDocument =  new mongoose.model(
  "StaffDocument",
  staffDocumentSchema
);
const Student = mongoose.model("Student", studentSchema);

export default Student;