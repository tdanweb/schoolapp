import React, { useEffect, useState } from "react";
import { Link, Outlet, useParams, useLocation } from "react-router-dom";
import { mainApi } from "../api";
import axios from "axios";
import { initialApplicants } from "../dataBase";
import UnderDevelopmentCard from "../components/UnderDev";

export function ManageApplicants() {
  const { id } = useParams(); // streamId or Session ID
  const location = useLocation();

  const isExamActive = location.pathname.includes("/exam");
  const isListActive = location.pathname.includes("/list");
  const isAdmitActive = location.pathname.includes("/admit")

  const [stream, setStream] = useState("");
  const [num, setNum] = useState(0)


  
  async function getAdmissionSettings(){
    try {
      const res = await axios.get(`${mainApi}/settings/admission`);
      console.log(res.data)
      const set = res.data.settings
      setStream(set.session)
      setNum(res.data.qts);
    } catch (error) {
      if(error.response){
        alert(error.response.data.msg)
      } else{
        alert("Network Error")
      }
    }
  }


useEffect(() => {

getAdmissionSettings();
  }, [])

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen space-y-6">
      {/* Header Section */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
            Manage Applicants
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Assign examination details, grade scores, and issue final admission numbers.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            TOTAL:
          </span>
          <span className="text-sm font-bold text-teal-800 font-lato">
            { num < 1 && "NIL"} {num > 0 && num}
          </span>
        </div>

        {/* User / Session Info Badge */}
        <div className="flex items-center gap-3 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Stream / Session:
          </span>
          <span className="text-sm font-bold text-teal-800 font-lato">
            {stream || "2026-2027"}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <Link
          to={`/app/user/manage-applicants/${id}/exam`}
          className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
            isExamActive
              ? "bg-amber-500 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          1. Seat & Schedule Setup
        </Link>
        <Link
          to={`/app/user/manage-applicants/${id}/list`}
          className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
            isListActive
              ? "bg-amber-500 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          2. Scores Upload
        </Link>
        <Link
          to={`/app/user/manage-applicants/${id}/admit`}
          className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
            isAdmitActive
              ? "bg-amber-500 text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          3. Admission
        </Link>
      </div>

      {/* Dynamic Outlet Component */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <Outlet />
      </div>
    </div>
  );
}

export function GiveAdmission(){
//..
  const [applicants, setApplicants] = useState(initialApplicants);

  return(
    <div>
      <UnderDevelopmentCard/>
    </div>
  )
}