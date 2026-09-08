import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {  FiUser, FiHash, FiCalendar, FiBookOpen, FiSave, FiMail, } from "react-icons/fi";
import { FaDotCircle, FaUserShield } from "react-icons/fa";
import { mainApi } from "../api";
import { Crest } from "../assets/Assets";
import { classrooms, schoolMainClasses } from "../dataBase";
import { FaSchool, FaTelegram } from "react-icons/fa";
import UploadFile, { Upload } from "../media/Upload";
import { UploadImages } from "../media/media2";
import axios from "axios";

// Replace with your API later
const API_URL = `${mainApi}/student/add`;

const initialFormDetails = {
  admissionNo: "",
  regNo: "",
  
  personalInfo: {
    surname: "",
    firstName: "",
    otherName: "",
    gender: "",
    dob: "",
    nationality: "Nigeria",
    religion: "",
    stateOfOrigin: "",
    lga: "",
    nin: "",
    passport: "",
    hobbies: ""
  },
  contact:{
    phone: "",
    email: "",
    address: ""
  },
  academic: {
    currentClass: "",  //mongoose Id
    classOnAdmission: "", //work on this
    arm: "",
    department: "",
    session: "2026-27",
    term: "First",
  },
  dateAdmitted: "",
  previousSchool: {
    schoolName: "",
    from: "",
    till: ""
  },
  guardians: {
    name: "",
    relationship: "",
    phone: "",
    email: "",
    occupation: "",
    address: ""
  },
  //mrdical
  medical: {
    genotype: "",
    bloodGroup: "",
    allergies: "",
    disability: "",
    otherIssues: ""
  },

  //realCOntact for students
  realContact: {
    guardianMail: "",
    studentMail: "",
    guardianTel: "",
    studentTel: ""
  },

  classId: "SSS 2 SCI",
  
  /*realClassNow: {
    //set by a unique class selected
    //normal ===>  classId, mainClaass, arm, department
  }
    */
};

export default function StudentRegistrationForm() {
  const [formDetails, setFormDetails] = useState(initialFormDetails);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [lockLoad, setLockLoad] = useState(true);

  const [setups, setSetups] = useState(null);
  const settingAPI = `${mainApi}/setting`

  useEffect(() => {
    async function getSettings(){
      const settings = await axios.get(settingAPI);
      setSetups(settings.data.settings.setUps);
      console.log(settings.data.settings)
    }

    getSettings()
  }, []);


  const [savedClasses, setSavedClasses] = useState([]);

  useEffect(() => {

    async function getClasses(){
      const API = `${mainApi}/classrooms`
      try {
        const res = await axios.get(API);
        setSavedClasses(res.data.data)
      } catch (error) {
        if(error.response){
          alert(error.response.data.msg)
        }
      }
    }

    getClasses();
  }, [])
  /*
  |--------------------------------------------------------------------------
  | HANDLE INPUT
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | HANDLE NESTED INPUT
  |--------------------------------------------------------------------------
  */
  const handleNestedChange = (section, field, value) => {
    setFormDetails((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // ========= Get Previous Progress ===============
  useEffect(() => {
    const savedInfo = localStorage.getItem("student-info");
    if(savedInfo){
      const data = JSON.parse(savedInfo);
      setFormDetails(data)
     // setFormDetails(JSON.parse(formDetails))
    }
  }, [])
  /*
  |--------------------------------------------------------------------------
  | ADD STUDENT
  |--------------------------------------------------------------------------
  */
  const [regMsg, setRegMsg] = useState("")
  const addStudent = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      localStorage.setItem("student-info", JSON.stringify(formDetails))
   //   return console.log(formDetails);

      const res = await axios.post(API_URL, formDetails);
      alert(res.data.msg);
      setRegMsg(res.data.logins);

      if (!res.ok) {
        throw new Error(
          data.msg || "Unable to register student"
        );
      }
      setSuccess(res.data.msg || "Student registered successfully");

      console.log("REGISTERED STUDENT:", res.data.student);

      // Reset form after successful registration
          setFormDetails(initialFormDetails);
    } catch (error) {
      if(error.response){
        setError(error.response.data.msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setRegMsg("");
    };
    if (regMsg) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [regMsg, setRegMsg]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto p-6"
    >

      {/* Overlay For Successful Reg*/}
       {
        regMsg && 
<AnimatePresence>
      {regMsg && (
        <div
          onClick={() => setRegMsg("")}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 15, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl"
          >
            <div className="text-slate-800 dark:text-slate-100 text-base leading-relaxed">
              {regMsg}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setRegMsg("")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              >
                <span>OK</span>
                <FaDotCircle className="text-sm" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
       }

      {/* ================= HEADER ================= */}

      <div className="mb-8">
        <div className="p-1 flex flex-row justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-100 text-indigo-700">
            <FiUser size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Student Registration
            </h2>
            <p className="text-sm text-slate-500">
              Enrol New Student into the School System
            </p>
          </div>
        </div>

        <Crest/>
        </div>
      </div>

      {/*================= FORM =================*/}

      <form
        onSubmit={addStudent}
        className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-8"
      >
         {
          //<UploadImages/>
        }
        {/* ================= IDENTIFICATION ================= */}
        
        {lockLoad ? 
        <div className="p-5 text-center flex flex-col justify-center items-center bg-gray-100 text-slate-800 text-xl font-bold font-roboto rouded-md shadow-lg cursor-pointer" onClick={() => setLockLoad(!lockLoad)}>
          CLICK TO COMPLETE ADMITTED STUDENT REGISTRATION
         { setups &&  (setups.registrationIsOpened ? <p className="text-[12px] p-1 px-3 rounded-md bg-teal-100 text-teal-600 font-poppins w-fit">Student Registration is Available</p> : 
         <p className="text-[12px] p-1 px-3 rounded-md bg-pink-100 text-pink-600 font-poppins w-fit">Student Registration is Not Available at the Moment</p>)}
         </div>
         : 
        <FormSection
          icon={<FiHash size={26}/>}
          title="Student Identification"
          description="ENTER STUDENT'S ID - (Use this For Students already admitted On Portal. For New Enrollement, Ignore it.)"
        >
          <div className="grid md:grid-cols-3 mb-5 gap-5">
            <Input
              label="Admission Number"
              placeholder="e.g. AIA/1001"
              disabled={lockLoad}
              value={formDetails.admissionNo}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "admissionNo",
                    value: e.target.value,
                  },
                })
              } />

            <Input
              label="Registration Number"
              placeholder="e.g. SCH0001"
              value={formDetails.regNo}
              disabled={lockLoad}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "regNo",
                    value: e.target.value,
                  },
                })
              }
            />

            <Input
              label="Get Student"
              disabled={lockLoad}
              type="button"
              value={"Get Details"}/>
          </div>
        </FormSection>

        }
        <hr/>

        {/* ================= PERSONAL ================= */}
        <FormSection
          icon={<FiUser />}
          title="Personal Information"
          description="Student's basic personal information"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Input
              type="date"
              label="Date of Admission"
              value={formDetails.dateAdmitted}
              onChange={(e) =>
                handleChange({
                  target: {   name: "dateAdmitted", value: e.target.value     }
                })  } required  />

            <Input
              label="Surname"
              placeholder="Enter surname"
              value={formDetails.personalInfo.surname}
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  "surname",
                  e.target.value
                )
              }
              required
            />

            <Input
              label="First Name"
              placeholder="Enter first name"
              value={formDetails.personalInfo.firstName}
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  "firstName",
                  e.target.value
                )
              } required />

            <Input
              label="Other Name"
              placeholder="Optional"
              value={formDetails.personalInfo.otherName}
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  "otherName",
                  e.target.value
                )}/>

            <Select
              label="Religion"
              value={formDetails.personalInfo.religion}
              options={["Christianity", "Islamic", "Others"]}
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  "religion",
                  e.target.value
                )}/>

            <Input
              label="Nationality"
              placeholder="E.g Nigerian"
              value={formDetails.personalInfo.nationality}
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  "nationality",
                  e.target.value
                )}/>

            <Input
              label="State of Origin"
              placeholder="State"
              value={formDetails.personalInfo.stateOfOrigin}
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  "stateOfOrigin",
                  e.target.value )}/>

            <Input
              label="LGA"
              placeholder="LGA"
              value={formDetails.personalInfo.lga}
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  "lga",
                  e.target.value
                )
              }
            />

            <Input
              label="NIN or ID NO:"
              placeholder="NIN (Optional)"
              value={formDetails.personalInfo.nin}
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  "nin",
                  e.target.value
                )
              }
            />

            <Input
              label="Hobbies"
              placeholder="ENter Hobbies"
              value={formDetails.personalInfo.hobbies}
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  "hobbies",
                  e.target.value
                )
              }
            />

            <Select
              label="Gender"
              value={formDetails.personalInfo.gender}
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  "gender",
                  e.target.value
                )
              }
              options={["Male", "Female"]}
              required
            />

            <Input
              type="date"
              label="Date of Birth"
              value={formDetails.personalInfo.dob}
              onChange={(e) =>
                handleNestedChange(
                  "personalInfo",
                  "dob",
                  e.target.value
                )
              }
              required
            />
          </div>
        </FormSection>

        {/* ================= ACADEMIC ================= */}
        <FormSection
          icon={<FaSchool size={24}/>}
          title="PREVIOUS SCHOOL ATTENDED"
          description={"Fill in Student PREvious School, Ignore if none"}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
            <Input
              label="Previous School:"
              placeholder="School Name"
              value={formDetails.previousSchool.schoolName}
              onChange={(e) =>
                handleNestedChange(
                  "previousSchool",
                  "schoolName",
                  e.target.value
                )}
            />

            <Input
              type="date"
              label="Date Started:"
              value={formDetails.previousSchool.from}
              onChange={(e) =>
                handleNestedChange(
                  "previousSchool",
                  "from",
                  e.target.value
                )}
            />

            <Input
              type="date"
              label="Date Ended:"
              value={formDetails.previousSchool.till}
              onChange={(e) =>
                handleNestedChange(
                  "previousSchool",
                  "till",
                  e.target.value
                )}
            />

            <Select 
              label={"Class admitted to"}
              options={schoolMainClasses}
              value={formDetails.academic.classOnAdmission}
              onChange={(e) =>
                handleNestedChange(
                  "academic",
                  "classOnAdmission",
                  e.target.value
                )}
            />

            <div>
              <p>Current Class</p>
              <div className="p-2 shadow-md my-2">
                <select className="p-2 bg-gray-100 rounded-md"
              value={formDetails.academic.currentClass} 
              onChange={(e) =>
                handleNestedChange(
                  "academic",
                  "currentClass",
                  e.target.value
                )}
                >
                  <option>--Select Class--</option>
                  {savedClasses.length > 0 && 
                   savedClasses.map((item) => (
                    <option key={item.classId} value={item._id}>
                      ({item.mainClass}) {item.classId}
                    </option>
                   ))
                  }
                </select>
              </div>
            </div>
          </div>
        </FormSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">     
              </div>

{/* ================= GUARDIAN DETAILS ================= */}
        <FormSection
          icon={<FaUserShield size={24} />}
          title="GUARDIAN DETAILS"
          description={"Fill in Parent or Guardian Information"}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Input
              label="Full Name:"
              placeholder="Guardian Name"
              value={formDetails.guardians.name}
              onChange={(e) =>
                handleNestedChange(
                  "guardians",
                  "name",
                  e.target.value
                )
              }
            />

            <Input
              type="email"
              label="Email Address:"
              placeholder="example@mail.com"
              value={formDetails.guardians.email}
              onChange={(e) =>
                handleNestedChange(
                  "guardians",
                  "email",
                  e.target.value
                )
              }
            />

            <Input
              type="tel"
              label="Phone Number:"
              placeholder="+1234567890"
              value={formDetails.guardians.phone}
              onChange={(e) =>
                handleNestedChange(
                  "guardians",
                  "phone",
                  e.target.value
                )
              }
            />

            <Input
              label="Relationship:"
              placeholder="e.g. Father, Mother, Uncle"
              value={formDetails.guardians.relationship}
              onChange={(e) =>
                handleNestedChange(
                  "guardians",
                  "relationship",
                  e.target.value
                )
              }
            />

            <Input
              label="Occupation:"
              placeholder="e.g. Engineer, Business"
              value={formDetails.guardians.occupation}
              onChange={(e) =>
                handleNestedChange(
                  "guardians",
                  "occupation",
                  e.target.value
                )
              }
            />

            <Input
              label="Residential Address:"
              placeholder="Home Address"
              value={formDetails.guardians.address}
              onChange={(e) =>
                handleNestedChange(
                  "guardians",
                  "address",
                  e.target.value
                )
              }
            />
          </div>
        </FormSection>

        <FormSection
          icon={<FiBookOpen />}
          title="Academic Information"
          description="Current academic placement"
        > 
          <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            <div>
              <p>CLASS ID: </p>
              <select value={formDetails.academic.currentClass}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              value={formDetails.academic.currentClass}
                onChange={(e) =>
                handleNestedChange(
                  "academic",
                  "currentClass",
                  e.target.value
                ) }
              >
                <option value="">--Select Class--</option>
                  {savedClasses.length > 0 && 
                   savedClasses.map((item) => (
                    <option key={item.classId} value={item._id}>
                      ({item.mainClass}) {item.classId}
                    </option>
                   ))
                  }
              </select>
            </div>

            <Input
              label="Academic Session"
              placeholder="e.g. 2025/2026"
              value={formDetails.academic.session}
              onChange={(e) =>
                handleNestedChange(
                  "academic",
                  "session",
                  e.target.value
                )
              }
              required
            />

            <Input
              label="Term"
              placeholder={"e.g First Term"}
              value={formDetails.academic.term}
              onChange={(e) =>
                handleNestedChange(
                  "academic",
                  "term",
                  e.target.value
                )
              }
              options={["First", "Second", "Third"]}
              required
            />

          </div>

        </FormSection>

         {/* ============= Contact Information ============== */}
         <FormSection 
          title="Contact Details"
          icon={<FaTelegram size={24}/>}
          description="Enter Student Contact Information"
         >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:grid-cols-3">
           <Input label="Contact Phone" 
             placeholder={"Enter Student Phone"}
             value={formDetails.contact.phone}
             onChange={(e) => handleNestedChange( "contact", "phone",   e.target.value) }/> 
           <Input label="Student Email" 
             placeholder={"Optional"}
             value={formDetails.contact.email}
             onChange={(e) => handleNestedChange( "contact", "email",   e.target.value) }/> 
           <Input label="Contact Address" 
             placeholder={"Student Residential Address"}
             value={formDetails.contact.address}
             onChange={(e) => handleNestedChange( "contact", "address",   e.target.value) }/> 
          </div>
         </FormSection>

         {/*Medical*/}
         <FormSection
          icon={<FiMail/> }
          title="Medical Information"
          description={"Add Student Medical Record"}
        >
      <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-5">

            <Select
              label="Blood Group"
              value={formDetails.medical.bloodGroup}
              onChange={(e) =>
                handleNestedChange(
                  "medical",
                  "bloodGroup",
                  e.target.value
                )
              }
              options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
            />

            <Select
              label="Genotype"
              value={formDetails.medical.genotype}
              onChange={(e) =>
                handleNestedChange(
                  "medical",
                  "genotype",
                  e.target.value
                )
              }
              options={["AA", "AS", "SS", "AC", "SC"]}
            />

       <Input label="Allergies" 
             placeholder={"Optional"}
             value={formDetails.medical.allergies}
             onChange={(e) => handleNestedChange( "medical", "allergies",   e.target.value) }/>

       <Input label="Disability" 
             placeholder={"Optional"}
             value={formDetails.medical.disability}
             onChange={(e) => handleNestedChange( "medical", "disability",   e.target.value) }/> 

       <Input label="Other Issues" 
             placeholder={"Optional"}
             value={formDetails.medical.otherIssues}
             onChange={(e) => handleNestedChange( "medical", "otherIssues",   e.target.value) }/>              
      </div>        
         </FormSection>

         {/*Real COntact Information*/}
        <FormSection
          icon={<FiMail/> }
          title="Contact Information"
          description={"Ensure you Enter Correct Contact Details. Crucial Infomation will be sent Here!"}
        >
          <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-5">

            <Input label="Guardian Email" 
             placeholder={"Guardian Mail"}
             value={formDetails.realContact.guardianMail}
             onChange={(e) => handleNestedChange( "realContact", "guardianMail",   e.target.value) }  required/>

            <Input label="Guardian Telephone" 
             placeholder={"Enter Phone No."}
             value={formDetails.realContact.guardianTel}
             onChange={(e) => handleNestedChange( "realContact", "guardianTel",   e.target.value) }  required/>

            <Input label="Student Mail" 
             placeholder={"Enter Email."}
             value={formDetails.realContact.studentMail}
             onChange={(e) => handleNestedChange( "realContact", "studentMail",   e.target.value) }  required/>

            <Input label="Student Telephone" 
             placeholder={"Enter Phone No."}
             value={formDetails.realContact.studentTel}
             onChange={(e) => handleNestedChange( "realContact", "studentTel",   e.target.value) }  required/>
          </div>
        </FormSection>

        {/* ================= STATUS ================= */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 rounded-lg p-3 text-sm">
            {success}
          </div>
        )}

        {/* ================= ACTION ================= */}

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 disabled:bg-indigo-400 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            <FiSave />
            {loading ? "Registering..." : "Register Student"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

/*
|--------------------------------------------------------------------------
| FORM SECTION
|--------------------------------------------------------------------------
*/

function FormSection({
  icon,
  title,
  description,
  children,
}) {
  return (
    <section>
      <div className="flex items-start gap-3 mb-5">
        <div className="text-indigo-700 mt-1">
          {icon}
        </div>

        <div>
          <h3 className="font-semibold text-slate-800">
            {title}
          </h3>

          <p className="text-sm text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  )
}

/*
|--------------------------------------------------------------------------
| INPUT
|--------------------------------------------------------------------------
*/

function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled=false,
  required = false,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}

        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| SELECT
|--------------------------------------------------------------------------
*/

function Select({
  label,
  value,
  onChange,
  options,
  required = false,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}

        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      <select
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option || option.classId} value={option || option.classId}>
            {option || option.classId}
          </option>
        ))}
      </select>
    </div>
  );
}

export {Select, Input, FormSection};