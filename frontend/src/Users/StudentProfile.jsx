import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiCamera,
  FiUpload,
  FiX,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiBookOpen,
  FiUsers,
  FiHeart,
  FiPrinter,
  FiFileText,
  FiFilePlus,
  FiEdit3,
  FiCheckCircle,
} from "react-icons/fi";

import { QRCodeSVG } from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { mainApi } from "../api";
import axios from "axios";
import { getOptimizedImage, handleImageToUpload } from "../media/media2";
import StudentIDCard from "../components/FileSaver";

const profileAPI = `${mainApi}/student/profile`
const passportAPI = `${mainApi}/student/passport`

const ProfileView = () => {
  const [searchValue, setSearchValue] = useState("");
  const [resMsg, setResMsg] = useState("")
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passportModal, setPassportModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // =========================
  // MOCK STUDENT DATA
  // =========================
  const mockStudent = {
    admissionNo: "AIA/0001",
    regNo: "SCH0004",
    passportUrl: "/User1.jpeg",

    personalInfo: {
      surname: "ADEBAYO",
      firstName: "Daniel",
      otherName: "Temidayo",
      passport: "/User1.jpeg",
      nin: "12345678901",
      gender: "Male",
      dob: "2010-08-15",
      religion: "Christianity",
      nationality: "Nigeria",
      stateOfOrigin: "Oyo",
      lga: "Ibadan North",
      hobbies: "Reading, Football, Coding",
    },

    contact: {
      phone: "08012345678",
      email: "daniel@example.com",
      address: "12 Unity Street, Ibadan, Oyo State",
    },

    academic: {
      classOnAdmission: "JSS 1",
      currentClass: "JSS 3",
      arm: "A",
      department: "Science",
      session: "2025/2026",
      term: "Third",
    },

    dateAdmitted: "2025-09-08",

    previousSchools: {
      schoolName: "Royal Primary School",
      from: "2019",
      till: "2025",
    },

    guardians: {
      name: "Mr. Ade Adebayo",
      relationship: "Father",
      phone: "08098765432",
      email: "parent@example.com",
      occupation: "Engineer",
      address: "12 Unity Street, Ibadan, Oyo State",
    },

    medical: {
      bloodGroup: "O+",
      genotype: "AA",
      allergies: "None",
      disability: "None",
      otherIssues: "None",
    },

    realContact: {
      guardianMail: "parent@example.com",
      studentMail: "daniel@example.com",
      guardianTel: "08098765432",
      studentTel: "08012345678",
    },

    approved: true,
    status: "active",

    realClassNow: {
      classId: "class-003",
      mainClass: "JSS 3",
      arm: "A",
      department: "Science",
    },
  };

  // =========================
  // SEARCH STUDENT
  // =========================

  async function fetchProfile(){
    setLoading(true)
        try {
            const params = new URLSearchParams({
                regNo: searchValue.toUpperCase(),
                admissionNo: searchValue.toUpperCase()
            });

            const res = await axios.get(`${profileAPI}?${params.toString()}`);
           
            setResMsg(res.data.msg)
            const stu = res.data.student
            setStudent(stu)
            stu.mainClass =  res.data.stu_class.mainClass;
        } catch (error) {
            if(error.response){
                alert(error.response.data.msg); 
                setResMsg(error.response.data.msg)
            } else{
                alert("Network or Server error, Try Again!")
            }
        } finally {
          setLoading(false)
        }

  }


  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchValue.trim()) return;
    return fetchProfile()
  };

  // =========================
  // PASSPORT SELECTION
  // =========================
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    const file2 = await handleImageToUpload(file);

    if (!file2) return;

    setSelectedFile(file2);

    // Upload logic will be implemented later
    console.log("Selected passport file:", file2);

    return;
  };

  const [message, setMessage] = useState("");
  const [passLoad, setPassLoad] = useState(false)

  const uploadPassport = async () => {

    setPassLoad(true)
    try {
      //setLoading(true); setMessage("");  setProgress(0);

      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("admissionNo", student.admissionNo);
      formData.append("regNo", student.regNo);

      const { data } = await axios.post(
        passportAPI, formData,
        /*
        {
        onUploadProgress: (event) => { const percent = Math.round((event.loaded * 100) / event.total );
            setProgress(percent);
          }, 
        } */
      );

    //  setImageUrl(data.url);
      setMessage("Image uploaded successfully!");
      return console.log(data)
      setStudent({...student, passportUrl: data.url});
    } catch (err) {
    console.log(err);
    setMessage(
        err.response?.data?.msg ||
          err.response?.data?.error ||
          "Upload failed."
      ); 
    } finally {
      setPassLoad(false)
     setLoading(false);
    }
  }

  const fullName = student
    ? `${student.personalInfo.firstName} ${
        student.personalInfo.otherName || ""
      } ${student.personalInfo.surname}`
        .replace(/\s+/g, " ")
        .trim()
    : ""; 

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const [lay, setLay] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 font-lato">
      {
        //overlay for passport upload
        lay &&
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="relative bg-white p-5 max-w-full max-h-[95vh] overflow-auto">
                <StudentIDCard  
                QRComponent={<StudentQRCode student={student}/> } 
                student={student} schoolCrest={"/crest.png"}/>
    <button
      type="button"
      onClick={() => setLay(false)}
      className="absolute cursor-pointer -right-2 -top-2 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg hover:bg-slate-100"
    >
      <FontAwesomeIcon icon={faXmark} />
    </button>
  </div>
</div>
      }
      
      <div className="mx-auto max-w-7xl">
        {/* =====================================
            PAGE HEADER
        ===================================== */}
        <div className="mb-6">
          <h1 className="font-poppins text-2xl font-bold text-slate-800">
            Student Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Search and view complete student information.
          </p>
        </div>

        {/* =====================================
            SEARCH FORM
        ===================================== */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Enter Student Reg. No or Admission No..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Loading...
                </>
              ) : (
                <>
                  <FiSearch />
                  Load Student
                </>
              )}
            </button>
          </div>

          <div className="p-1 shadow-lg rounded-md bg-amber-100 text-amber-800 my-3 text-center w-fit px-7 text-[9pt] font-poppins">
            {resMsg}
          </div>
        </motion.form>

        {/* =====================================
            INITIAL STATE
        ===================================== */}
        {!student && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white"
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <FiUser className="text-2xl text-slate-400" />
              </div>

              <h3 className="font-poppins font-semibold text-slate-700">
                No Student Loaded
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Enter a registration or admission number above.
              </p>
            </div>
          </motion.div>
        )}

        {/* =====================================
            LOADING STATE
        ===================================== */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="animate-pulse">
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="h-32 w-32 rounded-2xl bg-slate-200" />

                <div className="flex-1 space-y-4">
                  <div className="h-7 w-2/3 rounded bg-slate-200" />
                  <div className="h-4 w-1/3 rounded bg-slate-200" />
                  <div className="h-4 w-1/2 rounded bg-slate-200" />
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="h-20 rounded-xl bg-slate-100"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* =====================================
            STUDENT PROFILE
        ===================================== */}
        <AnimatePresence>
          {student && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* =================================
                  PROFILE HERO
              ================================= */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="h-24 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900" />

                <div className="relative px-5 pb-6 sm:px-7">
                  <div className="-mt-16 flex flex-col gap-5 sm:flex-row sm:items-end">
                    {/* PASSPORT */}
                    <div className="relative">
                      <div className="h-32 w-32 overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-lg">
                        <img
                          src={student.passportUrl}
                          alt={fullName}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <button
                        onClick={() => setPassportModal(true)}
                        className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-md transition hover:bg-blue-700"
                        title="Update passport"
                      >
                        <FiCamera size={15} />
                      </button>
                    </div>

                    {/* NAME */}
                    <div className="flex-1 pb-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-poppins text-2xl font-bold text-slate-800">
                          {fullName}
                        </h2>

                        {student.approved && (
                          <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
                            <FiCheckCircle size={13} />
                            Approved
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                        <span>
                          Admission No:{" "}
                          <strong className="text-slate-700">
                            {student.admissionNo}
                          </strong>
                        </span>

                        <span>
                          Reg. No:{" "}
                          <strong className="text-slate-700">
                            {student.regNo}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {/* STATUS */}
                    <div className="pb-1">
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold capitalize text-blue-600">
                        {student.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================
                  INFORMATION SECTIONS
              ================================= */}
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                {/* PERSONAL INFORMATION */}
                <InfoCard
                  icon={<FiUser />}
                  title="Personal Information"
                >
                  <InfoItem
                    label="Surname"
                    value={student.personalInfo.surname}
                  />
                  <InfoItem
                    label="First Name"
                    value={student.personalInfo.firstName}
                  />
                  <InfoItem
                    label="Other Name"
                    value={student.personalInfo.otherName || "—"}
                  />
                  <InfoItem
                    label="Gender"
                    value={student.personalInfo.gender}
                  />
                  <InfoItem
                    label="Date of Birth"
                    value={formatDate(student.personalInfo.dob)}
                  />
                  <InfoItem
                    label="Nationality"
                    value={student.personalInfo.nationality}
                  />
                  <InfoItem
                    label="State of Origin"
                    value={student.personalInfo.stateOfOrigin}
                  />
                  <InfoItem label="LGA" value={student.personalInfo.lga} />
                </InfoCard>

                {/* ACADEMIC INFORMATION */}
                <InfoCard
                  icon={<FiBookOpen />}
                  title="Academic Information"
                >
                  <InfoItem
                    label="Class on Admission"
                    value={student.academic.classOnAdmission}
                  />
                  <InfoItem
                    label="Current Class"
                    value={student.mainClass && student.mainClass}
                  />
                  <InfoItem label="Arm" value={student.realClassNow.arm} />
                  <InfoItem
                    label="Department"
                    value={student.realClassNow.department}
                  />
                  <InfoItem
                    label="Session"
                    value={student.academic.session}
                  />
                  <InfoItem label="Term" value={student.academic.term} />
                  <InfoItem
                    label="Date Admitted"
                    value={formatDate(student.dateAdmitted)}
                  />
                </InfoCard>

                {/* CONTACT INFORMATION */}
                <InfoCard icon={<FiPhone />} title="Contact Information">
                  <InfoItem
                    label="Phone"
                    value={student.contact.phone}
                    icon={<FiPhone />}
                  />
                  <InfoItem
                    label="Email"
                    value={student.contact.email}
                    icon={<FiMail />}
                  />
                  <InfoItem
                    label="Address"
                    value={student.contact.address}
                    icon={<FiMapPin />}
                    full
                  />
                </InfoCard>

                {/* GUARDIAN INFORMATION */}
                <InfoCard icon={<FiUsers />} title="Parent / Guardian">
                  <InfoItem
                    label="Name"
                    value={student.guardians.name}
                  />
                  <InfoItem
                    label="Relationship"
                    value={student.guardians.relationship}
                  />
                  <InfoItem
                    label="Phone"
                    value={student.guardians.phone}
                  />
                  <InfoItem
                    label="Email"
                    value={student.guardians.email}
                  />
                  <InfoItem
                    label="Occupation"
                    value={student.guardians.occupation}
                  />
                  <InfoItem
                    label="Address"
                    value={student.guardians.address}
                    full
                  />
                </InfoCard>

                {/* MEDICAL */}
                <InfoCard icon={<FiHeart />} title="Medical Information">
                  <InfoItem
                    label="Blood Group"
                    value={student.medical.bloodGroup}
                  />
                  <InfoItem
                    label="Genotype"
                    value={student.medical.genotype}
                  />
                  <InfoItem
                    label="Allergies"
                    value={student.medical.allergies}
                  />
                  <InfoItem
                    label="Disability"
                    value={student.medical.disability}
                  />
                  <InfoItem
                    label="Other Issues"
                    value={student.medical.otherIssues}
                  />
                </InfoCard>

                {/* PREVIOUS SCHOOL */}
                <InfoCard
                  icon={<FiBookOpen />}
                  title="Previous School"
                >
                  <InfoItem
                    label="School"
                    value={student.previousSchools && student.previousSchools.schoolName}
                    full
                  />
                  <InfoItem
                    label="From"
                    value={student.previousSchools && student.previousSchools.from}
                  />
                  <InfoItem
                    label="Till"
                    value={student.previousSchools && student.previousSchools.till}
                  />
                </InfoCard>
              </div>

              {/* =================================
                  ACTION BUTTONS
              ================================= */}
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-4">
                  <h3 className="font-poppins font-semibold text-slate-800">
                    Student Documents & Actions
                  </h3>

                  <p className="text-sm text-slate-500">
                    Generate or update student records.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <ActionButton
                    icon={<FiPrinter />}
                    text="Print ID Card"
                    onClick={() => setLay(true)}
                  />

                  <ActionButton
                    icon={<FiFileText />}
                    text="Print Reg. Slip"
                    onClick={() => console.log("Print Reg. Slip")}
                  />

                  <ActionButton
                    icon={<FiFilePlus />}
                    text="Admission Letter"
                    onClick={() => console.log("Admission Letter")}
                  />

                  <ActionButton
                    icon={<FiEdit3 />}
                    text="Update Profile"
                    primary
                    onClick={() => console.log("Update Profile")}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =====================================
          PASSPORT UPDATE MODAL
      ===================================== */}
      <AnimatePresence>
        {passportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm"
            onClick={() => setPassportModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              {/* MODAL HEADER */}
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-poppins text-lg font-bold text-slate-800">
                    Update Passport
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Select a new passport photograph.
                  </p>
                </div>

                <button
                  onClick={() => setPassportModal(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                >
                  <FiX />
                </button>
              </div>

              {/* CURRENT / SELECTED IMAGE */}
              <div className="mb-5 flex justify-center">
                <div className="h-36 w-36 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <img
                    src={
                      selectedFile
                        ? URL.createObjectURL(selectedFile)
                        : student?.personalInfo.passport
                    }
                    alt="Passport preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* FILE INPUT */}
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50/40">
                <FiUpload className="mb-3 text-2xl text-slate-400" />

                <span className="text-sm font-semibold text-slate-700">
                  Choose passport photograph
                </span>

                <span className="mt-1 text-xs text-slate-400">
                  JPG, JPEG or PNG
                </span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>

              {/* SELECTED FILE */}
              {selectedFile && (
                <div className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">
                  Selected:{" "}
                  <span className="font-semibold">
                    {selectedFile.name}
                  </span>
                </div>
              )}

              {/* UPLOAD BUTTON */}
              <button
                onClick={uploadPassport}
                disabled={passLoad}
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 ${passLoad && 'opacity-1/2' }`}
              >
                <FiUpload />
                {passLoad && "Uploading Passport File..."}
                {!passLoad && "Upload Passport"}
              </button>


{message && (
    <small className="block w-fit mx-auto my-4 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 text-xs font-medium">
        {message}
    </small>
)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ============================================
   INFORMATION CARD
============================================ */

const InfoCard = ({ icon, title, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>

        <h3 className="font-poppins text-sm font-semibold text-slate-800">
          {title}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        {children}
      </div>
    </motion.div>
  );
};

/* ============================================
   INFORMATION ITEM
============================================ */

const InfoItem = ({ label, value, icon, full = false }) => {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </div>

      <p className="break-words text-sm font-medium text-slate-700">
        {value || "—"}
      </p>
    </div>
  );
};

/* ============================================
   ACTION BUTTON
============================================ */

const ActionButton = ({ icon, text, onClick, primary = false }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
        primary
          ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
          : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
      }`}
    >
      {icon}
      {text}
    </button>
  );
};


function StudentQRCode({ student }) {
  if (!student) return null;

  return (
    <QRCodeSVG
      value={student._id || student.admissionNo || student.regNo}
      size={160}
      level="H"
      includeMargin={true}
    />
  );
}

export default ProfileView;