import axios from "axios";
import {useEffect, useState } from "react";
import {
  FiEdit3,
  FiSave,
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiHash,
  FiShield,
} from "react-icons/fi";
import { mainApi } from "../api";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

/* =========================
   MOCK STAFF DATA
========================= */

const mockStaff = {
  staffId: "STF-2026-0042",
  regNo: "RCA/STAFF/024",
  email: "daniel@example.com",
  phone: "08012345678",

  fullname: "Daniel",
  lastname: "Betiku",
  othernames: "Temidayo",
  displayName: "T. Daniel Betiku",

  nin: "12345678901",
  dob: "1999-08-09",
  gender: "Male",

  passportUrl: "/passport.png",
  signature: "/signature.png",

  dateEmployed: "2026-01-15",
  specialization: "Mathematics Education",
  designation: "Mathematics Teacher",

  staffType: "regular",
  staffCategory: "teaching",

  education: [
    {
      qualification: "B.Ed",
      details: "Mathematics Education",
      dateStarted: "2020",
      dateEnded: "2024",
    },
  ],

  docsUploaded: [
    {
      title: "Curriculum Vitae",
      imageUrl: "/documents/cv.pdf",
      docType: "cv",
    },
    {
      title: "Appointment Letter",
      imageUrl: "/documents/appointment.pdf",
      docType: "letter",
    },
  ],

  assignedClass: {
    mainClass: "SS3",
    arm: "A",
    department: "Science",
    classId: "class-ss3-a",
  },

  assignedSubjects: [
    {
      subjectId: {
        subject: "Mathematics",
        abb: "MATH",
      },
    },
  ],

  specialRoles: {
    chiefAdmin: false,
    isAdmin: false,
    canManageStudents: true,
    canManageFinance: false,
    canUploadAssignedResults: true,
    canApproveUser: false,
    canManageAdmission: false,
    isClassTeacher: true,
    isSubjectTeacher: true,
  },
};


/* =========================
   REUSABLE PROFILE INPUT
========================= */

function ProfileInput({
  label,
  name,
  value,
  onChange,
  icon,
  type = "text",
  disabled = false,
  placeholder = "",
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-600">
        {label}
      </label>

      <div
        className={`
          flex items-center gap-3 rounded-xl border px-4 py-3
          transition
          ${
            disabled
              ? "border-slate-200 bg-slate-50"
              : "border-slate-300 bg-white focus-within:border-blue-600"
          }
        `}
      >
        <span className="text-slate-400">
          {icon}
        </span>

        <input
          type={type}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-800 outline-none disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}


/* =========================
   REUSABLE DISPLAY ITEM
========================= */

function ProfileText({
  label,
  value,
  icon,
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-600">
        {label}
      </p>

      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <span className="text-slate-400">
          {icon}
        </span>

        <span className="text-sm text-slate-800">
          {value || "Not provided"}
        </span>
      </div>
    </div>
  );
}


/* =========================
   MAIN COMPONENT
========================= */

export default function StaffParentProfile() {
  //Staff only
  const [isStaff, setIsStaff] = useState(false);
  const navigate = useNavigate();
  const [staff, setStaff] = useState(mockStaff);

  // true = viewing profile
  // false = editing profile
  const [viewMode, setViewMode] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setStaff((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setViewMode(false);
  };

  const handleCancel = () => {
    // For now, simply return to view mode.
    // Later we'll preserve the original data and restore it here.
    setViewMode(true);
  };

  const handleSave = () => {
    console.log("Updated staff:", staff);

    // Later:
    // await axios.patch(`${mainApi}/staff/profile/${staff.staffId}`, staff)

    setViewMode(true);
  };

  async function getStaff(){
    const savedUser = JSON.parse(localStorage.getItem("logged-user"));
    const staffIsStaff = savedUser.role === "staff" 
    || savedUser.role === "admin2" 
    || savedUser.role === "admin"
    || savedUser.role === "chief-admin"
    setIsStaff(staffIsStaff);

  if(!staffIsStaff){
    return  navigate("/app/user/parent-student")
  }

    try {
      const res = await axios.get(`${mainApi}/user/profile/${savedUser.id}`);
      setStaff(res.data.staff);
      console.log("Fetched staff profile:", res.data.staff);
      alert(res.data.msg || "Staff profile loaded successfully!");
    } catch (error) {
      if(error.response && error.response.status === 404){
        alert("Staff profile not found.");
        navigate("/app/user");
      } else {
        console.error(error);
        alert("An error occurred while fetching staff profile.");
        navigate("/app/user")
      }
    }
  }


  useEffect(() => {
    getStaff();
  }, []);

const [mediaUploader, setMediaUploader] = useState(false);
return (
  <div className="min-h-screen bg-slate-100 p-4 md:p-6 lg:p-8">

    {staff && isStaff && mediaUploader && 
    <StaffMediaUploader user={staff}
     onClose={() => setMediaUploader(false)} />}
    <div className="mx-auto max-w-6xl">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Staff Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage your staff information
          </p>
        </div>


        {/* ACTION BUTTONS */}

        {viewMode ? (
          <button
            type="button"
            onClick={handleEdit}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            <FiEdit3 />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">

            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <FiX />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <FiSave />
              Save Changes
            </button>

          </div>
        )}

<button
  type="button"
  onClick={() => setMediaUploader(true)}
  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
>
  ADD PASSPORT AND SIGNATURE
</button>
      </div>


      {/* =========================
          PROFILE HEADER CARD
      ========================= */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* TOP PROFILE AREA */}

        <div className="bg-gradient-to-r from-slate-900 to-blue-900 p-6 md:p-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

            {/* PASSPORT */}

            <div className="relative shrink-0">

              {staff?.passportUrl ? (
                <img
                  src={staff.passportUrl}
                  alt={staff?.displayName || "Staff"}
                  className="h-28 w-28 rounded-2xl border-4 border-white/20 object-cover shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = "/passport.png";
                  }}
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white/20 bg-white/10 text-3xl font-bold text-white">
                  <FiUser />
                </div>
              )}

              {!viewMode && (
                <button
                  type="button"
                  className="absolute bottom-1 right-1 rounded-full bg-white p-2 text-slate-700 shadow"
                  title="Change passport"
                >
                  <FiEdit3 size={14} />
                </button>
              )}

            </div>


            {/* STAFF BASIC DETAILS */}

            <div className="flex-1 text-white">

              <div className="flex flex-wrap items-center gap-2">

                <h2 className="text-2xl font-bold">
                  {staff?.displayName ||
                    `${staff?.fullname || ""} ${staff?.lastname || ""}`}
                </h2>

                {staff?.staffType && (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium capitalize">
                    {staff.staffType}
                  </span>
                )}

                {staff?.staffCategory && (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium capitalize">
                    {staff.staffCategory}
                  </span>
                )}

              </div>

              {staff?.designation && (
                <p className="mt-1 text-sm text-blue-100">
                  {staff.designation}
                </p>
              )}


              <div className="mt-4 flex flex-wrap gap-3">

                {staff?.staffId && (
                  <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs">
                    <FiHash />
                    {staff.staffId}
                  </div>
                )}

                {staff?.regNo && (
                  <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs">
                    <FiHash />
                    {staff.regNo}
                  </div>
                )}

                {staff?.staffCategory && (
                  <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs capitalize">
                    <FiBriefcase />
                    {staff.staffCategory}
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>


        {/* =========================
            BASIC INFORMATION
        ========================= */}

        <div className="p-6 md:p-8">

          <div className="mb-6">

            <h3 className="text-lg font-bold text-slate-900">
              Basic Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your basic staff identity and contact information
            </p>

          </div>


          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {/* NON EDITABLE */}

            {staff?.staffId && (
              <ProfileText
                label="Staff ID"
                value={staff.staffId}
                icon={<FiHash />}
              />
            )}

            {staff?.regNo && (
              <ProfileText
                label="Registration Number"
                value={staff.regNo}
                icon={<FiHash />}
              />
            )}


            {/* EDITABLE */}

            {viewMode ? (
              <>
                {staff?.fullname && (
                  <ProfileText
                    label="Full Name"
                    value={staff.fullname}
                    icon={<FiUser />}
                  />
                )}

                {staff?.lastname && (
                  <ProfileText
                    label="Last Name"
                    value={staff.lastname}
                    icon={<FiUser />}
                  />
                )}

                {staff?.othernames && (
                  <ProfileText
                    label="Other Names"
                    value={staff.othernames}
                    icon={<FiUser />}
                  />
                )}

                {staff?.displayName && (
                  <ProfileText
                    label="Display Name"
                    value={staff.displayName}
                    icon={<FiUser />}
                  />
                )}

                {staff?.email && (
                  <ProfileText
                    label="Email Address"
                    value={staff.email}
                    icon={<FiMail />}
                  />
                )}

                {staff?.phone && (
                  <ProfileText
                    label="Phone Number"
                    value={staff.phone}
                    icon={<FiPhone />}
                  />
                )}

                {staff?.gender && (
                  <ProfileText
                    label="Gender"
                    value={staff.gender}
                    icon={<FiUser />}
                  />
                )}

                {staff?.dob && (
                  <ProfileText
                    label="Date of Birth"
                    value={staff.dob}
                    icon={<FiUser />}
                  />
                )}

                {staff?.nin && (
                  <ProfileText
                    label="NIN"
                    value={staff.nin}
                    icon={<FiHash />}
                  />
                )}

                {staff?.dateEmployed && (
                  <ProfileText
                    label="Date Employed"
                    value={staff.dateEmployed}
                    icon={<FiBriefcase />}
                  />
                )}

                {staff?.staffType && (
                  <ProfileText
                    label="Staff Type"
                    value={staff.staffType}
                    icon={<FiBriefcase />}
                  />
                )}

                {staff?.staffCategory && (
                  <ProfileText
                    label="Staff Category"
                    value={staff.staffCategory}
                    icon={<FiBriefcase />}
                  />
                )}

                {staff?.specialization && (
                  <ProfileText
                    label="Specialization"
                    value={staff.specialization}
                    icon={<FiBriefcase />}
                  />
                )}

                {staff?.designation && (
                  <ProfileText
                    label="Designation"
                    value={staff.designation}
                    icon={<FiBriefcase />}
                  />
                )}
              </>
            ) : (
              <>
                {staff?.fullname !== undefined && (
                  <ProfileInput
                    label="Full Name"
                    name="fullname"
                    value={staff?.fullname}
                    onChange={handleChange}
                    icon={<FiUser />}
                  />
                )}

                {staff?.lastname !== undefined && (
                  <ProfileInput
                    label="Last Name"
                    name="lastname"
                    value={staff?.lastname}
                    onChange={handleChange}
                    icon={<FiUser />}
                  />
                )}

                {staff?.othernames !== undefined && (
                  <ProfileInput
                    label="Other Names"
                    name="othernames"
                    value={staff?.othernames}
                    onChange={handleChange}
                    icon={<FiUser />}
                  />
                )}

                {staff?.displayName !== undefined && (
                  <ProfileInput
                    label="Display Name"
                    name="displayName"
                    value={staff?.displayName}
                    onChange={handleChange}
                    icon={<FiUser />}
                  />
                )}

                {staff?.email !== undefined && (
                  <ProfileInput
                    label="Email Address"
                    name="email"
                    value={staff?.email}
                    onChange={handleChange}
                    icon={<FiMail />}
                    type="email"
                  />
                )}

                {staff?.phone !== undefined && (
                  <ProfileInput
                    label="Phone Number"
                    name="phone"
                    value={staff?.phone}
                    onChange={handleChange}
                    icon={<FiPhone />}
                  />
                )}

                {staff?.gender !== undefined && (
                  <ProfileInput
                    label="Gender"
                    name="gender"
                    value={staff?.gender}
                    onChange={handleChange}
                    icon={<FiUser />}
                  />
                )}

                {staff?.dob !== undefined && (
                  <ProfileInput
                    label="Date of Birth"
                    name="dob"
                    value={staff?.dob}
                    onChange={handleChange}
                    icon={<FiUser />}
                    type="date"
                  />
                )}

                {staff?.nin !== undefined && (
                  <ProfileInput
                    label="NIN"
                    name="nin"
                    value={staff?.nin}
                    onChange={handleChange}
                    icon={<FiHash />}
                  />
                )}

                {staff?.dateEmployed !== undefined && (
                  <ProfileInput
                    label="Date Employed"
                    name="dateEmployed"
                    value={staff?.dateEmployed}
                    onChange={handleChange}
                    icon={<FiBriefcase />}
                    type="date"
                  />
                )}

                {staff?.staffType !== undefined && (
                  <ProfileInput
                    label="Staff Type"
                    name="staffType"
                    value={staff?.staffType}
                    onChange={handleChange}
                    icon={<FiBriefcase />}
                  />
                )}

                {staff?.staffCategory !== undefined && (
                  <ProfileInput
                    label="Staff Category"
                    name="staffCategory"
                    value={staff?.staffCategory}
                    onChange={handleChange}
                    icon={<FiBriefcase />}
                  />
                )}

                {staff?.specialization !== undefined && (
                  <ProfileInput
                    label="Specialization"
                    name="specialization"
                    value={staff?.specialization}
                    onChange={handleChange}
                    icon={<FiBriefcase />}
                  />
                )}

                {staff?.designation !== undefined && (
                  <ProfileInput
                    label="Designation"
                    name="designation"
                    value={staff?.designation}
                    onChange={handleChange}
                    icon={<FiBriefcase />}
                  />
                )}
              </>
            )}

          </div>


          {/* =========================
              EDUCATION
          ========================= */}

          {staff?.education?.length > 0 && (
            <div className="mt-10">

              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900">
                  Education & Qualifications
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Academic qualifications and educational background
                </p>
              </div>

              <div className="space-y-4">

                {staff.education.map((edu, index) => (
                  <div
                    key={edu?._id || index}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                  >

                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                      {edu?.qualification && (
                        <ProfileText
                          label="Qualification"
                          value={edu.qualification}
                          icon={<FiUser />}
                        />
                      )}

                      {edu?.details && (
                        <ProfileText
                          label="Institution / Details"
                          value={edu.details}
                          icon={<FiUser />}
                        />
                      )}

                      {edu?.specialization && (
                        <ProfileText
                          label="Specialization"
                          value={edu.specialization}
                          icon={<FiBriefcase />}
                        />
                      )}

                      {edu?.dateStarted && (
                        <ProfileText
                          label="Date Started"
                          value={edu.dateStarted}
                          icon={<FiBriefcase />}
                        />
                      )}

                      {edu?.dateEnded && (
                        <ProfileText
                          label="Date Ended"
                          value={edu.dateEnded}
                          icon={<FiBriefcase />}
                        />
                      )}

                    </div>

                  </div>
                ))}

              </div>

            </div>
          )}


          {/* =========================
              ASSIGNED SUBJECTS
          ========================= */}

          {staff?.assignedSubjects?.length > 0 && (
            <div className="mt-10">

              <div className="mb-6">

                <h3 className="text-lg font-bold text-slate-900">
                  Assigned Subjects
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Subjects currently assigned to this staff
                </p>

              </div>

              <div className="flex flex-wrap gap-3">

                {staff.assignedSubjects.map((subject, index) => (
                  <div
                    key={subject?._id || index}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    {typeof subject === "string"
                      ? subject
                      : subject?.subject ||
                        subject?.name ||
                        subject?.title ||
                        "Assigned Subject"}
                  </div>
                ))}

              </div>

            </div>
          )}


          {/* =========================
              SIGNATURE
          ========================= */}

          {staff?.signature && (
            <div className="mt-10">

              <div className="mb-6">

                <h3 className="text-lg font-bold text-slate-900">
                  Signature
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Staff signature
                </p>

              </div>

              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-4">

                <img
                  src={staff.signature}
                  alt="Staff Signature"
                  className="h-20 max-w-[220px] object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

              </div>

            </div>
          )}


          {/* =========================
              UPLOADED DOCUMENTS
          ========================= */}

          {staff?.docsUploaded?.length > 0 && (
            <div className="mt-10">

              <div className="mb-6">

                <h3 className="text-lg font-bold text-slate-900">
                  Uploaded Documents
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Documents attached to this staff profile
                </p>

              </div>

              <div className="grid gap-4 md:grid-cols-2">

                {staff.docsUploaded.map((doc, index) => (
                  <div
                    key={doc?._id || index}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >

                    <div className="flex items-center justify-between gap-4">

                      <div>

                        {doc?.title && (
                          <h4 className="font-semibold text-slate-900">
                            {doc.title}
                          </h4>
                        )}

                        {doc?.docType && (
                          <p className="mt-1 text-xs capitalize text-slate-500">
                            {doc.docType}
                          </p>
                        )}

                      </div>

                      {doc?.imageUrl && (
                        <a
                          href={doc.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-800"
                        >
                          View
                        </a>
                      )}

                    </div>

                  </div>
                ))}

              </div>

            </div>
          )}


          {/* =========================
              RECORD INFORMATION
          ========================= */}

          {(staff?.createdAt || staff?.updatedAt) && (
            <div className="mt-10 border-t border-slate-200 pt-6">

              <div className="grid gap-5 md:grid-cols-2">

                {staff?.createdAt && (
                  <ProfileText
                    label="Profile Created"
                    value={new Date(staff.createdAt).toLocaleString()}
                    icon={<FiBriefcase />}
                  />
                )}

                {staff?.updatedAt && (
                  <ProfileText
                    label="Last Updated"
                    value={new Date(staff.updatedAt).toLocaleString()}
                    icon={<FiBriefcase />}
                  />
                )}

              </div>

            </div>
          )}

        </div>

      </section>

    </div>

  </div>
);
}





const StaffMediaUploader = ({ user, onClose }) => {
  const [passport, setPassport] = useState(null);
  const [signature, setSignature] = useState(null);

  const [passportPreview, setPassportPreview] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // HANDLE PASSPORT
  // =========================

  const handlePassportChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");
    setMessage("");

    // Only images
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setPassport(file);

    const previewUrl = URL.createObjectURL(file);
    setPassportPreview(previewUrl);
  };


  // =========================
  // HANDLE SIGNATURE
  // =========================

  const handleSignatureChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");
    setMessage("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setSignature(file);

    const previewUrl = URL.createObjectURL(file);
    setSignaturePreview(previewUrl);
  };


  // =========================
  // UPLOAD
  // =========================

  const handleUpload = async () => {
    setError("");
    setMessage("");

    if (!user?._id) {
      setError("Staff information is missing.");
      return;
    }

    if (!passport) {
      setError("Please select a passport.");
      return;
    }

    if (!signature) {
      setError("Please select a signature.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("passport", passport);
      formData.append("signature", signature);

      console.log("FormData to be sent:", formData);
      const response = await axios.post(
        `${mainApi}/user/staff/add-media/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.success) {
        setMessage(
          response.data?.msg ||
            "Passport and signature uploaded successfully."
        );

        // Clear selected files after successful upload
        setPassport(null);
        setSignature(null);
        setPassportPreview(null);
        setSignaturePreview(null);
      } else {
        setError(
          response.data?.msg ||
            "Upload failed. Please try again."
        );
      }

    } catch (err) {
      console.error("Staff media upload error:", err);

      setError(
        err.response?.data?.msg ||
          "Unable to upload passport and signature."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      {/* =========================
          OVERLAY CARD
      ========================= */}

      <div className="relative max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* CLOSE */}

        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-red-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          title="Close"
        >
          <FaTimes />
        </button>


        {/* =========================
            HEADER
        ========================= */}

        <div className="border-b border-slate-200 p-6 pr-16">
          <h4>{user?.fullname}</h4>
          <h2 className="text-xl font-bold text-slate-900">
            Add Passport & Signature
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Upload a passport photograph and staff signature.
          </p>

        </div>


        {/* =========================
            BODY
        ========================= */}

        <div className="space-y-6 p-6">


          {/* =========================
              PASSPORT
          ========================= */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Passport Photograph
            </label>

            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">

              {passportPreview ? (
                <div className="flex flex-col items-center">

                  <img
                    src={passportPreview}
                    alt="Passport preview"
                    className="h-40 w-40 rounded-xl border border-slate-200 object-cover shadow-sm"
                  />

                  <p className="mt-3 max-w-full truncate text-xs text-slate-500">
                    {passport?.name}
                  </p>

                  <label className="mt-3 cursor-pointer rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-900">
                    Change Passport

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePassportChange}
                      className="hidden"
                    />
                  </label>

                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center py-8">

                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                    +
                  </div>

                  <p className="text-sm font-semibold text-slate-700">
                    Select Passport
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    JPG, PNG, WEBP
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePassportChange}
                    className="hidden"
                  />

                </label>
              )}

            </div>

          </div>


          {/* =========================
              SIGNATURE
          ========================= */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Signature
            </label>

            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">

              {signaturePreview ? (
                <div className="flex flex-col items-center">

                  <div className="flex h-32 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">

                    <img
                      src={signaturePreview}
                      alt="Signature preview"
                      className="max-h-full max-w-full object-contain"
                    />

                  </div>

                  <p className="mt-3 max-w-full truncate text-xs text-slate-500">
                    {signature?.name}
                  </p>

                  <label className="mt-3 cursor-pointer rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-900">
                    Change Signature

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureChange}
                      className="hidden"
                    />
                  </label>

                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center py-8">

                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700">
                    +
                  </div>

                  <p className="text-sm font-semibold text-slate-700">
                    Select Signature
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    JPG, PNG, WEBP
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureChange}
                    className="hidden"
                  />

                </label>
              )}

            </div>

          </div>


          {/* =========================
              ERROR
          ========================= */}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}


          {/* =========================
              SUCCESS
          ========================= */}

          {message && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {message}
            </div>
          )}


          {/* =========================
              UPLOAD BUTTON
          ========================= */}

          <button
            type="button"
            onClick={handleUpload}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Uploading...
              </>
            ) : (
              "Upload Passport & Signature"
            )}

          </button>

        </div>

      </div>

    </div>
  );
};