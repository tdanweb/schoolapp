import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { mainApi } from "../api";

export function ParentStudentProfile() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [thisUser, setThisUser] = useState("");



    async function getProfile(){

        const user = JSON.parse(localStorage.getItem("logged-user"));

   //     if(user.role !== "student" || user.role !== "parent"){    navigate("/app/user")     }


        //getting the user profile from the backend
        try {
        const getUser = await axios.get(`${mainApi}/user/profile-view/${user.id}`, {
            headers: {
                "Authorization": `Bearer ${user.token}`
            }
        });
      //  alert(getUser.data.msg);
        setThisUser(getUser.data.user.thisUser);
        setUser(getUser.data.studentProfile || getUser.data.parentProfile);
    
        } catch (error) {
            console.error("Error fetching user profile:", error);
            if (error.response && error.response.status === 401) {  
                // alert(error.response.data.msg);
            } else {
                // alert("Network error. Please try again later.");   
            }
        }
    }


    useEffect(() => {
        getProfile();
    }, []);
    return<>
     <div>
        <p>Profile View</p>
        {thisUser === "student" && <StudentProfile studentProfile={user} />}
     </div>
    </>
}



import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaGraduationCap,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUsers,
  FaHeartbeat,
  FaEdit,
  FaSave,
  FaTimes,
  FaLock,
  FaKey,
  FaCalendarAlt,
  FaIdCard,
  FaHome,
  FaBriefcase,
  FaChevronDown,
} from "react-icons/fa";

/*
|--------------------------------------------------------------------------
| CLOUDINARY IMAGE OPTIMIZATION
|--------------------------------------------------------------------------
| Converts:
| https://res.cloudinary.com/.../image/upload/v123/folder/image.jpg
|
| Into a smaller optimized image:
| /image/upload/f_auto,q_auto,w_300/...
|--------------------------------------------------------------------------
*/

const optimizeCloudinaryImage = (url, width = 300) => {
  if (!url || !url.includes("res.cloudinary.com")) {
    return url;
  }

  return url.replace(
    "/image/upload/",
    `/image/upload/f_auto,q_auto,w_${width}/`
  );
};

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const displayValue = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  return value;
};

/*
|--------------------------------------------------------------------------
| Editable fields
|--------------------------------------------------------------------------
|
| These are intentionally limited to basic, non-sensitive information.
|
*/

const EDITABLE_FIELDS = [
  {
    key: "club_house",
    label: "Club / House",
    type: "text",
  },

  {
    key: "hobbies",
    label: "Hobbies",
    type: "text",
  },

  {
    key: "address",
    label: "Address",
    type: "text",
  },
];

/*
|--------------------------------------------------------------------------
| Main Component
|--------------------------------------------------------------------------
*/

function StudentProfile({ studentProfile = null }) {

  const [editMode, setEditMode] = useState(false);

  const [editValues, setEditValues] = useState({});

  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /*
  |--------------------------------------------------------------------------
  | Initial editable values
  |--------------------------------------------------------------------------
  */

  const initialEditableValues = useMemo(() => {
    if (!studentProfile) return {};

    return {
      club_house: studentProfile.club_house || "",
      hobbies:
        studentProfile.personalInfo?.hobbies ||
        studentProfile.hobbies ||
        "",
      address:
        studentProfile.contact?.address || "",
    };
  }, [studentProfile]);

  /*
  |--------------------------------------------------------------------------
  | No profile yet
  |--------------------------------------------------------------------------
  */

  if (!studentProfile) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <FaUser className="text-2xl text-slate-400" />
          </div>

          <h2 className="text-lg font-semibold text-slate-700">
            Student profile unavailable
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Your profile information could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Data
  |--------------------------------------------------------------------------
  */

  const {
    personalInfo = {},
    academic = {},
    contact = {},
    guardians = {},
    medical = {},
    currentFee = [],
  } = studentProfile;

  const passport =
    studentProfile.passportUrl ||
    personalInfo.passport ||
    "";

  const optimizedPassport = optimizeCloudinaryImage(
    passport,
    300
  );

  /*
  |--------------------------------------------------------------------------
  | Start editing
  |--------------------------------------------------------------------------
  */

  const handleStartEdit = () => {
    setEditValues(initialEditableValues);
    setEditMode(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Update field
  |--------------------------------------------------------------------------
  */

  const handleEditChange = (key, value) => {
    setEditValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Save edits
  |--------------------------------------------------------------------------
  |
  | Only changed editable fields are returned.
  |
  */

  const handleSaveEdits = () => {
    const updatedData = {};

    EDITABLE_FIELDS.forEach(({ key }) => {
      const originalValue =
        initialEditableValues[key] || "";

      const newValue =
        editValues[key] || "";

      if (newValue !== originalValue) {
        updatedData[key] = newValue;
      }
    });

    console.log("Student profile update:", updatedData);

    /*
      Example result:

      {
        club_house: "Sports/Red",
        hobbies: "Reading, Football",
        address: "Ibadan"
      }

      Only changed fields are included.
    */

    setEditMode(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Cancel edit
  |--------------------------------------------------------------------------
  */

  const handleCancelEdit = () => {
    setEditValues({});
    setEditMode(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Password
  |--------------------------------------------------------------------------
  */

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (
      !passwords.oldPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      console.log("All password fields are required");
      return;
    }

    if (
      passwords.newPassword !==
      passwords.confirmPassword
    ) {
      console.log("New passwords do not match");
      return;
    }

    console.log("Password change request:", {
      oldPassword: passwords.oldPassword,
      newPassword: passwords.newPassword,
    });

    setPasswords({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowPasswordModal(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Reusable section
  |--------------------------------------------------------------------------
  */

  const Section = ({
    icon,
    title,
    children,
  }) => (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
          {icon}
        </div>

        <h3 className="font-semibold text-slate-800">
          {title}
        </h3>
      </div>

      <div className="p-5">
        {children}
      </div>
    </section>
  );

  /*
  |--------------------------------------------------------------------------
  | Field
  |--------------------------------------------------------------------------
  */

  const Field = ({
    label,
    value,
    icon,
    sensitive = false,
  }) => (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">
        {label}
      </p>

      <div className="flex items-center gap-2 text-sm text-slate-700">
        {icon && (
          <span className="text-slate-400">
            {icon}
          </span>
        )}

        <span>
          {sensitive
            ? "••••••••"
            : displayValue(value)}
        </span>
      </div>
    </div>
  );

  /*
  |--------------------------------------------------------------------------
  | Editable Field
  |--------------------------------------------------------------------------
  */

  const EditableField = ({
    field,
  }) => {
    const value =
      editValues[field.key] ?? "";

    return (
      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">
          {field.label}
        </label>

        <input
          type={field.type}
          value={value}
          onChange={(e) =>
            handleEditChange(
              field.key,
              e.target.value
            )
          }
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-700 transition"
        />
      </div>
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        {/* ================================================================
            SCHOOL HEADER
        ================================================================= */}

        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src="/crest.jpg"
                  alt="School Crest"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl bg-white p-1"
                />

                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                    Achievers International Schools
                  </h1>

                  <p className="text-sm text-blue-200 mt-1">
                    For Outstanding Success with Discipline
                  </p>
                </div>
              </div>

              <div className="hidden sm:block text-right">
                <p className="text-xs text-blue-200 uppercase tracking-wider">
                  Student Portal
                </p>

                <p className="font-semibold">
                  My Profile
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================
            PROFILE HERO
        ================================================================= */}

        <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-4">
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
            <div className="p-5 sm:p-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-center gap-5">
                  {/* Passport */}

                  <div className="relative shrink-0">
                    {optimizedPassport ? (
                      <img
                        src={optimizedPassport}
                        alt={personalInfo.firstName || "Student"}
                        className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl border-4 border-white shadow-md bg-slate-100"
                      />
                    ) : (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <FaUser className="text-4xl text-slate-300" />
                      </div>
                    )}

                    <span className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase shadow">
                      Active
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {displayValue(
                        `${personalInfo.firstName || ""} ${
                          personalInfo.otherName || ""
                        } ${
                          personalInfo.surname || ""
                        }`.trim()
                      )}
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <FaIdCard />
                        {displayValue(
                          studentProfile.regNo
                        )}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <FaIdCard />
                        {displayValue(
                          studentProfile.admissionNo
                        )}
                      </span>
                    </div>

                    <p className="text-sm text-blue-700 font-medium mt-2">
                      {displayValue(
                        studentProfile.realClassNow
                          ?.mainClass ||
                          studentProfile.realClass
                      )}{" "}
                      {studentProfile.realClassArm
                        ? `• ${studentProfile.realClassArm}`
                        : ""}
                    </p>
                  </div>
                </div>

                {/* Actions */}

                <div className="flex flex-wrap gap-2">
                  {!editMode ? (
                    <button
                      onClick={handleStartEdit}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium transition"
                    >
                      <FaEdit />
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium"
                      >
                        <FaTimes />
                        Cancel
                      </button>

                      <button
                        onClick={handleSaveEdits}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition"
                      >
                        <FaSave />
                        Save Changes
                      </button>
                    </>
                  )}

                  <button
                    onClick={() =>
                      setShowPasswordModal(true)
                    }
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition"
                  >
                    <FaLock />
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================
            MAIN CONTENT
        ================================================================= */}

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid lg:grid-cols-3 gap-5">
            {/* ============================================================
                LEFT / MAIN
            ============================================================= */}

            <div className="lg:col-span-2 space-y-5">

              {/* Academic */}

              <Section
                icon={<FaGraduationCap />}
                title="Academic Information"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  <Field
                    label="Current Class"
                    value={
                      studentProfile.realClassNow
                        ?.mainClass ||
                      studentProfile.realClass
                    }
                  />

                  <Field
                    label="Arm"
                    value={
                      studentProfile.realClassNow
                        ?.arm ||
                      studentProfile.realClassArm
                    }
                  />

                  <Field
                    label="Department"
                    value={
                      studentProfile.realDepartment ||
                      academic.department
                    }
                  />

                  <Field
                    label="Session"
                    value={academic.session}
                  />

                  <Field
                    label="Current Term"
                    value={academic.term}
                  />

                  <Field
                    label="Class on Admission"
                    value={academic.classOnAdmission}
                  />

                  <Field
                    label="Date Admitted"
                    value={formatDate(
                      studentProfile.dateAdmitted
                    )}
                  />

                  <Field
                    label="Student Status"
                    value={studentProfile.status}
                  />

                  <Field
                    label="Club / House"
                    value={
                      editMode
                        ? null
                        : studentProfile.club_house
                    }
                  />
                </div>

                {/* Editable section */}

                {editMode && (
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                      <FaEdit className="text-blue-600" />

                      <h4 className="font-semibold text-slate-800">
                        Editable Information
                      </h4>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <EditableField
                        field={EDITABLE_FIELDS[0]}
                      />

                      <EditableField
                        field={EDITABLE_FIELDS[1]}
                      />
                    </div>
                  </div>
                )}
              </Section>

              {/* Contact */}

              <Section
                icon={<FaPhone />}
                title="Contact Information"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field
                    label="Phone"
                    value={contact.phone}
                    icon={<FaPhone />}
                  />

                  <Field
                    label="Email"
                    value={contact.email}
                    icon={<FaEnvelope />}
                  />

                  {!editMode && (
                    <Field
                      label="Address"
                      value={contact.address}
                      icon={<FaMapMarkerAlt />}
                    />
                  )}
                </div>

                {editMode && (
                  <div className="mt-5 pt-5 border-t border-slate-100">
                    <EditableField
                      field={EDITABLE_FIELDS[2]}
                    />
                  </div>
                )}
              </Section>

              {/* Guardian */}

              <Section
                icon={<FaUsers />}
                title="Parent / Guardian"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field
                    label="Name"
                    value={guardians.name}
                  />

                  <Field
                    label="Relationship"
                    value={guardians.relationship}
                  />

                  <Field
                    label="Occupation"
                    value={guardians.occupation}
                    icon={<FaBriefcase />}
                  />

                  <Field
                    label="Phone"
                    value={guardians.phone}
                    icon={<FaPhone />}
                  />

                  <Field
                    label="Email"
                    value={guardians.email}
                    icon={<FaEnvelope />}
                  />

                  <Field
                    label="Address"
                    value={guardians.address}
                    icon={<FaHome />}
                  />
                </div>
              </Section>
            </div>

            {/* ============================================================
                RIGHT COLUMN
            ============================================================= */}

            <div className="space-y-5">

              {/* Personal */}

              <Section
                icon={<FaUser />}
                title="Personal Information"
              >
                <div className="space-y-5">
                  <Field
                    label="Surname"
                    value={personalInfo.surname}
                  />

                  <Field
                    label="First Name"
                    value={personalInfo.firstName}
                  />

                  <Field
                    label="Other Name"
                    value={personalInfo.otherName}
                  />

                  <Field
                    label="Date of Birth"
                    value={formatDate(
                      personalInfo.dateOfBirth ||
                        personalInfo.dob
                    )}
                    icon={<FaCalendarAlt />}
                  />

                  <Field
                    label="Gender"
                    value={personalInfo.gender}
                  />
                </div>
              </Section>

              {/* Medical */}

              <Section
                icon={<FaHeartbeat />}
                title="Medical Information"
              >
                <div className="space-y-5">
                  <Field
                    label="Blood Group"
                    value={medical.bloodGroup}
                  />

                  <Field
                    label="Genotype"
                    value={medical.genotype}
                  />

                  <Field
                    label="Allergies"
                    value={medical.allergies}
                  />

                  <Field
                    label="Disability"
                    value={medical.disability}
                  />

                  <Field
                    label="Other Issues"
                    value={medical.otherIssues}
                  />
                </div>
              </Section>

              {/* Identification */}

              <Section
                icon={<FaIdCard />}
                title="Identification"
              >
                <div className="space-y-5">
                  <Field
                    label="Registration Number"
                    value={studentProfile.regNo}
                  />

                  <Field
                    label="Admission Number"
                    value={studentProfile.admissionNo}
                  />

                  <Field
                    label="Class ID"
                    value={
                      studentProfile.realClassId
                    }
                  />
                </div>
              </Section>
            </div>
          </div>

          {/* ================================================================
              EDIT NOTICE
          ================================================================= */}

          {editMode && (
            <div className="mt-6 p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <p className="text-sm text-blue-800">
                <strong>Profile update:</strong>{" "}
                Only basic information such as your club/house,
                hobbies and address can be edited from this page.
                Other academic, identification and sensitive
                information must be updated by the school.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* ==================================================================
          CHANGE PASSWORD MODAL
      =================================================================== */}

      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setShowPasswordModal(false)
              }
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Modal */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              transition={{
                duration: 0.2,
              }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}

              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <FaKey />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800">
                      Change Password
                    </h3>

                    <p className="text-xs text-slate-500">
                      Keep your account secure
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setShowPasswordModal(false)
                  }
                  className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Form */}

              <form
                onSubmit={handlePasswordSubmit}
                className="p-5 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Password
                  </label>

                  <input
                    type="password"
                    value={passwords.oldPassword}
                    onChange={(e) =>
                      handlePasswordChange(
                        "oldPassword",
                        e.target.value
                      )
                    }
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    New Password
                  </label>

                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      handlePasswordChange(
                        "newPassword",
                        e.target.value
                      )
                    }
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm New Password
                  </label>

                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      handlePasswordChange(
                        "confirmPassword",
                        e.target.value
                      )
                    }
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold transition flex items-center justify-center gap-2"
                  >
                    <FaLock />
                    Update Password
                  </button>
                </div>
              </form>
            </motion.div>
            </div>
        
        )}
      </AnimatePresence>
    </>
  );
}