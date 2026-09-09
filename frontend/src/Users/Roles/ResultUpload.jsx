import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { mainApi } from "../../api";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";
import { gradeScaleI, gradeScaleII, gradeScaleIII } from "../../dataBase";

export default function ResultEntry() {

const [gradeSystem, setGradeSystem] = useState(gradeScaleI);
const [showGradeScale, setShowGradeScale] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");


  // Backend data
  const [staff, setStaff] = useState(null);
  const [classList, setClassList] = useState([]);

  // Entire selected assignment object
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Controls the assignment overlay
  const [showAssignments, setShowAssignments] = useState(false);


  async function getSubjectAllocation() {
    const apiII = `${mainApi}/staff/duty/subjects/${JSON.parse(localStorage.getItem("logged-user")).user}`;

    try {
      const res = await axios.get(apiII);
     
      setStaff(res.data.staff);
      setClassList(res.data.assignment);

      console.log(res.data);
    } catch (error) {
      if (error.response) {
        const msg = error.response.data.msg;
        setAlertMsg(msg);

        if(msg==="The User Profile is unapproved or not found!"){
          
        }
      } else {
        setAlertMsg("Server/Network Error...");
      }
    }
  }


  useEffect(() => {
    getSubjectAllocation();
  }, []);

  //currentList refined and made up here.....

  // Store the ENTIRE clicked assignment JSON
  const [currentInfo, setCurrentInfo] = useState({
    term: "", session: "",
    subject: "", 
    classId: ""
  })
  const [currentClassList, setCurrentClassList] = useState([]); //recording sheet created...
  const [load3, setLoad3] = useState(false);
  const [useLts, setUseLts] = useState(false);

async function handleAssignmentSelect(assignment) {
  setSelectedAssignment(assignment);
  setShowAssignments(false);

  // Information about the selected class
  const id = assignment.forClass;

  /*
    Update currentInfo with the selected
    subject and class.

    term and session are preserved.
  */
  setCurrentInfo(prev => ({
    ...prev,
    subject: assignment.subject,
    classId: id.classId,
  }));


  // Build query for fetching students/results
  const srch = new URLSearchParams({
    classId: id.classId,
    staffId: "STA0001",
    forClass: id.mainClass,
    subject: assignment.subject,
    useLts
  });

  const api3 = `${mainApi}/staff/uploading-scores/list?${srch.toString()}`;

  setLoad3(true);

  try {

    const res = await axios.get(api3);

    console.log("Result response:", res.data);


    /*
      Backend is expected to return:

      {
        classList: [...],
        prevList: [...]
      }
    */

    const classList = res.data.classList || [];
    const prevList = res.data.previousScores || [];
    const setup = res.data.currentSettings;
    const param = res.data.params
    setCurrentInfo({...currentInfo, session: setup.currentSession})
    setCurrentInfo({...currentInfo, term: setup.currentTerm})
    setCurrentInfo({...currentInfo, classId: param.classId})
    setCurrentInfo({...currentInfo, subject: param.subect})
    /*
      ============================================================
      NO PREVIOUS RESULT
      ============================================================

      Build a fresh result object for every student.
    */
    if (prevList.length === 0) {

      const newList = classList.map(student => ({

        // Unique result ID
        _id: `${student.admissionNo}-${setup.currentSession}-${setup.currentTerm}-${param.classId}-${assignment.subject}`,

        // Student identification
        admissionNo: student.admissionNo,
        regNo: student.regNo,
        fullname: student.personalInfo.surname.toUpperCase() + " " + student.personalInfo.otherName,
        // Academic information
        term: setup.currentTerm,
        session: setup.currentSession,
        classId: param.classId,
        mainClass: id.mainClass,
        subject: assignment.subject,
        arm: id.arm || "",
        department: id.department || "",

        // Student information for displaying in the table
        passportUrl: student.passportUrl || "",
        personalInfo: student.personalInfo,

        // Result fields
        ca1: 0,
        ca2: 0,
        caTotal: 0,
        exam: 0,
        lts: 0,
        position: "",
        total: 0,
        grade: "",
        remark: "",

        // Staff who is recording the result
        recorderId: "STA0001",

      }));


      // This becomes our working result list
      setCurrentClassList(newList);

      console.log("NEW RESULT LIST:", newList);

    }


    /*
      ============================================================
      PREVIOUS RESULT EXISTS
      ============================================================

      Use the existing result records directly.
    */
    else {

      setCurrentClassList(prevList);

      console.log("PREVIOUS RESULT LIST:", prevList);

    }


    setAlertMsg(res.data.msg);

  } catch (error) {

    if (error.response) {

      setAlertMsg(error.response.data.msg);

    } else {

      setAlertMsg("Network Error....");

    }

  } finally {

    setLoad3(false);

  }

 // console.log("Selected assignment:", assignment);
}

// Calculate total, grade and remark for a result record
function calculateResult(result) {
  const ca1 = Number(result.ca1) || 0;
  const ca2 = Number(result.ca2) || 0;
  const exam = Number(result.exam) || 0;
  const lts = Number(result.lts) || 0;

  // CA total
  const caTotal = ca1 + ca2;

  /*
    For now, LTS is ignored.

    If LTS is later enabled:
    total can be changed to something like:
    (caTotal + exam + lts) / 2
  */
  const total = caTotal + exam;

  // Find the matching grading scale
  const gradeInfo = gradeSystem.find(
    scale => total >= scale.min && total <= scale.max
  );

  return {
    caTotal,
    total,
    grade: gradeInfo?.grade || "",
    remark: gradeInfo?.remark || "",
  };
}

function handleScoreChange(index, field, value) {
  setCurrentClassList(prev => {
    const updatedList = [...prev];

    const updatedStudent = {
      ...updatedList[index],
      [field]: value === "" ? "" : Number(value),
    };

    // Recalculate everything whenever a score changes
    const calculated = calculateResult(updatedStudent);

    updatedList[index] = {
      ...updatedStudent,
      ...calculated,
    };

    return updatedList;
  });
}


const UploadResults = async () => {
  const token = JSON.parse(localStorage.getItem("logged-user")).token
  const param = new URLSearchParams({
    token,
    useLts
  });

  //Best Practise: Send Results using headers...
  const uploadAPI = `${mainApi}/results/bulk-upload?${param.toString()}`
  console.log("CURRENT RES UPLOADABLE:", currentClassList);

  try {
     const res = await axios.post(uploadAPI,
       {results: currentClassList}
      );
     console.log(res.data);
     setAlertMsg(res.data.msg)
  } catch (error) {
    if(error.response){
      setAlertMsg(error.response.data.msg)
    } else {
      setAlertMsg("Network Error/Server Error...")
    }
  }
}

const computePosition = (arr) => {
  let updatedResult = []
  const sorted = [...arr].sort((a, b ) => b.total - a.total);

  for(let i=0; i<sorted.length; i++){
    let item = sorted[i]
    const rank = sorted.findIndex(k => k.total === item.total)
    item.position = (rank+1)
    updatedResult.push(item)
  }

  return updatedResult;
}
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 relative">

      {/* ALERT OVERLAY */}
      {alertMsg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">

            <button
              onClick={() => setAlertMsg("")}
              className="absolute right-4 top-3 text-2xl font-bold text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>

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


      {/* STAFF INFORMATION */}
      {staff && (
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200">

          <div className="bg-slate-900 px-5 py-4 text-white">
            <h1 className="text-xl font-bold">
              Staff Result Upload
            </h1>
            <p className="text-sm text-slate-300">
              Staff Information
            </p>
          </div>


          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">

            {/* PASSPORT */}
            <div className="shrink-0">
              {staff.passportUrl ? (
                <img
                  src={staff.passportUrl}
                  alt={staff.fullname}
                  className="h-24 w-24 rounded-full border-4 border-slate-100 object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 border-4 border-slate-200 text-3xl font-bold text-slate-400">
                  {staff.fullname?.charAt(0)?.toUpperCase() || "S"}
                </div>
              )}
            </div>


            {/* DETAILS */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-800">
                {staff.fullname}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                @{staff.displayName}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                  Staff ID: <strong>{staff.staffId}</strong>
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                  {classList.length} Assigned Subject{classList.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>


            {/* SELECT SUBJECT BUTTON */}
            <button
              onClick={() => setShowAssignments(true)}
              className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Select Subject
            </button>

          </div>
        </div>
      )}


      {/* CURRENTLY SELECTED ASSIGNMENT */}
      {selectedAssignment && (
        <div className="mx-auto mt-5 max-w-5xl rounded-2xl border border-blue-100 bg-blue-50 p-5">

          <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
            Selected Assignment
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-800">
            {selectedAssignment.faceView}
          </h3>

          <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600">
            <span>
              Subject: <strong>{selectedAssignment.subject}</strong>
            </span>

            <span>•</span>

            <span>
              Class: <strong>{selectedAssignment.forClass?.classId}</strong>
            </span>
          </div>
        </div>
      )}

      {/*DISPLAY RECORDING SHEET HERE/NO RECORD FOUND CASE OF EMPTY LIST*/}
{currentClassList.length > 0 && (
  <div className="mx-auto mt-6 max-w-7xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

    {/* TABLE HEADER */}
    <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <h2 className="text-lg font-bold text-slate-800">
          Enter Results
        </h2>

        <p className="text-sm text-slate-500">
          {currentInfo.subject} • {currentInfo.classId}
        </p>
      </div>

      <div className="text-sm text-slate-500">
        {currentClassList.length} Student
        {currentClassList.length !== 1 ? "s" : ""}
      </div>

    </div>


    {/* TABLE */}
    <div className="overflow-x-auto">

      <table className="w-full min-w-[950px] border-collapse text-sm">

        <thead>
          <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">

            <th className="border-b border-slate-200 px-4 py-3">
              #
            </th>

            <th className="border-b border-slate-200 px-4 py-3">
              Student
            </th>

            <th className="border-b border-slate-200 px-4 py-3">
              Admission No.
            </th>

            <th className="border-b border-slate-200 px-4 py-3 text-center">
              CA 1
            </th>

            <th className="border-b border-slate-200 px-4 py-3 text-center">
              CA 2
            </th>

            <th className="border-b border-slate-200 px-4 py-3 text-center">
              CA Total
            </th>

            <th className="border-b border-slate-200 px-4 py-3 text-center">
              Exam
            </th>

            <th className="border-b border-slate-200 px-4 py-3 text-center">
              Total
            </th>

            <th className="border-b border-slate-200 px-4 py-3 text-center">
              Grade
            </th>

            <th className="border-b border-slate-200 px-4 py-3">
              Remark
            </th>

          </tr>
        </thead>


        <tbody>

          {currentClassList.map((student, index) => (

            <tr
              key={student._id || student.admissionNo}
              className="hover:bg-slate-50"
            >

              {/* NUMBER */}
              <td className="border-b border-slate-100 px-4 py-3 text-slate-400">
                {index + 1}
              </td>


              {/* STUDENT */}
              <td className="border-b border-slate-100 px-4 py-3">

                <div className="flex items-center gap-3">

                  {/* Passport */}
                  {student.passportUrl ? (
                    <img
                      src={student.passportUrl}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                      {student.fullname?.charAt(0) || "S"}
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-[10px] text-slate-800">
                      {student.fullname?.slice(0, 10)}{student.fullname?.length > 0 && "..."}
                    </p>

                    <p className="text-xs text-slate-400">
                      {student.regNo}
                    </p>
                  </div>

                </div>

              </td>


              {/* ADMISSION NUMBER */}
              <td className="border-b border-slate-100 px-4 py-3 font-medium text-slate-700">
                {student.admissionNo}
              </td>


              {/* CA1 */}
              <td className="border-b border-slate-100 px-4 py-3">

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={student.ca1}
                  onChange={(e) =>
                    handleScoreChange(index, "ca1", e.target.value)
                  }
                  className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-center outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
                />

              </td>


              {/* CA2 */}
              <td className="border-b border-slate-100 px-4 py-3">

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={student.ca2}
                  onChange={(e) =>
                    handleScoreChange(index, "ca2", e.target.value)
                  }
                  className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-center outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
                />

              </td>


              {/* CA TOTAL */}
              <td className="border-b border-slate-100 px-4 py-3 text-center font-semibold text-slate-700">
                {student.caTotal ?? 0}
              </td>


              {/* EXAM */}
              <td className="border-b border-slate-100 px-4 py-3">

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={student.exam}
                  onChange={(e) =>
                    handleScoreChange(index, "exam", e.target.value)
                  }
                  className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-center outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-200"
                />

              </td>


              {/* TOTAL */}
              <td className="border-b border-slate-100 px-4 py-3 text-center font-bold text-slate-800">
                {student.total ?? 0}
              </td>


              {/* GRADE */}
              <td className="border-b border-slate-100 px-4 py-3 text-center">

                <span className="inline-flex min-w-10 items-center justify-center rounded-lg bg-slate-100 px-3 py-1.5 font-bold text-slate-700">
                  {student.grade || "-"}
                </span>

              </td>


              {/* REMARK */}
              <td className="border-b border-slate-100 px-4 py-3">

                <span className="font-medium text-slate-600">
                  {student.remark || "-"}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>


    {/* UPLOAD BUTTON */}
    <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-5 py-4">

      <button
        type="button"
        onClick={UploadResults}
        className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800"
      >
        Upload Result
      </button>

    </div>

  </div>
)}
{
  currentClassList.length === 0 && selectedAssignment && (  
    <data className="mx-auto mt-6 max-w-5xl rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
      <p className="text-sm text-slate-500">
        No students found for {currentInfo.subject} in {currentInfo.classId}.
      </p>
    </data>
  )

}
      {/* ASSIGNMENT OVERLAY */}
      {showAssignments && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="relative max-h-[85vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

{/* OVERLAY HEADER */}
<div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

  <div>
    <h2 className="text-lg font-bold text-slate-800">
      Assigned Subjects
    </h2>

    <p className="text-sm text-slate-500">
      Select a class and subject to continue
    </p>
  </div>

  <div className="flex items-center gap-5">

    {/* USE LAST TERM SCORES */}
    <div className="flex items-center gap-2">
      <div className="text-right">
        <p className="text-xs font-semibold text-slate-600">
          Use Last Term Scores
        </p>

        <p className="text-[10px] text-slate-400">
          {useLts ? "Enabled" : "Disabled"}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setUseLts(!useLts)}
        className="transition-transform active:scale-95"
        title={useLts ? "Disable" : "Enable"}
      >
        {useLts ? (
          <FaToggleOn
            className="text-green-500"
            size={27}
          />
        ) : (
          <FaToggleOff
            className="text-slate-400"
            size={27}
          />
        )}
      </button>
    </div>

    {/* GRADE SYSTEM */}
    <div className="hidden sm:block border-l border-slate-200 pl-5">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        Grade System
      </p>

      <div className="flex items-center gap-1">
        {[
          { label: "I", scale: gradeScaleI },
          { label: "II", scale: gradeScaleII },
          { label: "III", scale: gradeScaleIII },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setGradeSystem(item.scale)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              gradeSystem === item.scale
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>

  </div>

  <button
    onClick={() => setShowAssignments(false)}
    className="ml-3 text-2xl text-slate-400 hover:text-slate-700"
  >
    &times;
  </button>

</div>

             <div> {useLts && <small className="p-2 text-[10px] w-fit rounded-md text-teal-800 bg-teal-50 font-bold border border-dotted border-gray-100 rounded-md">If there are records from student last term scores, they would be computed with this term.</small>}</div>

            {/* ASSIGNMENTS */}
            <div className="max-h-[65vh] space-y-3 overflow-y-auto p-5">

              {classList.length > 0 ? (
                classList.map((assignment, index) => (

                  <button
                    key={`${assignment.forClass?.classId}-${assignment.subject}-${index}`}
                    onClick={() => handleAssignmentSelect(assignment)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-400 hover:bg-slate-50"
                  >

                    <div className="flex items-center justify-between gap-3">

                      <div>
                        <p className="font-semibold text-slate-800">
                          {assignment.subject}
                          <span className="ml-2 text-sm font-medium text-slate-400">
                            ({assignment.abb})
                          </span>
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {assignment.forClass?.classId}
                        </p>
                      </div>

                      <span className="text-slate-400">
                        →
                      </span>

                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                      {assignment.faceView}
                    </p>

                  </button>

                ))
              ) : (
                <p className="py-8 text-center text-sm text-slate-500">
                  No subject assignments found.
                </p>
              )}

            </div>

            <div className="mt-5 flex justify-center border-t border-slate-100 pt-4">
  <button
    type="button"
    onClick={() => setShowGradeScale(true)}
    className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
  >
    View grading scale
  </button>
            </div>
          </div>
        </div>
      )}

      {showGradeScale && (
  <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
    <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">
            Grading Scale
          </h3>

          <p className="mt-0.5 text-xs text-slate-400">
            Current grading system
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowGradeScale(false)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          &times;
        </button>
      </div>

      {/* SCALE */}
      <div className="p-5">

        <div className="mb-4 flex items-center gap-2">
          <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
            {gradeSystem === gradeScaleI
              ? "Grade System I"
              : gradeSystem === gradeScaleII
              ? "Grade System II"
              : "Grade System III"}
          </span>

          <span className="text-[11px] text-slate-400">
            {gradeSystem.length} grading levels
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Score
                </th>

                <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Grade
                </th>

                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Remark
                </th>

                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Short
                </th>
              </tr>
            </thead>

            <tbody>
              {[...gradeSystem]
                .sort((a, b) => b.min - a.min)
                .map((item, index) => (
                  <tr
                    key={`${item.grade}-${index}`}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-600">
                      {item.min} – {item.max}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex min-w-[42px] justify-center rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                        {item.grade}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {item.remark}
                    </td>

                    <td className="px-4 py-3 text-xs text-slate-400">
                      {item.short}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* FOOTER */}
      <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-5 py-3">
        <button
          type="button"
          onClick={() => setShowGradeScale(false)}
          className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}

    </div>
  );
}
