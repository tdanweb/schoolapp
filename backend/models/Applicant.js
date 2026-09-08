import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema(
  {
    // =========================
    // IDENTIFICATION & BIODATA
    // =========================
    admissionNo: {
      type: String,
      trim: true,
      default: "",
    },
    regNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    surname: {
      type: String,
      required: true,
      trim: true,
    },
    otherName: {
      type: String,
      required: true,
      trim: true,
    },

    dob: {
        type: Date,
        required: true,  //take note
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
    passportUrl: {
      type: String,
      default: ""
    },
    passportId: {
      type: String,
      default: ""     
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    streamId: {
      type: String, // e.g., "2026-2027"
      required: true,
    },
    status: {
      type: String,
      enum: ["admitted", "processing", "under review", "not admitted"],
      default: "under review",
    },
    payment: {
      type: Boolean, default: false
    },

    // =========================
    // EXAMINATION DETAILS
    // =========================
    examinationDetails: {
      status: {
        type: String,
        default: "pending",
        enum: ["pending", "awaiting result", "absent", "result out"],
      },
      score: { type: Number, default: 0 },
      rating: { type: Number, default: 0},
      seatNo: { type: String, default: "" },
      examDate: { type: String, default: "" },
      examVenue: { type: String, default: "" },
    },
    feePaid: {
      type: Boolean,
      default: false,
    },
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
        type: String //class applied to
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
        default: "First"
      },
    },

    dateAdmitted: {
        type: Date,
        default: Date.now,
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
  applicationDate: Date,
  sponsor: {
  name: {
    type: String,
    trim: true,
  },
  workplace: {
    type: String,
    trim: true,
  },
  salary: {
    type: String,
    trim: true,
  },
  relationship: {
    type: String,
    trim: true,
  },
  address: {
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
  thisUser: {
    type: String,
    default: "applicant",
  },
}
  },
  {
    timestamps: true,
  }
);

const Applicant =
  mongoose.models.Applicant || mongoose.model("Applicant", applicantSchema);

  //application pin
  const appPin = new mongoose.Schema({
    pin: {type: String, required: true, unique: true},
    _id: {type: String, unique: true, required: true},
    regNo: {type: String, unique: true, required: true},
    session: {type: String, required: true}
  }, {
    timestamps: true
  })

export const RegPin = new mongoose.model("Pin", appPin);
export default Applicant;
