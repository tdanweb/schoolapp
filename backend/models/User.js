import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    regNo: {type: String, required: true, unique: true},
    fullname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: {type: String},
    mail:  {type: String, default: ""},
    approved: {type: Boolean, default: false},
    thisUser: { type: String, enum: [
      "applicant", "student", "staff", "admin", "admin2", "chief-admin", "parent"
    ]},
    password: { type: String, required: true }, 
    passportUrl: {type: String, default: ""}
  }, {
    timestamps: true,
  });

const User = mongoose.model('Login', userSchema);
export default User;

//generating random num
const generatorSchema = new mongoose.Schema({
  title: {type: String, required: true, unique: true},
  _id: false,
  counts: {
    type: Number,
    default: 1000
  }
},
{
  timestamps: false
});

export const Generator = new mongoose.model("ID", generatorSchema);

//test user: fullname, dob, username, passport
const testUser = new mongoose.Schema({
  fullname: {type: String, required: true},
  username: {type: String, unique: true, required: true, trim: true},
  passportUrl: String,
  dob: String
}, {
  timestamps: true
});

export const TestUser = new mongoose.model("testuser", testUser);


const WardInfo = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    admissionNo: {
      type: String,
      required: true,
      trim: true,
    },

    regNo: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
    timestamps: false,
  }
);

const ParentSchema = new mongoose.Schema(
  {
    regNo: {
      type: String,
      required: true,
      trim: true,
    },

    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    wards: [WardInfo],

    occupation: String,

    address: String,

    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
    },

    contactMail: String,

    contactPhone: String,
  },
  {
    timestamps: true,
  }
);

const Parent = new mongoose.model("Parent", ParentSchema);
export {Parent}