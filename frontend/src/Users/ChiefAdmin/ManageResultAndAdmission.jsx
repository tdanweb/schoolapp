import React, { useEffect, useState } from "react";
import { initialApplicants } from "../../dataBase";
import axios from "axios";
import { mainApi } from "../../api";
import { FaUpload } from "react-icons/fa";

export function ManageResultsAndAdmission() {
  const [maxSc, setMaxSc] = useState(250)
  const [applicants, setApplicants] = useState(initialApplicants);

  // Update specific fields per row
  const handleScoreChange = (index, value) => {
    const updated = [...applicants];
    const isAbsent = value.toString().toLowerCase() === "absent";

    updated[index].examinationDetails.score = isAbsent ? 0 : Number(value);
    updated[index].examinationDetails.status = isAbsent ? "absent" : "result out";
    updated[index].examinationDetails.rating = isAbsent ? 0 : Number((Number(value)/maxSc * 100).toFixed(2))
    setApplicants(updated);
  };

  const handleStatusChange = (index, newStatus) => {
    const updated = [...applicants];
    updated[index].status = newStatus;

    // Auto generate admission number if admitted and currently empty
    if (newStatus === "admitted" && !updated[index].admissionNo) {
      updated[index].admissionNo = `ADM/2026/${Math.floor(
        100 + Math.random() * 900
      )}`;
    }
    setApplicants(updated);
  };

  const handleAdmissionNoChange = (index, value) => {
    const updated = [...applicants];
    updated[index].admissionNo = value;
    setApplicants(updated);
  };

  //fetching applicants
  async function getApplicants(){
    try {
      const res = await axios.get(`${mainApi}/applicants/all`);
      console.log(res.data)
      setApplicants(res.data.applicants)
    } catch (error) {
      if(error.response){
        alert(error.response.data.msg)
      } else {
        alert("Network Error!")
      }
    }
  }

  useEffect(() => {
    getApplicants();
  }, []);

  const Upload2 = async () => {
    try {
      console.log(applicants)
    } catch (error) {
      if(error.response){
        alert(error.response.data.msg)
      } else {
        alert("Network Error!")
      } 
    }
  }

  const [alertMsg, setAlertMsg] = useState("")
  async function Upload(){
    //console.log(applicants);
    if(!applicants || applicants.length < 1) return;

    try {
      const res = await axios.put(`${mainApi}/applicants/assign`, applicants);
      setAlertMsg(res.data.msg)
    } catch (error) {
      if(error.response){
        setAlertMsg(error.response.data.msg)
      } else{
        setAlertMsg("Network/Server Error")
      }
    }
  }
  return (
    <div className="space-y-4">
{alertMsg && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
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
      <div className="flex justify-between items-center">
        <p className="text-xs text-slate-500">
          Enter score percentage or mark <span className="font-bold text-red-600 font-mono">absent</span>. 
        </p>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left text-xs border-collapse min-w-[750px]">
          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
            <tr>
              <th className="p-3">Reg No</th>
              <th className="p-3">Full Name</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Ex. Score ({maxSc})</th>
              <th className="p-3">Rating (%) </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {applicants.map((app, index) => {
              const isAbsent = app.examinationDetails.status === "absent";

              return (
                <tr key={app._id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-mono font-bold text-teal-900">
                    {app.regNo}
                  </td>
                  <td className="p-3 font-semibold">{app.fullName}</td>
                  <td className="p-3">{app.gender}</td>

                  {/* Exam Score / Absent */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={
                          isAbsent ? "ABSENT" : app.examinationDetails.score
                        }
                        onChange={(e) =>
                          handleScoreChange(index, e.target.value)
                        }
                        className={`w-20 px-2 py-1 rounded border font-semibold text-xs text-center ${
                          isAbsent
                            ? "bg-red-50 text-red-700 border-red-300 font-bold"
                            : "border-slate-200 focus:border-teal-700"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleScoreChange(index, isAbsent ? 0 : "absent")
                        }
                        className="text-[10px] text-slate-500 hover:text-slate-800 underline"
                      >
                        {isAbsent ? "Unmark" : "Mark Absent"}
                      </button>
                    </div>
                  </td>

                  {/* Admission Status 
                  <td className="p-3">
                    <select
                      value={app.status}
                      onChange={(e) =>
                        handleStatusChange(index, e.target.value)
                      }
                      className={`px-2.5 py-1 rounded text-xs font-bold border capitalize focus:outline-none ${
                        app.status === "admitted"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : app.status === "not admitted"
                          ? "bg-red-50 text-red-800 border-red-300"
                          : app.status === "processing"
                          ? "bg-sky-50 text-sky-800 border-sky-300"
                          : "bg-amber-50 text-amber-800 border-amber-300"
                      }`}
                    >
                      <option value="under review">under review</option>
                      <option value="processing">processing</option>
                      <option value="admitted">admitted</option>
                      <option value="not admitted">not admitted</option>
                    </select>
                  </td>
                  */}

                  {/* Admission No */}
                  <td className="p-3">
                    <input
                      type="text"
                      disabled={true}
                      value={app.examinationDetails.rating}
                      onChange={(e) =>
                        handleAdmissionNoChange(index, e.target.value)
                      }
                      placeholder={
                        app.status === "admitted"
                          ? "Enter / Generated No"
                          : "N/A"
                      }
                      className={`text-center px-2 py-1 font-mono text-xs rounded border border-gray-200 w-fit`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <hr/>
      <button onClick={Upload}
      className="mt-4 p-2 flex items-center gap-4 rounded-md border border-gray-300 text-white shadow-lg cursor-pointer bg-sky-700">Upload Results <FaUpload size={18}/> </button>
    </div>
  );
}


export function ManageAdmission() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  // =========================
  // GET APPLICANTS
  // =========================
  async function getApplicants() {
    setLoading(true);

    try {
      const res = await axios.get(`${mainApi}/applicants/all`);

      console.log("APPLICANTS:");
      console.log(res.data);

      setApplicants(res.data.applicants || []);

    } catch (error) {
      if (error.response) {
        setAlertMsg(error.response.data.msg);
      } else {
        setAlertMsg("Network Error!");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getApplicants();
  }, []);


  // =========================
  // CHANGE ADMISSION STATUS
  // =========================
  const handleAdmissionStatusChange = (index, value) => {
    const updated = [...applicants];

    updated[index] = {
      ...updated[index],
      admissionStatus: value,

      // Set admission date only when admitted
      admissionDate:
        value === "admitted"
          ? updated[index].admissionDate || new Date().toISOString()
          : "",
    };

    setApplicants(updated);
  };


  // =========================
  // PROCESS ADMISSION
  // =========================
  const handleAdmission = async () => {

    if (!applicants || applicants.length < 1) {
      setAlertMsg("No applicants available.");
      return;
    }

    const finalApplicants = applicants.map((app) => ({
      ...app,

      admissionDate:
        app.admissionStatus === "admitted"
          ? app.admissionDate || new Date().toISOString()
          : "",
    }));



    try {
      const api = `${mainApi}/applicants/admission?token=${JSON.parse(localStorage.getItem("logged-user")).token}`
      const res= await axios.put(api, finalApplicants);
      console.log(res.data);
      setAlertMsg(res.data.msg)
      setApplicants(finalApplicants)
    } catch (error) {
      if(error.response){
        setAlertMsg(error.response.data.msg)
      } else{
        setAlertMsg("Network/Server Error!")
      }      

    }
  };


  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-NG", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };


  return (
    <div className="space-y-5">

      {/* =========================
          ALERT
      ========================= */}
      {alertMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">

            {/* Close */}
            <button
              type="button"
              onClick={() => setAlertMsg("")}
              className="absolute right-4 top-3 text-2xl font-bold text-gray-400 hover:text-gray-800"
            >
              &times;
            </button>

            {/* Crest */}
            <img
              src="/crest.png"
              alt="School Crest"
              className="mx-auto mb-4 h-20 w-20 object-contain"
            />

            <p className="text-sm text-gray-700">
              {alertMsg}
            </p>

          </div>

        </div>
      )}


      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Admission Processing
          </h2>

          <p className="text-xs text-slate-500">
            Review applicants and make admission decisions.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs shadow-sm">

          <span className="text-slate-500">
            Applicants
          </span>

          <span className="ml-2 font-bold text-slate-800">
            {applicants.length}
          </span>

        </div>

      </div>


      {/* =========================
          LOADING
      ========================= */}
      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">

          <p className="text-sm text-slate-500">
            Loading applicants...
          </p>

        </div>
      )}


      {/* =========================
          EMPTY STATE
      ========================= */}
      {!loading && applicants.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">

          <p className="text-sm font-medium text-slate-600">
            No applicants available.
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Applicants will appear here when available.
          </p>

        </div>
      )}


      {/* =========================
          APPLICANTS TABLE
      ========================= */}
      {!loading && applicants.length > 0 && (

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">

          <table className="w-full min-w-[1050px] border-collapse text-left text-xs">

            {/* TABLE HEADER */}
            <thead className="border-b border-slate-200 bg-slate-100 text-[11px] font-bold uppercase tracking-wide text-slate-600">

              <tr>

                <th className="p-3">
                  Reg No
                </th>

                <th className="p-3">
                  Applicant
                </th>

                <th className="p-3">
                  Gender
                </th>

                <th className="p-3">
                  Exam Score
                </th>

                <th className="p-3">
                  Rating
                </th>

                <th className="p-3">
                  Exam Status
                </th>

                <th className="p-3">
                  Admission Status
                </th>

                <th className="p-3">
                  Admission Date
                </th>

              </tr>

            </thead>


            {/* TABLE BODY */}
            <tbody className="divide-y divide-slate-200">

              {applicants.map((app, index) => {

                const exam = app.examinationDetails || {};

                const admissionStatus =
                  app.admissionStatus || "under review";

                const isAdmitted =
                  admissionStatus === "admitted";

                const isNotAdmitted =
                  admissionStatus === "not admitted";

                const isProcessing =
                  admissionStatus === "processing";

                return (

                  <tr
                    key={app._id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* REG NO */}
                    <td className="p-3">

                      <span className="font-mono font-bold text-sky-800">
                        {app.regNo}
                      </span>

                    </td>


                    {/* APPLICANT */}
                    <td className="p-3">

                      <div>

                        <p className="font-semibold text-slate-800">
                          {app.fullName}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {app._id}
                        </p>

                      </div>

                    </td>


                    {/* GENDER */}
                    <td className="p-3 capitalize">
                      {app.gender || "—"}
                    </td>


                    {/* EXAM SCORE */}
                    <td className="p-3">

                      <span
                        className={
                          exam.status === "absent"
                            ? "font-bold text-red-600"
                            : "font-bold text-slate-700"
                        }
                      >
                        {exam.status === "absent"
                          ? "ABSENT"
                          : exam.score ?? 0}
                      </span>

                    </td>


                    {/* RATING */}
                    <td className="p-3">

                      <span className="font-bold text-slate-700">
                        {exam.rating ?? 0}%
                      </span>

                    </td>


                    {/* EXAM STATUS */}
                    <td className="p-3">

                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold capitalize
                        ${
                          exam.status === "result out"
                            ? "bg-emerald-50 text-emerald-700"

                            : exam.status === "absent"
                            ? "bg-red-50 text-red-700"

                            : exam.status === "awaiting result"
                            ? "bg-amber-50 text-amber-700"

                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {exam.status || "pending"}
                      </span>

                    </td>


                    {/* ADMISSION STATUS */}
                    <td className="p-3">

                      <select
                        value={admissionStatus}
                        onChange={(e) =>
                          handleAdmissionStatusChange(
                            index,
                            e.target.value
                          )
                        }
                        className={`rounded-md border px-3 py-2 text-xs font-bold capitalize outline-none
                        ${
                          isAdmitted
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700"

                            : isNotAdmitted
                            ? "border-red-300 bg-red-50 text-red-700"

                            : isProcessing
                            ? "border-sky-300 bg-sky-50 text-sky-700"

                            : "border-amber-300 bg-amber-50 text-amber-700"
                        }`}
                      >

                        <option value="under review">
                          Under Review
                        </option>

                        <option value="processing">
                          Processing
                        </option>

                        <option value="admitted">
                          Admitted
                        </option>

                        <option value="not admitted">
                          Not Admitted
                        </option>

                      </select>

                    </td>


                    {/* ADMISSION DATE */}
                    <td className="p-3">

                      {isAdmitted ? (

                        <div>

                          <p className="font-semibold text-emerald-700">
                            {formatDate(
                              app.admissionDate || new Date()
                            )}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-400">
                            Admission date
                          </p>

                        </div>

                      ) : (

                        <span className="text-slate-400">
                          —
                        </span>

                      )}

                    </td>

                  </tr>

                );
              })}

            </tbody>

          </table>

        </div>

      )}


      {/* =========================
          BOTTOM ACTION
      ========================= */}
      {applicants.length > 0 && (

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-slate-500">
            Changes are currently prepared locally.
          </p>

          <button
            type="button"
            onClick={handleAdmission}
            className="rounded-lg bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 active:scale-[0.98]"
          >
            Process Admission
          </button>

        </div>

      )}

    </div>
  );
}