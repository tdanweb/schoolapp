//also bio data page...
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaUser,
  FaIdCard,
  FaCalendarAlt,
  FaVenusMars,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaSchool,
  FaGraduationCap,
  FaHeartbeat,
  FaTint,
  FaUsers,
  FaBriefcase,
  FaMoneyBillWave,
  FaCamera,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaBullseye,
} from "react-icons/fa";
import { mainApi } from "../api";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  disabled = false,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full border border-slate-200 rounded-xl py-3 outline-none
          focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900
          ${Icon ? "pl-10" : "px-3"}
          ${disabled ? "bg-slate-100 cursor-not-allowed" : "bg-white"}`}
        />
      </div>
    </div>
  );
}


// ================================
// SELECT
// ================================

function Select({
  label,
  value,
  onChange,
  options,
  disabled=false,
  icon: Icon,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        )}

        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full border border-slate-200 rounded-xl py-3 bg-white
          outline-none focus:ring-2 focus:ring-blue-900/20
          ${Icon ? "pl-10 pr-3" : "px-3"}`}
        >
          <option value="">Select</option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}


// ================================
// TEXTAREA
// ================================

function TextArea({
  label,
  value,
  disabled = false,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        disabled={disabled}
        className="w-full border border-slate-200 rounded-xl px-3 py-3
        outline-none resize-none focus:ring-2 focus:ring-blue-900/20
        focus:border-blue-900"
      />
    </div>
  );
}


// ================================
// INITIAL FORM
// ================================

const initialForm = {
  admissionNo: "",

  fullName: "",
  surname: "",
  otherName: "",

  dob: "",
  nationality: "Nigeria",
  stateOfOrigin: "",
  lga: "",
  gender: "",

  streamId: "2026-2027",

  contact: {
    phone: "",
    email: "",
    address: "",
  },

  academic: {
    classOnAdmission: "",
    arm: "",
    department: "",
    session: "2026/2027",
    term: "First",
  },

  previousSchools: {
    schoolName: "",
    from: "",
    till: "",
  },

  medical: {
    bloodGroup: "",
    genotype: "",
    allergies: "",
    disability: "",
    otherIssues: "",
  },

  sponsor: {
    name: "",
    workplace: "",
    salary: "",
    relationship: "",
    address: "",
    phone: "",
    email: "",
  },

  passportUrl: "",
};


export default function ApplicantRegPage(){
 const [alertMsg, setAlertMsg] = useState("")

  const [applicant, setApplicant] = useState(null);
  const [viewMode, setViewMode] = useState(false)

  const [form, setForm] = useState(initialForm);

  const [step, setStep] = useState(1);

  const [passport, setPassport] = useState(null);

  const [regPin, setRegPin] = useState("");

  // Get registration PIN
  useEffect(() => {
    const savedPin = localStorage.getItem("applicant-pin");
    const savedUser = localStorage.getItem("logged-applicant");

    if (savedPin) {
      try {
        setRegPin(JSON.parse(savedPin));
        setForm({...form, regNo: JSON.parse(savedUser).appId})
      } catch {
        setRegPin(savedPin);
      }
    }

    const user = JSON.parse(savedUser);
    getUser(user.appId)
  }, []);


//get user
async function getUser (u){
    try {

        const res = await axios.get(`${mainApi}/applicant/${u}`)
        console.log(res.data)
        setApplicant(res.data.applicant)
        setViewMode(true)
    } catch (error) {
        if(error.response){
           // alert(error.response.data.msg)
        } else{
          //alert("Server Error")
        }
    }
}

  // Load saved registration
  useEffect(() => {
    const saved = localStorage.getItem("applicant-registration");

    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch {
        console.log("Unable to load saved registration");
      }
    }
  }, []);

// ================================
  // UPDATE NORMAL FIELD
  // ================================

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  // ================================
  // UPDATE NESTED FIELD
  // ================================

  const updateNested = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };


  // ================================
  // SAVE PROGRESS
  // ================================

  const saveProgress = () => {
    localStorage.setItem(
      "applicant-registration",
      JSON.stringify(form)
    );

    console.log("Registration data:", form);
  };


  // ================================
  // NEXT
  // ================================

  const nextStep = () => {
    saveProgress();

    if (step < 4) {
      setStep(step + 1);
    }
  };


  // ================================
  // PREVIOUS
  // ================================

  const previousStep = () => {
    saveProgress();

    if (step > 1) {
      setStep(step - 1);
    }
  };


  // ================================
  // PASSPORT
  // ================================

  const handlePassport = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setPassport(file);

    console.log("Passport selected:", file);

    // Later:
    // FormData + Cloudinary/backend upload
  };


 const [loadP, setLoadP] = useState(false)
  const UploadPassport = async () => {
    const regNo = applicant.regNo;
    setLoadP(true);

    if (!passport) {
        return alert("Select a Passport");
    }
    const formData = new FormData();
    formData.append("passport", passport);
    formData.append("regNo", regNo);
    try {
        const res = await axios.post(
            `${mainApi}/applicant/upload-passport`,
            formData
        );
        console.log(res.data);
        setAlertMsg(res.data.msg)
    } catch (error) {
        setAlertMsg(
            error.response?.data?.msg ||
            "Failed to upload passport"
        );
    } finally{
        setLoadP(false)
    }
};


  // ================================
  // FINAL SUBMIT
  // ================================

  const submitRegistration = async () => {

    saveProgress();

 //   console.log("========== APPLICATION ==========");
    console.log("Registration PIN:", regPin);
  //  console.log("Applicant Data:", form);
    console.log("Passport:", passport);

    const data = {...form, pin: regPin.pin, session: regPin.session}
   // setAlertMsg("Registration information captured successfully.\n\nBackend submission will be connected here."  );

    const api = `${mainApi}/applicant/reg`

    try {
       const res = await axios.post(api, data);
       setAlertMsg(res.data.msg)
       reload()
    } catch (error) {

        if(error.response) {
            setAlertMsg(error.response.data.msg)
    } else {
        setAlertMsg("Server/Network Error")
    }
  }
}

const navigate = useNavigate()
  const steps = [
    "Personal",
    "Academic",
    "Medical",
    "Sponsor",
  ];

const reload = () => {
    setAlertMsg(""); navigate("/applicant/data")
}
  
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
{alertMsg && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className="relative w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
      
      {/* Close button */}
      <button
        onClick={reload}
        className="absolute right-4 top-3 text-2xl font-bold text-gray-500 hover:text-gray-800"
      >
        &times;
      </button>

      {/* School crest */}
      <img
        src="/crest.png"
        alt="School Crest"
        className="mx-auto mb-4 h-20 w-20 object-contain"
      />

      <p className="text-gray-700">
        {alertMsg}
      </p>

    </div>
  </div>
)}
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}

        <div className="mb-7">
          <p className="text-sm text-blue-700 font-medium">
            {!viewMode && "Admission Registration"}
          </p>

          <h1 className="text-2xl md:text-3xl font-bold text-blue-950">
            Applicant Biodata
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            { viewMode ? "Your Application had been Submitted. Editing Bio-Data is not available at the moment." :  "Complete your registration carefully. Your progress is saved automatically." }
          </p>

          {applicant && <ApplicantCard user={applicant} show={viewMode}/> }
        </div>


        {/* REG PIN */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5">

          <Input
            label="Registration PIN"
            value={regPin.pin}
            disabled
            icon={FaIdCard}
          />

          <p className="text-xs text-slate-400 mt-2">
            This PIN was generated after your application fee payment.
          </p>

        </div>


        {/* STEPPER */}

        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5">

          <div className="flex items-center">

            {steps.map((name, index) => {

              const number = index + 1;
              const active = step === number;
              const completed = step > number;

              return (
                <div
                  key={name}
                  className="flex items-center flex-1 last:flex-none"
                >

                  <div className="flex flex-col items-center">

                    <div
                      className={`w-9 h-9 rounded-full flex items-center
                      justify-center text-sm font-bold
                      ${
                        completed || active
                          ? "bg-blue-950 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {completed ? <FaCheck /> : number}
                    </div>

                    <span
                      className={`text-xs mt-2 hidden sm:block
                      ${
                        active
                          ? "text-blue-950 font-semibold"
                          : "text-slate-400"
                      }`}
                    >
                      {name}
                    </span>

                  </div>


                  {number !== steps.length && (
                    <div
                      className={`h-0.5 flex-1 mx-2
                      ${
                        completed
                          ? "bg-blue-950"
                          : "bg-slate-200"
                      }`}
                    />
                  )}

                </div>
              );
            })}

          </div>

        </div>


        {/* FORM CARD */}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <AnimatePresence mode="wait">

            {/* ===================== */}
            {/* STEP 1 PERSONAL */}
            {/* ===================== */}

            {step === 1 && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="p-5 md:p-7"
              >

                <SectionTitle
                  title="Personal Information"
                  text="Enter the applicant's basic biodata."
                />

                <div className="grid md:grid-cols-2 gap-5">

                  <Input
                    label="Surname"
                    value={form.surname}
                    onChange={(e) =>
                      updateField("surname", e.target.value)
                    }
                    icon={FaUser}
                    disabled={viewMode}
                    placeholder="Surname"
                  />

                  <Input
                    label="Other Name"
                    value={form.otherName}
                    disabled={viewMode}
                    onChange={(e) =>
                      updateField("otherName", e.target.value)
                    }
                    icon={FaUser}
                    placeholder="Other name"
                  />

                  <Input
                    label="Full Name"
                    value={form.fullName}
                    disabled={viewMode}
                    onChange={(e) =>
                      updateField("fullName", e.target.value)
                    }
                    icon={FaUser}
                    placeholder="Full name"
                  />

                  <Input
                    label="Date of Birth"
                    type="date"
                    value={form.dob}
                    onChange={(e) =>
                      updateField("dob", e.target.value)
                    }
                    disabled={viewMode}
                    icon={FaCalendarAlt}
                  />

                  <Select
                    label="Gender"
                    value={form.gender}
                    onChange={(e) =>
                      updateField("gender", e.target.value)
                    }
                    options={["Male", "Female"]}
                    icon={FaVenusMars}
                    disabled={viewMode}
                  />

                  <Input
                    label="Nationality"
                    value={form.nationality}
                    onChange={(e) =>
                      updateField("nationality", e.target.value)
                    }
                    icon={FaMapMarkerAlt}
                    disabled={viewMode}
                  />

                  <Input
                    label="State of Origin"
                    value={form.stateOfOrigin}
                    onChange={(e) =>
                      updateField("stateOfOrigin", e.target.value)
                    }
                    disabled={viewMode}
                    icon={FaMapMarkerAlt}
                    placeholder="State"
                  />

                  <Input
                    label="LGA"
                    value={form.lga}
                    onChange={(e) =>
                      updateField("lga", e.target.value)
                    }
                    disabled={viewMode}
                    icon={FaMapMarkerAlt}
                    placeholder="Local Government Area"
                  />

                  <Input
                    label="Phone Number"
                    value={form.contact.phone}
                    onChange={(e) =>
                      updateNested(
                        "contact",
                        "phone",
                        e.target.value
                      )
                    }
                    disabled={viewMode}
                    icon={FaPhone}
                    placeholder="080..."
                  />

                  <Input
                    label="Email"
                    type="email"
                    value={form.contact.email}
                    onChange={(e) =>
                      updateNested(
                        "contact",
                        "email",
                        e.target.value
                      )
                    }
                    disabled={viewMode}
                    icon={FaEnvelope}
                    placeholder="example@email.com"
                  />

                </div>


                <div className="mt-5">
                  <TextArea
                    label="Residential Address"
                    value={form.contact.address}
                    onChange={(e) =>
                      updateNested(
                        "contact",
                        "address",
                        e.target.value
                      )
                    }
                    disabled={viewMode}
                    placeholder="Enter residential address"
                  />
                </div>

              </motion.div>
            )}


            {/* ===================== */}
            {/* STEP 2 ACADEMIC */}
            {/* ===================== */}

            {step === 2 && (
              <motion.div
                key="academic"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="p-5 md:p-7"
              >

                <SectionTitle
                  title="Academic Information"
                  text="Provide the class and previous school information."
                />

                <div className="grid md:grid-cols-2 gap-5">

                  <Select
                    label="Class Applying For"
                    value={form.academic.classOnAdmission}
                    onChange={(e) =>
                      updateNested(
                        "academic",
                        "classOnAdmission",
                        e.target.value
                      )
                    }
                    disabled={viewMode}
                    icon={FaGraduationCap}
                    options={[
                      "Creche",
                      "Nursery 1",
                      "Nursery 2",
                      "Primary 1",
                      "Primary 2",
                      "Primary 3",
                      "Primary 4",
                      "Primary 5",
                      "JSS1",
                      "JSS2",
                      "JSS3",
                      "SS1",
                    ]}
                  />

                  <Select
                    label="Arm"
                    value={form.academic.arm}
                    onChange={(e) =>
                      updateNested(
                        "academic",
                        "arm",
                        e.target.value
                      )
                    }
                    icon={FaUsers}
                    disabled={viewMode}
                    options={["A", "B", "C"]}
                  />

                  <Select
                    label="Department"
                    value={form.academic.department}
                    onChange={(e) =>
                      updateNested(
                        "academic",
                        "department",
                        e.target.value
                      )
                    }
                    icon={FaGraduationCap}
                    options={[
                      "Science",
                      "Arts",
                      "Commercial",
                    ]}
                    disabled={viewMode}
                  />

                  <Input
                    label="Academic Session"
                    value={form.academic.session}
                    disabled={viewMode}
                    icon={FaCalendarAlt}
                  />

                  <Select
                    label="Term"
                    value={form.academic.term}
                    onChange={(e) =>
                      updateNested(
                        "academic",
                        "term",
                        e.target.value
                      )
                    }
                    disabled={viewMode}
                    options={[
                      "First",
                      "Second",
                      "Third",
                    ]}
                  />
                </div>


                <div className="border-t border-slate-100 mt-8 pt-6">

                  <h3 className="font-semibold text-blue-950 mb-4">
                    Previous School
                  </h3>

                  <div className="grid md:grid-cols-3 gap-5">

                    <Input
                      label="School Name"
                      value={
                        form.previousSchools.schoolName
                      }
                      disabled={viewMode}
                      onChange={(e) =>
                        updateNested(
                          "previousSchools",
                          "schoolName",
                          e.target.value
                        )
                      }
                      icon={FaSchool}
                      placeholder="Previous school"
                    />

                    <Input
                      label="From"
                      value={
                        form.previousSchools.from
                      }
                      disabled={viewMode}
                      onChange={(e) =>
                        updateNested(
                          "previousSchools",
                          "from",
                          e.target.value
                        )
                      }
                      placeholder="2019"
                    />

                    <Input
                      label="Till"
                      value={
                        form.previousSchools.till
                      }
                      onChange={(e) =>
                        updateNested(
                          "previousSchools",
                          "till",
                          e.target.value
                        )
                      }
                      disabled={viewMode}
                      placeholder="2025"
                    />

                  </div>

                </div>

              </motion.div>
            )}


            {/* ===================== */}
            {/* STEP 3 MEDICAL */}
            {/* ===================== */}

            {step === 3 && (
              <motion.div
                key="medical"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="p-5 md:p-7"
              >

                <SectionTitle
                  title="Medical Information"
                  text="This information helps us provide appropriate care."
                />

                <div className="grid md:grid-cols-2 gap-5">

                  <Select
                    label="Blood Group"
                    value={form.medical.bloodGroup} disabled={viewMode}
                    onChange={(e) =>
                      updateNested(
                        "medical",
                        "bloodGroup",
                        e.target.value
                      )
                    }
                    icon={FaTint}
                    options={[
                      "A+",
                      "A-",
                      "B+",
                      "B-",
                      "AB+",
                      "AB-",
                      "O+",
                      "O-",
                    ]}
                  />

                  <Select
                    label="Genotype"
                    value={form.medical.genotype}  disabled={viewMode}
                    onChange={(e) =>
                      updateNested(
                        "medical",
                        "genotype",
                        e.target.value
                      )
                    }
                    icon={FaHeartbeat}
                    options={[
                      "AA",
                      "AS",
                      "SS",
                      "AC",
                      "SC",
                    ]}
                  />

                  <Input
                    label="Allergies"
                    value={form.medical.allergies}  disabled={viewMode}
                    onChange={(e) =>
                      updateNested(
                        "medical",
                        "allergies",
                        e.target.value
                      )
                    }
                    icon={FaHeartbeat}
                    placeholder="None if applicable"
                  />

                  <Input
                    label="Disability"
                    value={form.medical.disability}  disabled={viewMode}
                    onChange={(e) =>
                      updateNested(
                        "medical",
                        "disability",
                        e.target.value
                      )
                    }
                    icon={FaHeartbeat}
                    placeholder="None if applicable"
                  />

                </div>


                <div className="mt-5">

                  <TextArea
                    label="Other Medical Issues"
                    value={form.medical.otherIssues}  disabled={viewMode}
                    onChange={(e) =>
                      updateNested(
                        "medical",
                        "otherIssues",
                        e.target.value
                      )
                    }
                    placeholder="Any other medical information we should know..."
                  />

                </div>

              </motion.div>
            )}


            {/* ===================== */}
            {/* STEP 4 SPONSOR */}
            {/* ===================== */}

            {step === 4 && (
              <motion.div
                key="sponsor"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="p-5 md:p-7"
              >

                <SectionTitle
                  title="Sponsor / Parent Information"
                  text="Provide the details of the person responsible for the applicant."
                />

                <div className="grid md:grid-cols-2 gap-5">

                  <Input
                    label="Full Name"
                    value={form.sponsor.name}  disabled={viewMode}
                    onChange={(e) =>
                      updateNested(
                        "sponsor",
                        "name",
                        e.target.value
                      )
                    }
                    icon={FaUser}
                    placeholder="Sponsor's full name"
                  />

                  <Select
                    label="Relationship"
                    value={form.sponsor.relationship}  disabled={viewMode}
                    onChange={(e) =>
                      updateNested(
                        "sponsor",
                        "relationship",
                        e.target.value
                      )
                    }
                    icon={FaUsers}
                    options={[
                      "Father",
                      "Mother",
                      "Guardian",
                      "Brother",
                      "Sister",
                      "Other",
                    ]}
                  />

                  <Input
                    label="Workplace"
                    value={form.sponsor.workplace}  disabled={viewMode}
                    onChange={(e) =>
                      updateNested(
                        "sponsor",
                        "workplace",
                        e.target.value
                      )
                    }
                    icon={FaBriefcase}
                    placeholder="Company / Organisation"
                  />

                  <Input
                    label="Monthly Salary"
                    value={form.sponsor.salary}  disabled={viewMode}
                    onChange={(e) =>
                      updateNested(
                        "sponsor",
                        "salary",
                        e.target.value
                      )
                    }
                    icon={FaMoneyBillWave}
                    placeholder="e.g. ₦250,000"
                  />

                  <Input
                    label="Phone Number"
                    value={form.sponsor.phone} disabled={viewMode}
                    onChange={(e) =>
                      updateNested(
                        "sponsor",
                        "phone",
                        e.target.value
                      )
                    }
                    icon={FaPhone}
                  />

                  <Input
                    label="Email"
                    type="email"
                    value={form.sponsor.email}
                    onChange={(e) =>
                      updateNested(
                        "sponsor",
                        "email",
                        e.target.value
                      )
                    }
                    icon={FaEnvelope}  disabled={viewMode}
                  />

                </div>


                <div className="mt-5">

                  <TextArea
                    label="Sponsor Address"
                    value={form.sponsor.address}  disabled={viewMode}
                    onChange={(e) =>
                      updateNested(
                        "sponsor",
                        "address",
                        e.target.value
                      )
                    }
                    placeholder="Sponsor's residential or office address"
                  />

                </div>


                {/* PASSPORT */}

                {!applicant ? <p className="text-lg font-poppins text-sky-700 italic"> You will be able to upload passport after successful application</p>  :
                
                <>
                <div className="border-t border-slate-100 mt-8 pt-6">

                  <h3 className="font-semibold text-blue-950 mb-1">
                    Applicant Passport Photograph
                  </h3>

                  <p className="text-sm text-slate-500 mb-4">
                    Upload a clear passport photograph.
                  </p>

                  <label
                    className="border-2 border-dashed border-slate-200
                    rounded-2xl p-7 flex flex-col items-center
                    justify-center cursor-pointer hover:border-blue-900
                    transition"
                  >

                    {passport ? (
                      <>
                        <img
                          src={URL.createObjectURL(passport)}
                          className="w-28 h-28 object-cover rounded-xl mb-3"
                        />

                        <p className="text-sm font-medium text-green-600">
                          Passport selected
                        </p>
                      </>
                    ) : (
                      <>
                        <FaCamera
                          size={30}
                          className="text-slate-400 mb-3"
                        />

                        <p className="font-medium text-slate-700">
                          Click to upload passport
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          JPG, PNG or WEBP
                        </p>
                      </>
                    )}

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handlePassport}
                      className="hidden"
                    />

                  </label>

                </div>
                <button disabled={loadP} onClick={UploadPassport} className={"p-2 rounded-md cursor-pointer font-lato text-center text-white bg-slate-700 my-2 w-full"}>UPLOAD PASSPORT</button>
                </>
             }

              </motion.div>
            )}

          </AnimatePresence>


          {/* ===================== */}
          {/* NAVIGATION */}
          {/* ===================== */}

          <div className="border-t border-slate-100 p-5 flex justify-between">

            <button
              onClick={previousStep}
              disabled={step === 1 }
              className="flex items-center gap-2 px-5 py-3 rounded-xl
              border border-slate-200 text-slate-600
              disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaArrowLeft />
              Back
            </button>


            {step < 4 ? (

              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3
                rounded-xl bg-blue-950 text-white font-semibold
                hover:bg-blue-900"
              >
                Save & Continue
                <FaArrowRight />
              </button>

            ) : (

              <button
                onClick={submitRegistration}
                disabled={viewMode}
                className={`flex items-center gap-2 px-6 py-3
                rounded-xl ${!viewMode && 'bg-yellow-500'} ${viewMode && 'bg-sky-700 text-white'} text-blue-950
                font-bold hover:bg-yellow-400`}
              >
                {!viewMode && <span className="flex gap-2 items-center">Submit Registration <FaCheck /> </span>}
                {viewMode && <span className="flex gap-2 items-center">APPLICATION SUBMITTED <FaCheck/> </span>}
              </button>

            )}

          </div>

        </div>

      </div>

    </div>
  )
}


// ================================
// SECTION TITLE
// ================================

function SectionTitle({ title, text }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-blue-950">
        {title}
      </h2>

      <p className="text-sm text-slate-500 mt-1">
        {text}
      </p>
    </div>
  );
}


// ==================================
// SUCCESSFUL REG CARDFOR APPLICANTS
// ==================================
// SUCCESSFUL REG CARD FOR APPLICANTS
// ==================================
function ApplicantCard({ user, show = false }) {
  // Format application date
  const formattedDate = user.applicationDate
    ? new Date(user.applicationDate).toLocaleDateString("en-NG", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="w-full max-w-md bg-white border border-gray-300 rounded-xl shadow-md overflow-hidden">
      {/* Card Header */}
      <div className="bg-teal-800 text-white px-4 py-2">
        <h2 className="text-sm font-bold tracking-wide">
          APPLICANT REGISTRATION CARD
        </h2>
        <p className="text-[10px] opacity-80">
          Achievers International Schools
        </p>
      </div>

      {/* Card Body */}
      <div className="p-4 flex gap-4">
        {/* Passport */}
        <div className="shrink-0">
          <img
            src={user.passportUrl || "/passport.png"}
            alt="passport"
            className="w-24 h-28 object-cover rounded-lg border-2 border-teal-700 shadow-sm"
          />
        </div>

        {/* Applicant Information */}
        <div className="flex-1 space-y-1.5">
          {/* Full Name */}
          <div>
            <p className="text-[9px] uppercase text-gray-500 font-semibold">
              Full Name
            </p>
            <p className="text-sm font-bold text-teal-900">
              {user.fullName || "N/A"}
            </p>
          </div>

          {/* Name Breakdown */}
          <div className="grid grid-cols-2 gap-x-3">
            <div>
              <p className="text-[9px] uppercase text-gray-500 font-semibold">
                Surname
              </p>
              <p className="text-[11px] font-semibold text-gray-800">
                {user.surname || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-[9px] uppercase text-gray-500 font-semibold">
                Other Name
              </p>
              <p className="text-[11px] font-semibold text-gray-800">
                {user.otherName || "N/A"}
              </p>
            </div>
          </div>

          {/* Reg & Admission Number */}
          <div className="grid grid-cols-2 gap-x-3">
            <div>
              <p className="text-[9px] uppercase text-gray-500 font-semibold">
                Reg. No
              </p>
              <p className="text-[11px] font-bold text-teal-800">
                {user.regNo || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-[9px] uppercase text-gray-500 font-semibold">
                Admission No
              </p>
              <p className="text-[11px] font-bold text-teal-800">
                {user.admissionNo || "Pending"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[9px] uppercase text-gray-500 font-semibold">
              Phone
            </p>
            <p className="text-[10px] font-medium text-gray-800">
              {user.phone || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-[9px] uppercase text-gray-500 font-semibold">
              Application Date
            </p>
            <p className="text-[10px] font-medium text-gray-800">
              {formattedDate}
            </p>
          </div>
        <div className="mt-2">
          <p className="text-[9px] uppercase text-gray-500 font-semibold">
            ADMISSION STATUS
          </p>
          <p className="text-[10px] text-gray-800 break-all">
            {user.status.toUpperCase() || "N/A"}
          </p>
        </div>
          <div>
            <p className="text-[9px] uppercase text-gray-500 font-semibold">
              SESSION
            </p>
            <p className="text-[10px] font-medium text-gray-800">
              {user.streamId}
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase text-gray-500 font-semibold">
              GENDER
            </p>
            <p className="text-[10px] font-medium text-gray-800">
              {user.gender}
            </p>
          </div>
        </div>

        {/* Address */}

        {/* Email */}
        <div className="mt-2">
          <p className="text-[9px] uppercase text-gray-500 font-semibold">
            Email
          </p>
          <p className="text-[10px] text-gray-800 break-all">
            {user.email || "N/A"}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-teal-800 text-white text-center py-1.5">
        <p className="text-[9px] tracking-wide">
          THIS CARD INDICATES YOUR APPLICATION HAS BEEN SUBMITTED
        </p>
      </div>
      
    </div>
  )}