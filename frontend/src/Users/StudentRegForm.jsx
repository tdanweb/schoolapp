import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Users,
  GraduationCap,
  Phone,
  HeartPulse,
  School,
  X,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Search,
} from "lucide-react";
import { mainApi } from "../api";
import axios from "axios";

/*
  ============================================================
  STUDENT REGISTRATION FORM
  ============================================================

  Fresh Registration:
  - admissionNo/regNo are NOT shown
  - backend will generate them

  Already Admitted:
  - admissionNo is requested through an overlay
  - mocked student is loaded
  - admissionNo/regNo are displayed but disabled
  - user fills the remaining information

  Final submission:
  - console.log(newStudent)
*/


// ============================================================
// MOCK DATA
// ============================================================

const mockedAdmittedStudents = [
  {
    admissionNo: "ADM/2026/001",
    regNo: "AIS/2026/001",
    surname: "Daniel",
    firstName: "David",
    otherName: "Samuel",
    classOnAdmission: "JSS1",
    session: "2026/2027",
    gender: "Male",
  },
  {
    admissionNo: "ADM/2026/002",
    regNo: "AIS/2026/002",
    surname: "Adeyemi",
    firstName: "Deborah",
    otherName: "Grace",
    classOnAdmission: "JSS2",
    session: "2026/2027",
    gender: "Female",
  },
  {
    admissionNo: "ADM/2026/003",
    regNo: "AIS/2026/003",
    surname: "Okafor",
    firstName: "Michael",
    otherName: "Chinedu",
    classOnAdmission: "SS1",
    session: "2026/2027",
    gender: "Male",
  },
];


// ============================================================
// SAMPLE CLASS OPTIONS
// Replace this with your actual classes from the backend.
// ============================================================

const classOptions = [
  {
    id: "class-jss1",
    name: "JSS 1",
    arm: "A",
    department: "",
  },
  {
    id: "class-jss2",
    name: "JSS 2",
    arm: "A",
    department: "",
  },
  {
    id: "class-jss3",
    name: "JSS 3",
    arm: "A",
    department: "",
  },
  {
    id: "class-ss1",
    name: "SS 1",
    arm: "A",
    department: "Science",
  },
  {
    id: "class-ss2",
    name: "SS 2",
    arm: "A",
    department: "Science",
  },
  {
    id: "class-ss3",
    name: "SS 3",
    arm: "A",
    department: "Science",
  },
];


// ============================================================
// EMPTY STUDENT OBJECT
// ============================================================

const emptyStudent = {
  admissionNo: "",
  regNo: "",
  personalInfo: {
    surname: "",
    firstName: "",
    otherName: "",
    nin: "",
    gender: "",
    dob: "",
    religion: "",
    nationality: "Nigeria",
    stateOfOrigin: "",
    lga: "",
    hobbies: "",
  },

  contact: {
    phone: "",
    email: "",
    address: "",
  },

  academic: {
    classOnAdmission: "",
    currentClass: "",
    realClassId: "",
    realClassArm: "",
    realDepartment: "",
    realClass: "",
    arm: "",
    department: "",
    session: "2026/2027",
    term: "First",
  },

  dateAdmitted: "",

  club_house: "Academic/Blue",

  previousSchools: {
    schoolName: "",
    from: "",
    till: "",
  },

  guardians: {
    name: "",
    relationship: "",
    phone: "",
    email: "",
    occupation: "",
    address: "",
  },

  medical: {
    bloodGroup: "",
    genotype: "",
    allergies: "",
    disability: "",
    otherIssues: "",
  },

  realContact: {
    guardianMail: "",
    studentMail: "",
    guardianTel: "",
    studentTel: "",
  },
};


// ============================================================
// REUSABLE INPUT
// ============================================================

function CustomInput({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
  disabled = false,
  icon: Icon,
}) {
  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}

        <input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition
          focus:border-blue-500 focus:ring-2 focus:ring-blue-100
          disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500
          ${Icon ? "pl-10" : ""}`}
        />
      </div>
    </div>
  );
}


// ============================================================
// REUSABLE SELECT
// ============================================================

function CustomSelect({
  label,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
}) {
  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition
        focus:border-blue-500 focus:ring-2 focus:ring-blue-100
        disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option
            key={option.value ?? option.id ?? option}
            value={option.value ?? option.id ?? option}
          >
            {option.label ?? option.name ?? option}
          </option>
        ))}
      </select>
    </div>
  );
}


// ============================================================
// REUSABLE DATE INPUT
// ============================================================

function CustomDate({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
}) {
  return (
    <CustomInput
      label={label}
      value={value}
      onChange={onChange}
      type="date"
      required={required}
      disabled={disabled}
    />
  );
}


// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={20} />
      </div>

      <div>
        <h2 className="text-base font-bold text-gray-800">{title}</h2>

        {description && (
          <p className="mt-0.5 text-xs text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
}


// ============================================================
// MAIN COMPONENT
// ============================================================

export default function StudentRegistrationForm() {
  
  const [classes, setClasses] = useState([])
  const addStudentAPI = `${mainApi}/student/add`
  const getClassAPI = `${mainApi}/classrooms`


  // Change this to false when registration is closed.
  const [regAvailable] = useState(true);

  const [registrationMode, setRegistrationMode] = useState(null);

  const [newStudent, setNewStudent] = useState(emptyStudent);

  // Admission lookup overlay
  const [showAdmissionOverlay, setShowAdmissionOverlay] = useState(false);

  const [admissionSearch, setAdmissionSearch] = useState("");

  const [matchedStudent, setMatchedStudent] = useState(null);

  // Alert overlay
  const [alert, setAlert] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });


    async function getAllClasses(){

    try {
      const res = await axios.get(getClassAPI)
      setClasses(res.data.data)
    } catch (error) {
        setAlert({
           show: true, type: "error", message: error.response.data.msg || "Server/Network Error", title: "Unable to get Classes"
        })

    }
  }
  // ==========================================================
  // UPDATE NESTED STATE
  // ==========================================================

  const updateSection = (section, field, value) => {
    setNewStudent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    localStorage.setItem("student-data", JSON.stringify(newStudent))
  };


  // ==========================================================
  // SEARCH ADMITTED STUDENT
  // ==========================================================

  const searchAdmission = () => {
    const entered = admissionSearch.trim().toUpperCase();
    const found = mockedAdmittedStudents.find(
      (student) =>
        student.admissionNo.toUpperCase() === entered
    );

    if (!found) {
      setMatchedStudent(null);

      setAlert({
        show: true,
        type: "error",
        title: "Student Not Found",
        message:
          "No admitted student was found with the admission number entered.",
      });

      return;
    }

    setMatchedStudent(found);
  };


  // ==========================================================
  // LOAD MOCKED STUDENT INTO NEW STUDENT
  // ==========================================================

  const proceedWithAdmittedStudent = () => {

    if (!matchedStudent) return;

    setNewStudent({
      ...emptyStudent,

      admissionNo: matchedStudent.admissionNo,
      regNo: matchedStudent.regNo,

      personalInfo: {
        ...emptyStudent.personalInfo,

        surname: matchedStudent.surname,
        firstName: matchedStudent.firstName,
        otherName: matchedStudent.otherName,
        gender: matchedStudent.gender,
      },

      academic: {
        ...emptyStudent.academic,

        classOnAdmission:
          matchedStudent.classOnAdmission,

        session:
          matchedStudent.session,
      },
    });

    setRegistrationMode("admitted");

    setShowAdmissionOverlay(false);

    setAdmissionSearch("");

    setMatchedStudent(null);
  };


  // ==========================================================
  // SELECT CLASS
  // ==========================================================

  const handleClassChange = (classId) => {

    const selected = classOptions.find(
      (item) => item.id === classId
    );

    if (!selected) {
      updateSection("academic", "realClassId", "");
      return;
    }

    setNewStudent((prev) => ({
      ...prev,

      academic: {
        ...prev.academic,

        realClassId: selected.id,
        realClass: selected.name,
        realClassArm: selected.arm,
        realDepartment: selected.department,

        // Kept because your schema has these fields too.
        arm: selected.arm,
        department: selected.department,
      },

      realClassNow: {
        classId: selected.id,
        mainClass: selected.name,
        arm: selected.arm,
        department: selected.department,
      },

      realClassId: selected.id,
      realClassArm: selected.arm,
      realDepartment: selected.department,
      realClass: selected.name,
    }));
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const [load, setLoad] = useState(false)
  const handleSubmit = async (e) => {



    const stuData = newStudent;
    stuData.admissionNo = "";
    stuData.regNo = ""
    e.preventDefault();
    setLoad(true)
    console.log(
      "STUDENT REGISTRATION DATA:",
      stuData
    );

    try {
      const res = await axios.post(`${addStudentAPI}?regNo=${JSON.parse(localStorage.getItem("logged-user")).user}`, newStudent)
    setAlert({
      show: true,
      type: "success",
      title: "Student Registration Successful!",
      message:
        "The registration data has been submitted. " + res.data.msg,
    });
    } catch (error) {
      if(error.response){
        setAlert({
          show: true, type: "error", title: "Operation Failed!", message: error.response.data.msg
        })
      }

        setAlert({
          show: true, type: "error", title: "Operation Failed!", message: "Network/Server Error...."
        })
    } finally{
      setLoad(false)
    }

  };



  //get saved student..
  useEffect(() => {
    async function getData(){
      const stu = JSON.parse(localStorage.getItem("student-data"));
      if(stu) setNewStudent(stu)
    }


    getData();
    getAllClasses();
  }, [])
  // ==========================================================
  // REGISTRATION UNAVAILABLE
  // ==========================================================

  if (!regAvailable) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">

        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <SchoolHeader />

          <div className="flex min-h-[500px] items-center justify-center px-6">

            <div className="max-w-md text-center">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50 text-yellow-600">
                <AlertTriangle size={30} />
              </div>

              <h2 className="text-xl font-bold text-gray-800">
                REGISTRATION NOT AVAILABLE AT THE MOMENT
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Student registration is currently unavailable.
                Please check back later or contact the school
                administration for more information.
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }


  // ==========================================================
  // MODE SELECTION
  // ==========================================================

  if (!registrationMode) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">

        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <SchoolHeader />

          <div className="px-5 py-10 sm:px-10">

            <div className="mx-auto max-w-2xl text-center">

              <h2 className="text-xl font-bold text-gray-800">
                Student Registration
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Select the appropriate registration option to continue.
              </p>

            </div>


            <div className="mx-auto mt-8 grid max-w-2xl gap-5 sm:grid-cols-2">

              {/* FRESH */}

              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setNewStudent(emptyStudent);
                  setRegistrationMode("fresh");
                }}
                className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <User size={23} />
                </div>

                <h3 className="font-bold text-gray-800">
                  Fresh Registration
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Register a new student who has not previously
                  been admitted through the school's admission portal.
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
                  Start Registration
                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </div>

              </motion.button>


              {/* ADMITTED */}

              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAdmissionOverlay(true)}
                className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <GraduationCap size={23} />
                </div>

                <h3 className="font-bold text-gray-800">
                  Already Admitted
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Continue registration for a student who has
                  already received admission through the admission portal.
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-green-600">
                  Continue Registration
                  <ArrowRight
                    size={17}
                    className="transition group-hover:translate-x-1"
                  />
                </div>

              </motion.button>

            </div>

          </div>

        </div>


        {/* ADMISSION LOOKUP OVERLAY */}

        <AdmissionOverlay
          show={showAdmissionOverlay}
          admissionSearch={admissionSearch}
          setAdmissionSearch={setAdmissionSearch}
          matchedStudent={matchedStudent}
          onSearch={searchAdmission}
          onProceed={proceedWithAdmittedStudent}
          onCancel={() => {
            setShowAdmissionOverlay(false);
            setAdmissionSearch("");
            setMatchedStudent(null);
          }}
        />


        <AlertOverlay
          alert={alert}
          close={() =>
            setAlert((prev) => ({
              ...prev,
              show: false,
            }))
          }
        />

      </div>
    );
  }



  // ==========================================================
  // FORM
  // ==========================================================

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-6 sm:px-5 sm:py-10">

      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <SchoolHeader />
        
        {/* FORM TOP BAR */}

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:px-8">

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Registration Type
            </p>

            <p className="mt-1 text-sm font-bold text-gray-800">
              {registrationMode === "fresh"
                ? "Fresh Registration"
                : "Already Admitted Student"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRegistrationMode(null)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100"
          >
            <ArrowLeft size={16} />
            Change
          </button>

        </div>


        <form onSubmit={handleSubmit} className="space-y-0">


          {/* ==================================================
              IDENTIFICATION
          ================================================== */}

          {registrationMode === "admitted" && (
            <FormSection>

              <SectionHeader
                icon={CheckCircle}
                title="Admission Information"
                description="Information retrieved from the admission portal."
              />

              <div className="grid gap-5 sm:grid-cols-2">

                <CustomInput
                  label="Admission Number"
                  value={newStudent.admissionNo}
                  disabled
                />

                <CustomInput
                  label="Registration Number"
                  value={newStudent.regNo}
                  disabled
                />

              </div>

            </FormSection>
          )}


          {/* ==================================================
              PERSONAL INFORMATION
          ================================================== */}

          <FormSection>

            <SectionHeader
              icon={User}
              title="Personal Information"
              description="Provide the student's personal details."
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              <CustomInput
                label="Surname"
                value={newStudent.personalInfo.surname}
                onChange={(v) =>
                  updateSection("personalInfo", "surname", v)
                }
                required
              />

              <CustomInput
                label="First Name"
                value={newStudent.personalInfo.firstName}
                onChange={(v) =>
                  updateSection("personalInfo", "firstName", v)
                }
                required
              />

              <CustomInput
                label="Other Name"
                value={newStudent.personalInfo.otherName}
                onChange={(v) =>
                  updateSection("personalInfo", "otherName", v)
                }
              />

              <CustomInput
                label="NIN"
                value={newStudent.personalInfo.nin}
                onChange={(v) =>
                  updateSection("personalInfo", "nin", v)
                }
              />

              <CustomSelect
                label="Gender"
                value={newStudent.personalInfo.gender}
                onChange={(v) =>
                  updateSection("personalInfo", "gender", v)
                }
                options={["Male", "Female"]}
                required
              />

              <CustomDate
                label="Date of Birth"
                value={newStudent.personalInfo.dob}
                onChange={(v) =>
                  updateSection("personalInfo", "dob", v)
                }
                required
              />

              <CustomInput
                label="Religion"
                value={newStudent.personalInfo.religion}
                onChange={(v) =>
                  updateSection("personalInfo", "religion", v)
                }
              />

              <CustomInput
                label="Nationality"
                value={newStudent.personalInfo.nationality}
                onChange={(v) =>
                  updateSection("personalInfo", "nationality", v)
                }
              />

              <CustomInput
                label="State of Origin"
                value={newStudent.personalInfo.stateOfOrigin}
                onChange={(v) =>
                  updateSection("personalInfo", "stateOfOrigin", v)
                }
              />

              <CustomInput
                label="LGA"
                value={newStudent.personalInfo.lga}
                onChange={(v) =>
                  updateSection("personalInfo", "lga", v)
                }
              />

              <div className="sm:col-span-2 lg:col-span-3">

                <CustomInput
                  label="Hobbies"
                  value={newStudent.personalInfo.hobbies}
                  onChange={(v) =>
                    updateSection("personalInfo", "hobbies", v)
                  }
                  placeholder="e.g. Reading, football, music"
                />

              </div>

            </div>

          </FormSection>


          {/* ==================================================
              CONTACT
          ================================================== */}

          <FormSection>

            <SectionHeader
              icon={Phone}
              title="Contact Information"
              description="How the school can contact the student."
            />

            <div className="grid gap-5 sm:grid-cols-2">

              <CustomInput
                label="Phone Number"
                value={newStudent.contact.phone}
                onChange={(v) =>
                  updateSection("contact", "phone", v)
                }
                type="tel"
              />

              <CustomInput
                label="Email Address"
                value={newStudent.contact.email}
                onChange={(v) =>
                  updateSection("contact", "email", v)
                }
                type="email"
              />

              <div className="sm:col-span-2">

                <CustomInput
                  label="Residential Address"
                  value={newStudent.contact.address}
                  onChange={(v) =>
                    updateSection("contact", "address", v)
                  }
                />

              </div>

            </div>

          </FormSection>


          {/* ==================================================
              ACADEMIC
          ================================================== */}

          <FormSection>

            <SectionHeader
              icon={GraduationCap}
              title="Academic Information"
              description="Provide the student's current academic placement."
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              <CustomInput
                label="Class on Admission"
                value={newStudent.academic.classOnAdmission}
                onChange={(v) =>
                  updateSection(
                    "academic",
                    "classOnAdmission",
                    v
                  )
                }
              />

              <div>

                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Current Class
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <select
                  value={newStudent.academic.currentClass}
                  onChange={(e) => updateSection("academic", "currentClass", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >

                  <option value="">
                    Select Current Class
                  </option>

                  {classes?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.mainClass}
                      ({item.classId})
                    </option>
                  ))}

                </select>

              </div>


              <CustomInput
                label="Arm"
                value={newStudent.academic.realClassArm}
                onChange={(v) =>
                  updateSection(
                    "academic",
                    "realClassArm",
                    v
                  )
                }
              />

              <CustomInput
                label="Department"
                value={newStudent.academic.realDepartment}
                onChange={(v) =>
                  updateSection(
                    "academic",
                    "realDepartment",
                    v
                  )
                }
              />

              <CustomInput
                label="Session"
                value={newStudent.academic.session}
                onChange={(v) =>
                  updateSection(
                    "academic",
                    "session",
                    v
                  )
                }
                required
              />

              <CustomSelect
                label="Term"
                value={newStudent.academic.term}
                onChange={(v) =>
                  updateSection(
                    "academic",
                    "term",
                    v
                  )
                }
                options={["First", "Second", "Third"]}
                required
              />

              <CustomDate
                label="Date Admitted"
                value={newStudent.dateAdmitted}
                onChange={(v) =>
                  setNewStudent((prev) => ({
                    ...prev,
                    dateAdmitted: v,
                  }))
                }
              />

              <CustomInput
                label="Club / House"
                value={newStudent.club_house}
                onChange={(v) =>
                  setNewStudent((prev) => ({
                    ...prev,
                    club_house: v,
                  }))
                }
              />

            </div>

          </FormSection>


          {/* ==================================================
              PREVIOUS SCHOOL
          ================================================== */}

          <FormSection>

            <SectionHeader
              icon={School}
              title="Previous School"
              description="Information about the student's previous school."
            />

            <div className="grid gap-5 sm:grid-cols-3">

              <CustomInput
                label="School Name"
                value={newStudent.previousSchools.schoolName}
                onChange={(v) =>
                  updateSection(
                    "previousSchools",
                    "schoolName",
                    v
                  )
                }
              />

              <CustomInput
                label="From"
                value={newStudent.previousSchools.from}
                onChange={(v) =>
                  updateSection(
                    "previousSchools",
                    "from",
                    v
                  )
                }
                placeholder="e.g. 2022"
              />

              <CustomInput
                label="Till"
                value={newStudent.previousSchools.till}
                onChange={(v) =>
                  updateSection(
                    "previousSchools",
                    "till",
                    v
                  )
                }
                placeholder="e.g. 2026"
              />

            </div>

          </FormSection>


          {/* ==================================================
              GUARDIAN
          ================================================== */}

          <FormSection>

            <SectionHeader
              icon={Users}
              title="Parent / Guardian"
              description="Provide the details of the student's parent or guardian."
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              <CustomInput
                label="Full Name"
                value={newStudent.guardians.name}
                onChange={(v) =>
                  updateSection(
                    "guardians",
                    "name",
                    v
                  )
                }
                required
              />

              <CustomInput
                label="Relationship"
                value={newStudent.guardians.relationship}
                onChange={(v) =>
                  updateSection(
                    "guardians",
                    "relationship",
                    v
                  )
                }
              />

              <CustomInput
                label="Phone Number"
                value={newStudent.guardians.phone}
                onChange={(v) =>
                  updateSection(
                    "guardians",
                    "phone",
                    v
                  )
                }
                type="tel"
              />

              <CustomInput
                label="Email"
                value={newStudent.guardians.email}
                onChange={(v) =>
                  updateSection(
                    "guardians",
                    "email",
                    v
                  )
                }
                type="email"
              />

              <CustomInput
                label="Occupation"
                value={newStudent.guardians.occupation}
                onChange={(v) =>
                  updateSection(
                    "guardians",
                    "occupation",
                    v
                  )
                }
              />

              <CustomInput
                label="Address"
                value={newStudent.guardians.address}
                onChange={(v) =>
                  updateSection(
                    "guardians",
                    "address",
                    v
                  )
                }
              />

oa            </div>

          </FormSection>


          {/* ==================================================
              MEDICAL
          ================================================== */}

          <FormSection>

            <SectionHeader
              icon={HeartPulse}
              title="Medical Information"
              description="Provide relevant medical information."
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              <CustomSelect
                label="Blood Group"
                value={newStudent.medical.bloodGroup}
                onChange={(v) =>
                  updateSection(
                    "medical",
                    "bloodGroup",
                    v
                  )
                }
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

              <CustomSelect
                label="Genotype"
                value={newStudent.medical.genotype}
                onChange={(v) =>
                  updateSection(
                    "medical",
                    "genotype",
                    v
                  )
                }
                options={[
                  "AA",
                  "AS",
                  "SS",
                  "AC",
                  "SC",
                ]}
              />

              <CustomInput
                label="Allergies"
                value={newStudent.medical.allergies}
                onChange={(v) =>
                  updateSection(
                    "medical",
                    "allergies",
                    v
                  )
                }
              />

              <CustomInput
                label="Disability"
                value={newStudent.medical.disability}
                onChange={(v) =>
                  updateSection(
                    "medical",
                    "disability",
                    v
                  )
                }
              />

              <div className="sm:col-span-2">

                <CustomInput
                  label="Other Medical Issues"
                  value={newStudent.medical.otherIssues}
                  onChange={(v) =>
                    updateSection(
                      "medical",
                      "otherIssues",
                      v
                    )
                  }
                />

              </div>

            </div>

          </FormSection>


          {/* ==================================================
              REAL CONTACT
          ================================================== */}

          <FormSection>

            <SectionHeader
              icon={Phone}
              title="Student / Guardian Contact Details"
              description="Additional contact channels."
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              <CustomInput
                label="Guardian Email"
                value={newStudent.realContact.guardianMail}
                onChange={(v) =>
                  updateSection(
                    "realContact",
                    "guardianMail",
                    v
                  )
                }
                type="email"
              />

              <CustomInput
                label="Student Email"
                value={newStudent.realContact.studentMail}
                onChange={(v) =>
                  updateSection(
                    "realContact",
                    "studentMail",
                    v
                  )
                }
                type="email"
              />

              <CustomInput
                label="Guardian Phone"
                value={newStudent.realContact.guardianTel}
                onChange={(v) =>
                  updateSection(
                    "realContact",
                    "guardianTel",
                    v
                  )
                }
                type="tel"
              />

              <CustomInput
                label="Student Phone"
                value={newStudent.realContact.studentTel}
                onChange={(v) =>
                  updateSection(
                    "realContact",
                    "studentTel",
                    v
                  )
                }
                type="tel"
              />

            </div>

          </FormSection>


          {/* ==================================================
              SUBMIT
          ================================================== */}

          <div className="border-t border-gray-100 bg-gray-50 px-5 py-6 sm:px-8">

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Ready to submit?
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Review the information provided before submitting.
                </p>
              </div>

              <button
                type="submit"
                disabled={load}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
              >
                <CheckCircle size={18} />
               {load && "Submitting records..."}   {!load && "Complete Registration"}
              </button>

            </div>

          </div>

        </form>

      </div>


      {/* ALERT */}

      <AlertOverlay
        alert={alert}
        close={() =>
          setAlert((prev) => ({
            ...prev,
            show: false,
          }))
        }
      />

    </div>
  );
}


// ============================================================
// SCHOOL HEADER
// ============================================================

function SchoolHeader() {
  return (
    <div className="border-b border-gray-100 bg-white px-5 py-6 sm:px-8">

      <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:text-left">

        <img
          src="/crest.png"
          alt="School Crest"
          className="h-16 w-16 object-contain"
        />

        <div>

          <h1 className="text-lg font-extrabold uppercase tracking-wide text-gray-800 sm:text-xl">
            Achievers International Schools
          </h1>

          <p className="mt-1 text-sm font-semibold tracking-wider text-blue-600">
            STUDENT REGISTRATION FORM
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Excellence, Discipline & Leadership
          </p>

        </div>

      </div>

    </div>
  );
}


// ============================================================
// FORM SECTION WRAPPER
// ============================================================

function FormSection({ children }) {
  return (
    <div className="border-b border-gray-100 px-5 py-7 sm:px-8">
      {children}
    </div>
  );
}


// ============================================================
// ADMISSION OVERLAY
// ============================================================

function AdmissionOverlay({
  show,
  admissionSearch,
  setAdmissionSearch,
  matchedStudent,
  onSearch,
  onProceed,
  onCancel,
}) {
  return (
    <AnimatePresence>

      {show && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm"
        >

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

              <div>

                <h3 className="font-bold text-gray-800">
                  Find Admitted Student
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Enter the admission number issued through
                  the admission portal.
                </p>

              </div>

              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={19} />
              </button>

            </div>


            {/* BODY */}

            <div className="space-y-5 p-5">

              <div>

                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Admission Number
                </label>

                <div className="flex gap-2">

                  <input
                    value={admissionSearch}
                    onChange={(e) =>
                      setAdmissionSearch(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onSearch();
                      }
                    }}
                    placeholder="e.g. ADM/2026/001"
                    className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={onSearch}
                    className="flex items-center justify-center rounded-xl bg-blue-600 px-4 text-white transition hover:bg-blue-700"
                  >
                    <Search size={18} />
                  </button>

                </div>

              </div>


              {/* MATCHED STUDENT */}

              <AnimatePresence>

                {matchedStudent && (

                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >

                    <div className="rounded-xl border border-green-200 bg-green-50 p-4">

                      <div className="mb-3 flex items-center gap-2 text-green-700">

                        <CheckCircle size={18} />

                        <span className="text-sm font-bold">
                          Student Found
                        </span>

                      </div>

                      <div className="space-y-2 text-sm">

                        <p>
                          <span className="text-gray-500">
                            Name:
                          </span>{" "}
                          <strong className="text-gray-800">
                            {matchedStudent.surname}{" "}
                            {matchedStudent.firstName}{" "}
                            {matchedStudent.otherName}
                          </strong>
                        </p>

                        <p>
                          <span className="text-gray-500">
                            Admission No:
                          </span>{" "}
                          <strong className="text-gray-800">
                            {matchedStudent.admissionNo}
                          </strong>
                        </p>

                        <p>
                          <span className="text-gray-500">
                            Registration No:
                          </span>{" "}
                          <strong className="text-gray-800">
                            {matchedStudent.regNo}
                          </strong>
                        </p>

                        <p>
                          <span className="text-gray-500">
                            Class:
                          </span>{" "}
                          <strong className="text-gray-800">
                            {matchedStudent.classOnAdmission}
                          </strong>
                        </p>

                      </div>

                    </div>


                    <div className="mt-4 flex gap-3">

                      <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={onProceed}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        Proceed
                        <ArrowRight size={16} />
                      </button>

                    </div>

                  </motion.div>

                )}

              </AnimatePresence>

            </div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>
  );
}


// ============================================================
// ALERT OVERLAY
// ============================================================

function AlertOverlay({ alert, close }) {
  return (
    <AnimatePresence>

      {alert.show && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
          onClick={close}
        >

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"
          >

            <div
              className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                alert.type === "success"
                  ? "bg-green-50 text-green-600"
                  : alert.type === "error"
                  ? "bg-red-50 text-red-600"
                  : "bg-blue-50 text-blue-600"
              }`}
            >

              {alert.type === "success" ? (
                <CheckCircle size={24} />
              ) : (
                <AlertTriangle size={24} />
              )}

            </div>


            <h3 className="font-bold text-gray-800">
              {alert.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {alert.message}
            </p>


            <button
              type="button"
              onClick={close}
              className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Okay
            </button>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>
  );
}