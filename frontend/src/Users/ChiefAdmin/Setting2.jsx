import React, { useEffect, useState } from "react"
import { mainApi } from "../../api"
import { ItemHolder } from "./GeneralSetting"
import { useFormState } from "react-dom"
import axios from "axios"
import { FormSection, Input, Select } from "../StudentResgistration"
import { motion } from "framer-motion"
import { FaBook, FaChild, FaPlusCircle, FaTimesCircle, FaUpload } from "react-icons/fa"
import { schoolMainClasses } from "../../dataBase"
import { PopUp } from "../../components/LogInForm"

const getClassApi = `${mainApi}/classrooms`

export default function Setting2() {
  const api = `${mainApi}/setting/subject`;
  const getApi = `${mainApi}/setting/subjects`;

  // Initial Classroom Schema Structure
  const clazzRoom = {
    mainClass: "",
    department: "",
    arm: "",
    subjectOffered: [],
    classInfo: "",
    feeInfo: {
      total: 0,
      breakdown: []
    }
  };

  // State Declarations
  const [savedClasses, setSavedClasses] = useState({})
  const [subjects, setSubjects] = useState([]);
  const [mockTeachers, setMockedTeachers] = useState([]);
  const [name, setName] = useState("");
  const [abb, setAbb] = useState("");
  const [newSubjects, setNewSubjects] = useState([]);
  const [mess, setMess] = useState("");
  const [pop, setPop] = useState(false);
  const [theClass, setTheClass] = useState(clazzRoom);
  const [state, setState] = useState("sub");

  // Style Constants
  const btnX =
    "p-[8px] cursor-pointer hover:opacity-90 transition rounded-md text-white shadow-lg flex flex-row gap-4 text-md items-center font-lato";

  // Fetch Existing Subjects
  useEffect(() => {
    async function getSubs() {
      try {
        const res = await axios.get(getApi);
        //console.log(res.data);
        console.log(res.data)
        setSubjects(res.data.subjects || []);
        setMockedTeachers(res.data.teachers || []);
        setSavedClasses(res.data.classes ||  []);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
    }
    getSubs();
  }, [getApi]);

  // Add Subject Local Staging Handler
  function addSUbject(e) {
    e.preventDefault();
    if (name.length < 3 || abb.length < 2) {
      return alert("Subject Name or Abbreviation is too short.");
    }
    const exists = newSubjects.some(
      (s) =>
        s.name.toLowerCase() === name.toLowerCase() ||
        s.abb.toLowerCase() === abb.toLowerCase()
    );
    if (exists) return alert("This Subject is already added to the list.");

    setNewSubjects((prev) => [
      ...prev,
      { name, abb: abb.toUpperCase(), teachers: [] }
    ]);
    setName("");
    setAbb("");
  }

  // Upload Local Staged Subjects to API
  async function UploadSubject() {
    if (newSubjects.length < 1)
      return alert("Please add at least one subject before saving.");
    try {
      const saveSub = await axios.post(api, newSubjects);
      setMess(saveSub.data.msg || "Subjects saved successfully!");
      setPop(true);
      setNewSubjects([]);
      
      // Refresh subject list after upload
      const res = await axios.get(getApi);
      setSubjects(res.data.subjects || []);
    } catch (error) {
      console.error(error);
      alert("Oops! An error occurred while saving subjects.");
    }
  }

  async function addNewClass(e){
    e.preventDefault()
  }
  // Handle Form Inputs for Classroom Creation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTheClass((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle Subject Selection for Classroom
  const settingSub = (selectedSub) => {
    setTheClass((prev) => {
      const subId = selectedSub._id || selectedSub.abb || selectedSub.name;
      const exists = prev.subjectOffered.some(
        (sub) => (sub._id || sub.abb || sub.name) === subId
      );

      const updatedSubjects = exists
        ? prev.subjectOffered.filter(
            (sub) => (sub._id || sub.abb || sub.name) !== subId
          )
        : [...prev.subjectOffered, selectedSub];

      return {
        ...prev,
        subjectOffered: updatedSubjects
      };
    });
  };

  // Submit Classroom Creation Form
  async function addClass(e) {
    e.preventDefault();
    const addClassAPI = `${mainApi}/classroom/add`

    if (!theClass.mainClass) return alert("Please select a main class.");
    if (theClass.subjectOffered.length < 1) {
      return alert("Please select at least one subject for this classroom.");
    }
    
    try {
      console.log(theClass)
      // POST logic for classroom creation goes here
      const res = await axios.post(addClassAPI, theClass);
      console.log(res.data);
      console.log(theClass)
      alert("Classroom configured successfully!");
      alert(res.data.msg);
    } catch (error) {
      console.error(error);
      if(error.response){
        alert(error.response.data.msg);
      } else {
      alert("Failed to create classroom.");
      }
    }
  }

//additional subject and class management logic can be added here
// Mock Teachers Data (Replace or fetch from API as needed)
// const mockTeachers = ["SCH0001", "SCH0002" ];

// --- DYNAMIC FEE BREAKDOWN HANDLERS ---

// Add a new fee row
const handleAddFeeItem = () => {
  setTheClass((prev) => ({
    ...prev,
    feeInfo: {
      ...prev.feeInfo,
      breakdown: [...prev.feeInfo.breakdown, { title: "", amount: 0 }],
    },
  }));
};

// Remove a fee row by index
const handleRemoveFeeItem = (index) => {
  setTheClass((prev) => {
    const updatedBreakdown = prev.feeInfo.breakdown.filter((_, i) => i !== index);
    const updatedTotal = updatedBreakdown.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    return {
      ...prev,
      feeInfo: {
        total: updatedTotal,
        breakdown: updatedBreakdown,
      },
    };
  });
};

// Update fee row inputs and automatically recalculate total
const handleFeeChange = (index, field, value) => {
  setTheClass((prev) => {
    const updatedBreakdown = [...prev.feeInfo.breakdown];
    updatedBreakdown[index] = {
      ...updatedBreakdown[index],
      [field]: field === "amount" ? Number(value) || 0 : value,
    };

    const updatedTotal = updatedBreakdown.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0
    );

    return {
      ...prev,
      feeInfo: {
        total: updatedTotal,
        breakdown: updatedBreakdown,
      },
    };
  });
};

  return (
    <div>
      {/* Notification PopUp */}
      {pop && (
        <PopUp
          message={
            <div>
              <div
                onClick={() => setPop(false)}
                className={`${btnX} bg-pink-600 w-fit rounded-lg mb-7 text-sm`}
              >
                CLOSE <FaTimesCircle size={24} />
              </div>
              <p className="font-roboto text-lg px-5 py-2 text-sky-700">
                {mess}
              </p>
            </div>
          }
        />
      )}

      {/* Main Tab Navigation */}
      <div className="flex flex-row items-center gap-5 p-2 md:gap-10">
        <p className="p-1 bg-indigo-50 rounded-md text-md font-bold font-lato text-indigo-800 my-5">
          ADD SUBJECTS AND CLASSES
        </p>
        <div className="flex flex-row gap-4">
          <button
            onClick={() => setState("sub")}
            className={`${btnX} ${
              state === "sub" ? "bg-amber-800" : "bg-sky-800"
            }`}
          >
            SUBJECTS <FaBook size={22} />
          </button>
          <button
            onClick={() => setState("cls")}
            className={`${btnX} ${
              state !== "sub" ? "bg-amber-800" : "bg-sky-800"
            }`}
          >
            CLASSES <FaChild size={22} />
          </button>
        </div>
      </div>
      <hr />

      {/* TAB 1: SUBJECT MANAGEMENT */}
      {state === "sub" && (
        <motion.div
          initial={{ y: 70, opacity: 0.2 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="p-2 grid grid-cols-1 md:grid-cols-2 justify-center gap-5 rounded-md"
        >
          {/* Staged Subjects Preview */}
          {newSubjects.length > 0 ? (
            <motion.div
              className="p-3 bg-amber-50 text-[9pt] rounded-md shadow"
              initial={{ opacity: 0.5, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h5 className="font-bold text-gray-700 mb-2">
                Pending Subjects ({newSubjects.length})
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 md:gap-x-5 gap-y-2">
                {newSubjects.map((item, index) => (
                  <Input
                    key={index}
                    disabled
                    value={`${item.name} - ${item.abb}`}
                  />
                ))}
              </div>
              <button
                onClick={UploadSubject}
                className={`${btnX} bg-sky-800 my-4`}
              >
                SAVE ALL <FaUpload size={22} />
              </button>
            </motion.div>
          ) : (
            <div className="text-xl font-poppins text-center bg-sky-50 p-8 text-teal-900 rounded-md shadow flex items-center justify-center">
              NEW SUBJECTS ADDED WILL APPEAR HERE FOR REVIEW
            </div>
          )}

          {/* New Subject Form */}
          <form onSubmit={addSUbject} className="p-3 shadow-lg rounded-md bg-white">
            <FormSection title="ADD NEW SUBJECT">
              <Input
                onChange={(e) => setName(e.target.value)}
                label="Subject Name"
                value={name}
                required
                placeholder="e.g. Mathematics"
              />
              <Input
                label="Short Name (Abb)"
                value={abb}
                onChange={(e) => setAbb(e.target.value)}
                required
                placeholder="e.g. MATH"
              />
              <div className="mt-8 mb-4">
                <button type="submit" className={`${btnX} bg-gray-800`}>
                  ADD TO LIST <FaPlusCircle size={24} />
                </button>
              </div>
            </FormSection>
          </form>
        </motion.div>
      )}

      {/* TAB 2: CLASSROOM CREATION */}
      {state === "cls" && (
        <motion.div
          initial={{ y: 70, opacity: 0.2 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="p-4 bg-white shadow-md rounded-md mt-4"
        >
          <h4 className="font-bold text-xl font-lato text-gray-700">
            Create New Class
          </h4>
          <small className="text-amber-700 font-poppins block my-1">
            NOTE: You cannot modify core class metadata later except for Subjects Offered, Class Teacher, and Bio.
          </small>
          <hr className="my-3" />

          <form onSubmit={addClass} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select
                label="Main Class *"
                name="mainClass"
                value={theClass.mainClass}
                onChange={(e) =>
                   handleChange({
                   target: {   name: "mainClass", value: e.target.value     }
                     })}
                options={schoolMainClasses}
                required
              />

              <Select
                label="Department (Optional)"
                name="department"
                value={theClass.department}
                onChange={(e) =>
                   handleChange({
                   target: {   name: "department", value: e.target.value     }
                     })}
                options={["SCI", "ART", "COM"]}
              />

              <Select
                label="Class Arm (Optional)"
                name="arm"
                value={theClass.arm}
                onChange={ (e) =>
                   handleChange({
                   target: {   name: "arm", value: e.target.value     }
                     }) }
                options={["A", "B", "C", "D"]}
              />
            </div>

            {/* Subject Selector Grid */}
            <div className="my-2 p-4 bg-gray-50 rounded-md border border-gray-200">
{/* Class Teacher Datalist Selector */}
<div className="flex flex-col gap-1">
  <label className="text-sm font-semibold text-gray-700">Class Teacher</label>
  <input
    list="teachers-list"
    name="classTeacherX"
    value={theClass.classTeacherX}
    onChange={handleChange}
    placeholder="Search or select teacher ID"
    className="p-2 border rounded-md text-sm bg-white"
  />

  <datalist id="teachers-list">
    {mockTeachers.length > 0 &&
     mockTeachers.map((teacher) => (
      <option key={teacher._id} value={teacher.regNo}>
        ({teacher.regNo})
        {teacher.fullname}
      </option>
    ))}
  </datalist>
</div>


{/* Class Info / Bio Textarea */}
<div className="flex flex-col gap-1 md:col-span-2">
  <label className="text-sm font-semibold text-gray-700">Classroom Bio / Notes</label>
  <textarea
    name="classInfo"
    rows={3}
    value={theClass.classInfo}
    onChange={handleChange}
    placeholder="Enter class info, target capacity, room location, or general notes..."
    className="p-2 border rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-sky-600"
  />
</div>
            <label className="font-roboto text-gray-800 font-semibold block mb-2">
                Select Subjects for Class:{" "}
                <span className="text-indigo-700">
                  {`${theClass.mainClass}${theClass.arm} ${theClass.department}`}
                </span>
              </label>

              <div className="flex flex-wrap gap-3 my-3 max-h-60 overflow-y-auto p-2 border rounded-md bg-white">
                {subjects.length > 0 ? (
                  subjects.map((sub) => {
                    const subId = sub._id || sub.abb || sub.name;
                    const isSelected = theClass.subjectOffered.some(
                      (item) => (item._id || item.abb || item.name) === subId
                    );

                    return (
                      <div
                        key={subId}
                        onClick={() => settingSub(sub)}
                        className={`p-2 rounded-md text-xs cursor-pointer font-medium transition flex items-center gap-2 select-none ${
                          isSelected
                            ? "bg-pink-800 text-white shadow-md"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        {sub.name} {sub.abb ? `(${sub.abb})` : ""}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 italic p-2">
                    No subjects available. Add subjects under the "SUBJECTS" tab first.
                  </p>
                )}
              </div>
            </div>
{/* Fee Information Section */}
<div className="my-4 p-4 bg-gray-50 rounded-md border border-gray-200">
  <div className="flex justify-between items-center mb-3">
    <h5 className="font-semibold text-gray-800 text-md">Fee Breakdown Structure</h5>
    <button
      type="button"
      onClick={handleAddFeeItem}
      className={`${btnX} bg-emerald-700 text-xs px-3 py-1`}
    >
      <FaPlusCircle size={16} /> ADD FEE ITEM
    </button>
  </div>

  {theClass.feeInfo.breakdown.length > 0 ? (
    <div className="flex flex-col gap-3">
      {theClass.feeInfo.breakdown.map((fee, index) => (
        <div key={index} className="flex items-center gap-3 bg-white p-2 border rounded-md">
          <input
            type="text"
            placeholder="Fee Title (e.g. Tuition, Bus, Sports)"
            value={fee.title}
            onChange={(e) => handleFeeChange(index, "title", e.target.value)}
            className="flex-1 p-2 border rounded text-xs"
            required
          />
          <input
            type="number"
            min="0"
            placeholder="Amount"
            value={fee.amount || ""}
            onChange={(e) => handleFeeChange(index, "amount", e.target.value)}
            className="w-32 p-2 border rounded text-xs"
            required
          />
          <button
            type="button"
            onClick={() => handleRemoveFeeItem(index)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
            title="Remove Item"
          >
            <FaTimesCircle size={18} />
          </button>
        </div>
      ))}

      {/* Dynamic Total Summary */}
      <div className="flex justify-end items-center gap-2 pt-2 border-t font-bold text-gray-800">
        <span>Calculated Total Fee:</span>
        <span className="text-indigo-800 text-lg">
          {naira}{theClass.feeInfo.total.toLocaleString()}
        </span>
      </div>
    </div>
  ) : (
    <p className="text-xs text-gray-500 italic">
      No fee items added yet. Click "ADD FEE ITEM" to define fee breakdown structure.
    </p>
  )}
</div>

            <div className="flex justify-end">
              <button className={`${btnX} bg-blue-800 px-6`} type="submit">
                ADD CLASSROOM <FaPlusCircle size={22} />
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="p-3">
        {
        savedClasses.length > 0 
        &&
        savedClasses.map((cls) => (<ClassSubjectOverview data={cls}/> )) 
        }
      </div>
    </div>
  );
}


import { 
  FaBookOpen, 
  FaGraduationCap, 
  FaUserTie, 
  FaClock, 
  FaFlask, 
  FaLayerGroup 
} from 'react-icons/fa';
import { naira } from "../../staticFiles"

const ClassSubjectOverview = ({ data }) => {
  // Destructure with default fallbacks to prevent runtime crashes
  const {
    classId = 'N/A',
    mainClass = 'N/A',
    department = 'N/A',
    classTeacher,
    subjectOffered = [],
    updatedAt,
  } = data || {};

  // Format the updated time cleanly
  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Unknown date';

  // Motion animation variants for container stagger effect
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-800 pb-5 mb-6 gap-4">
        <div>
          {/* Prominent Class ID */}
          <div className="flex items-center gap-3">
            <span className="p-3 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-500/20">
              <FaGraduationCap className="text-2xl" />
            </span>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {classId}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <span className="bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                  {mainClass}
                </span>
                {department && (
                  <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    {department} Dept
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Metadata: Teacher & Update Time */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-1 text-xs text-slate-500 dark:text-slate-400">
          {classTeacher?.fullname && (
            <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <FaUserTie className="text-indigo-500" /> Teacher: {classTeacher.fullname} ({classTeacher.regNo})
            </span>
          )}
          <span className="flex items-center gap-1.5 font-normal">
            <FaClock className="text-slate-400" /> Updated: {formattedDate}
          </span>
        </div>
      </header>

      {/* SUBJECTS SECTION */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <FaBookOpen className="text-indigo-500 text-sm" />
            Subjects Offered
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full">
            Total: {subjectOffered.length}
          </span>
        </div>

        {/* Grid Container with Framer Motion */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {subjectOffered.map((subject, index) => (
            <motion.div
              key={subject._id || index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="group relative p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all duration-200 flex items-start gap-3"
            >
              {/* Subject Abbreviation Badge */}
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-100 dark:border-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                {subject.abb || <FaFlask />}
              </div>

              {/* Subject Details */}
              <div className="flex-grow min-w-0">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {subject.name || 'Unnamed Subject'}
                </h3>
                
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {subject.teachers?.length ? (
                    `${subject.teachers.length} assigned teacher(s)`
                  ) : (
                    'No teacher assigned'
                  )}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};