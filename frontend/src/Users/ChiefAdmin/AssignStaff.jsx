import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  DollarSign,
  FileCheck,
  UserPlus,
  BookOpen,
  GraduationCap,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { mainApi } from "../../api";
import axios from "axios";
import { FaDotCircle } from "react-icons/fa";

export default function StaffManagementForm({ initialStaff = {} }) {
  const [staff, setStaff] = useState({
    regNo: initialStaff.regNo || "",
    staffType: initialStaff.staffType || "regular",
    staffCategory: initialStaff.staffCategory || "teaching",
   // thisUser: "a",
    specialRoles: {
      chiefAdmin: false,
      isAdmin: false,
      canManageStudents: false,
      canManageFinance: false,
      canUploadAssignedResults: false,
      canApproveUser: false,
      canManageAdmission: false,
      isClassTeacher: false,
      isSubjectTeacher: false,
      ...initialStaff.specialRoles,
    },

    assignedClass: initialStaff.assignedClass || {
      arm: "",
      classId: "",
      department: "",
      mainClass: "",
    },

    assignedSubjects: initialStaff.assignedSubjects || [],
    subAssignment: initialStaff.assignedSubjects || []
  });

  const [alertMsg, setAlertMsg] = useState("");

  const isNonTeaching = staff.staffCategory === "non-teaching";

  const [staffToAssign, setStaffToAssign] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [subAssignable, setSubAssignable] = useState([]);
  const [selection, setSelection] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState("");

  const SPECIAL_ROLE_CONFIG = [
    {
      key: "chiefAdmin",
      label: "Chief Admin",
      icon: ShieldAlert,
      color: "text-red-500",
    },
    {
      key: "isAdmin",
      label: "Admin Access",
      icon: ShieldCheck,
      color: "text-indigo-500",
    },
    {
      key: "canManageStudents",
      label: "Manage Students",
      icon: UserCheck,
      color: "text-blue-500",
    },
    {
      key: "canManageFinance",
      label: "Manage Finance",
      icon: DollarSign,
      color: "text-emerald-500",
    },
    {
      key: "canUploadAssignedResults",
      label: "Upload Results",
      icon: FileCheck,
      color: "text-amber-500",
    },
    {
      key: "canApproveUser",
      label: "Approve Users",
      icon: UserCheck,
      color: "text-purple-500",
    },
    {
      key: "canManageAdmission",
      label: "Manage Admission",
      icon: UserPlus,
      color: "text-teal-500",
    },
    {
      key: "isClassTeacher",
      label: "Class Teacher",
      icon: GraduationCap,
      color: "text-sky-500",
    },
    {
      key: "isSubjectTeacher",
      label: "Subject Teacher",
      icon: BookOpen,
      color: "text-rose-500",
    },
  ];


  const [selectedSub, setSelectedSub] = useState("")
  const getStaffToAssign = async () => {
    try {
      const res = await axios.get(`${mainApi}/user/get-staff`);
   setSubAssignable(makeSubjects(res.data.classes))

      setStaffToAssign(res.data.staff || []);
      setAllClasses(res.data.classes || []);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      } else {
        alert("Network Error!");
      }
    }
  };

  useEffect(() => {
   
    getStaffToAssign();
  }, []);

  /*
   * Keep selectedClassId synchronized when an existing
   * staff configuration is loaded.
   */
  useEffect(() => {
    if (staff.assignedClass?.classId) {
      setSelectedClassId(staff.assignedClass.classId);
    } else {
      setSelectedClassId("");
    }
  }, [staff.assignedClass?.classId]);

  const handleSelectChange = (field, value) => {
    setStaff((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      if (field === "staffCategory" && value === "non-teaching") {
        updated.assignedClass = {
          arm: "",
          classId: "",
          department: "",
          mainClass: "",
        };

        updated.assignedSubjects = [];

        updated.specialRoles = {
          ...prev.specialRoles,
          isClassTeacher: false,
          isSubjectTeacher: false,
        };

        setSelectedClassId("");
      }

      return updated;
    });
  };

  const toggleSpecialRole = (roleKey) => {
    setStaff((prev) => ({
      ...prev,
      specialRoles: {
        ...prev.specialRoles,
        [roleKey]: !prev.specialRoles[roleKey],
      },
    }));
  };

  /*
   * Selecting a class for CLASS TEACHER assignment.
   */
  const handleClassSelect = (classId) => {
    setSelectedClassId(classId);

    const selected = allClasses.find(
      (item) => item.classId === classId
    );

    if (!selected) {
      setStaff((prev) => ({
        ...prev,
        assignedClass: {
          arm: "",
          classId: "",
          department: "",
          mainClass: "",
        },
        specialRoles: {
          ...prev.specialRoles,
          isClassTeacher: false,
        },
      }));

      return;
    }

    setStaff((prev) => ({
      ...prev,
      assignedClass: {
        classId: selected.classId,
        mainClass: selected.mainClass || "",
        arm: selected.arm || "",
        department: selected.department || "",
      },
      specialRoles: {
        ...prev.specialRoles,
        isClassTeacher: true,
      },
    }));
  };

  /*
   * Find currently selected class.
   */
  const selectedClass = allClasses.find(
    (item) => item.classId === selectedClassId
  );

  /*
   * Add a subject for the currently selected class.
   */
  const addSubject = (subject) => {
    if (!subject || !selectedClass) return;

    const alreadyAssigned = staff.assignedSubjects.some(
      (item) =>
        item.forClass?.classId === selectedClass.classId &&
        item.subject === subject.name
    );

    if (alreadyAssigned) {
      alert("Subject already assigned for this class for the teacher");
      return;
    }

    const newAssignment = {
      forClass: {
        mainClass: selectedClass.mainClass || "",
        arm: selectedClass.arm || "",
        department: selectedClass.department || "",
        classId: selectedClass.classId,
      },
      subject: subject.name,
      abb: subject.abb || "",
    };

    setStaff((prev) => ({
      ...prev,
      assignedSubjects: [
        ...prev.assignedSubjects,
        newAssignment,
      ],
      specialRoles: {
        ...prev.specialRoles,
        isSubjectTeacher: true,
      },
    }));
  };

  /*
   * Remove one specific class-subject allocation.
   */
  const removeSubject = (classId, subjectName) => {
    setStaff((prev) => {
      const nextSubjects = prev.subAssignment.filter(
        (item) =>
          !(
            item.forClass?.classId === classId &&
            item.subject === subjectName
          )
      );

      return {
        ...prev,
        subAssignment: nextSubjects,
        specialRoles: {
          ...prev.specialRoles,
          isSubjectTeacher: nextSubjects.length > 0,
        },
      };
    });
  };

  /*
   * Select an existing staff member.
   */
  const setStaffSelected = (e) => {
    const reg = e.target.value;

    const elm = staffToAssign.find(
      (item) => item.regNo === reg
    );

    if (!elm) {
      setSelection(null);
      return;
    }

    setSelection(elm);

    setStaff((prev) => ({
      ...prev,
      regNo: elm.regNo || "",
      staffType: elm.staffType || "regular",
      staffCategory: elm.staffCategory || "teaching",

      assignedClass: elm.assignedClass || {
        arm: "",
        classId: "",
        department: "",
        mainClass: "",
      },

      subAssignment: elm.assignedSubjects || [],

      specialRoles: {
        ...prev.specialRoles,
        ...(elm.specialRoles || {}),
      },
    }));
  };

  const configureStaff = async () => {

    const apiUrl = `${mainApi}/staff/roles/set/${JSON.parse(localStorage.getItem("logged-user")).id}`

    try {
      const res = await axios.put(apiUrl, staff)
      setAlertMsg(res.data.msg);
    } catch (error) {
      if(error.response){
        setAlertMsg(error.response.data.msg)
      } else {
        setAlertMsg("Network/Server Error")
      }
    }
  };

  const [previousTeachers, setPreviousTeachers] = useState([]) //teacher assigned to a selected subject: staffId,Regno and fullname
  const assignSubject = (e) => {
    let src = subAssignable.find(s => s.faceView === selectedSub);
    if(!src) return alert("Kindly Select a valid Subject...");

    setPreviousTeachers(src.prevTeachers);
    const check = staff.subAssignment.find(s => s.faceView === selectedSub);
    if(check) return alert("The teacher is already assigned for the selected subject for the class.")
    //map, replace or push 
    /*
    setStaff({...staff,
      subAssignment: {}
    }) 
*/

   setStaff((prev) => ({
    ...prev,
    subAssignment: [
     ...prev.subAssignment, src
    ]
   }));
   
   setSelectedSub("")
  }


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white dark:bg-slate-900 shadow-lg rounded-2xl border border-slate-100 dark:border-slate-800">
{alertMsg && (
  <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 px-4">
    <div className="relative w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
      
      {/* Close button */}
      <button
        onClick={() => setAlertMsg("")}
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
      {/* HEADER */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Staff Role & Permission Management
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Configure admin privileges, special system flags, and class assignments.
        </p>
      </div>

      {/* STAFF SELECTION */}
      {staffToAssign.length > 0 && (
        <FormSection
          label="Select Staff To Proceed"
          description="Select or search staff to set their roles and permissions."
        >
          <div>
            <input
              list="teachers"
              placeholder="Enter Staff Name / Registration Number"
              name="teachers"
              className="w-full p-2.5 border rounded-md text-sm bg-white dark:bg-slate-900 dark:border-slate-700"
              onChange={setStaffSelected}
            />

            <datalist id="teachers">
              {staffToAssign.map((item) => (
                <option
                  key={item._id}
                  value={item.regNo}
                >
                  {item.fullname}
                </option>
              ))}
            </datalist>
          </div>

          {selection && (
            <div className="my-2 text-sm text-sky-800 dark:text-sky-400">
              <p className="font-bold">
                {selection.fullname}, REG. NO/ID:{" "}
                {selection.regNo}/{selection.staffId}
              </p>
            </div>
          )}
        </FormSection>
      )}

      {/* STAFF CLASSIFICATION */}
      <FormSection
        label="Staff Classification"
        description="Determine institutional level and structural position."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Select
            label="Staff Type"
            options={[
              {
                label: "Regular Staff",
                value: "regular",
              },
              {
                label: "Assistant Admin (Admin 2)",
                value: "admin2",
              },
              {
                label: "Full Administrator",
                value: "admin",
              },
            ]}
            value={staff.staffType}
            onChange={(e) =>
              handleSelectChange(
                "staffType",
                e.target.value
              )
            }
          />

          <Select
            label="Staff Category"
            options={[
              {
                label: "Teaching Staff",
                value: "teaching",
              },
              {
                label: "Non-Teaching Staff",
                value: "non-teaching",
              },
              {
                label: "Administrative Staff",
                value: "admin-staff",
              },
            ]}
            value={staff.staffCategory}
            onChange={(e) =>
              handleSelectChange(
                "staffCategory",
                e.target.value
              )
            }
          />

        </div>
      </FormSection>

      {/* SPECIAL ROLES */}
      <FormSection
        label="Special Roles & System Privileges"
        description="Toggle specific administrative and functional capabilities."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

          {SPECIAL_ROLE_CONFIG.map(
            ({
              key,
              label,
              icon: Icon,
              color,
            }) => {
              const isActive =
                staff.specialRoles[key];

              const isDisabled =
                isNonTeaching &&
                (
                  key === "isClassTeacher" ||
                  key === "isSubjectTeacher"
                );

              return (
                <motion.button
                  key={key}
                  type="button"
                  whileTap={{
                    scale: isDisabled ? 1 : 0.97,
                  }}
                  onClick={() =>
                    !isDisabled &&
                    toggleSpecialRole(key)
                  }
                  disabled={isDisabled}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all duration-200 ${
                    isDisabled
                      ? "opacity-40 bg-slate-100 dark:bg-slate-800/50 cursor-not-allowed border-transparent"
                      : isActive
                      ? "bg-slate-50 dark:bg-slate-800/90 border-indigo-500 shadow-sm"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">

                    <div
                      className={`p-2 rounded-lg ${
                        isActive
                          ? "bg-white dark:bg-slate-700 shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isActive
                            ? color
                            : "text-slate-400"
                        }`}
                      />
                    </div>

                    <span
                      className={`text-sm font-medium ${
                        isActive
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {label}
                    </span>

                  </div>

                  {isActive ? (
                    <ToggleRight className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                  )}

                </motion.button>
              );
            }
          )}

        </div>
      </FormSection>

      {/* TEACHING ASSIGNMENTS */}
      <AnimatePresence>
        {!isNonTeaching && allClasses.length > 0 && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            className="space-y-6 overflow-hidden"
          >

            <FormSection
              label="Class & Academic Duties"
              description="Assign class teacher responsibilities and subject courses."
            >

              <div className="space-y-6">
                
                  <Select
                    label="Assigned Class Arm"
                    options={[
                      {
                        label: "-- Select Class --",
                        value: "",
                      },

                      ...allClasses.map(
                        (cls) => ({
                          label: `${cls.mainClass || ""}${
                            cls.arm
                              ? ` - ${cls.arm}`
                              : ""
                          }${
                            cls.department
                              ? ` (${cls.department})`
                              : ""
                          }`,
                          value: cls.classId,
                        })
                      ),
                    ]}
                    value={selectedClassId}
                    onChange={(e) =>
                      handleClassSelect(
                        e.target.value
                      )
                    }
                  />

                  {staff.assignedClass?.classId && (
                    <div className="mt-2 text-xs flex flex-wrap gap-2 text-indigo-600 dark:text-indigo-400 font-medium">

                      <span>
                        Class:{" "}
                        {staff.assignedClass.mainClass}
                      </span>

                      <span>•</span>

                      <span>
                        Arm:{" "}
                        {staff.assignedClass.arm || "N/A"}
                      </span>

                      <span>•</span>

                      <span>
                        Dept:{" "}
                        {staff.assignedClass.department || "N/A"}
                      </span>

                    </div>
                  )}

                {/* SUBJECT BY CLASS TEACHER */}
            <div className="my-4">
              <hr/>
              <p className=" py-2 font-poppins text-sm font-bold text-blue-800">SUBJECT ALLOCATION - {staff && (staff.subAssignment.length)}</p>
            {subAssignable.length > 0 &&
            <div className="flex gap-5 flex-row items-center p-2 ">
            <input
              list="sub-to-assign"
              placeholder="Select or Type Subject Name"
              name="sub-to-assign"
              value={selectedSub}
              onChange={(e) => setSelectedSub(e.target.value)}
              className="w-full p-2.5 border rounded-md text-sm bg-white dark:bg-slate-900 dark:border-slate-700"
            />

            <datalist id="sub-to-assign">
              {subAssignable.length}
              {subAssignable.map((item) => (
                <option
                  key={item.faceView}
                  value={item.faceView}
                >
                  {item.subject} ({item.prevTeachers.length > 0 ? (item.prevTeachers.length + " Teachers") : "No Teacher"})
                </option>
              ))}
            </datalist>

            <button className="p-2 rounded-md bg-sky-700 text-white flex items-center gap-2 font-bold" onClick={assignSubject}>ASSIGN <FaDotCircle size={18}/></button>
            </div>
           }
           </div>

                {/* CURRENT SUBJECT ASSIGNMENTS */}
                <div className="space-y-3">

                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Assigned Subjects
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Subjects currently assigned to this staff member.
                    </p>
                  </div>

                  {staff.subAssignment.length > 0 ? (
                    <div className="space-y-2">

                      <AnimatePresence>
                        {staff.subAssignment.map(
                          (assignment, index) => (
                            <motion.div
                              key={`${assignment.forClass?.classId}-${assignment.subject}-${index}`}
                              layout
                              initial={{
                                opacity: 0,
                                scale: 0.95,
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                              }}
                              exit={{
                                opacity: 0,
                                scale: 0.95,
                              }}
                              className="flex items-center justify-between gap-3 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/60 dark:bg-indigo-950/20"
                            >

                              <div className="flex items-center gap-3 min-w-0">

                                <div className="p-2 rounded-lg bg-white dark:bg-slate-800">
                                  <BookOpen className="w-4 h-4 text-indigo-500" />
                                </div>

                                <div className="min-w-0">

                                  <div className="flex items-center gap-2">

                                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                      {assignment.subject}
                                    </span>

                                    {assignment.abb && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 font-semibold">
                                        {assignment.abb}
                                      </span>
                                    )}

                                  </div>

                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">

                                    {assignment.forClass?.mainClass}

                                    {assignment.forClass?.arm &&
                                      ` • ${assignment.forClass.arm}`}

                                    {assignment.forClass?.department &&
                                      ` • ${assignment.forClass.department}`}

                                  </p>

                                </div>

                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  removeSubject(
                                    assignment.forClass?.classId,
                                    assignment.subject
                                  )
                                }
                                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                title="Remove subject"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                            </motion.div>
                          )
                        )}
                      </AnimatePresence>

                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      No subjects assigned yet.
                    </p>
                  )}

                </div>

              </div>

            </FormSection>

          </motion.div>
        )}
      </AnimatePresence>

      {/* SAVE */}
      <div className="pt-4 flex justify-end gap-3">

        <button
          type="button"
          onClick={configureStaff}
          disabled={!selection}
          className="px-5 py-2.5 rounded-xl font-medium text-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all shadow-md active:scale-95"
        >
          Save Staff Configuration
        </button>

      </div>

    </div>
  );
}


/* -------------------------------------------------------
   SELECT COMPONENT
------------------------------------------------------- */

function Select({
  label,
  options,
  value,
  onChange,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5">

      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </label>
      )}

      <select
        value={value}
        onChange={onChange}
        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        {...props}
      >
        {options.map((opt, idx) =>
          typeof opt === "string" ? (
            <option
              key={idx}
              value={opt}
            >
              {opt}
            </option>
          ) : (
            <option
              key={`${opt.value}-${idx}`}
              value={opt.value}
            >
              {opt.label}
            </option>
          )
        )}
      </select>

    </div>
  );
}


/* -------------------------------------------------------
   FORM SECTION
------------------------------------------------------- */

function FormSection({
  label,
  description,
  children,
}) {
  return (
    <div className="space-y-4 p-5 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">

      <div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          {label}
        </h3>

        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>

      <div>{children}</div>

    </div>
  );
}

function makeSubjects (clazz){
  let allSubs = [];

  for(let i=0; i<clazz.length; i++){
    let cls = clazz[i];
    let subs = clazz[i].subjectOffered;

    for(let s=0; s<subs.length; s++){
      const sub = subs[s]
      allSubs.push({
        faceView: sub.name + " (" + sub.abb + ") - " + cls.classId,
        prevTeachers: sub.teachers,
        forClass: {mainClass: cls.mainClass, arm: cls.arm, department: cls.department, classId: cls.classId},
        subject: sub.name,
        abb: sub.abb
      })
    }
  }

  return allSubs;
}