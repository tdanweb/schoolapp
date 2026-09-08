import React, { useEffect, useState } from "react";
import { initialApplicants } from "../../dataBase";
import axios from "axios";
import { mainApi } from "../../api";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export function AssignExamDetails() {
  
  const [applicants, setApplicants] = useState(initialApplicants);

  // Bulk Controls State
  const [bulkDate, setBulkDate] = useState("Saturday, Aug 15, 2026");
  const [bulkVenue, setBulkVenue] = useState("Main Hall A");
  const [seatPrefix, setSeatPrefix] = useState("");
  const [startingSeatNo, setStartingSeatNo] = useState(101);

  const [stream, setStream] = useState("")

  // Apply Bulk Settings to all applicants
  const handleApplyBulk = (e) => {
    e.preventDefault();
    const updated = applicants.map((app, index) => ({
      ...app,
      examinationDetails: {
        ...app.examinationDetails,
        examDate: bulkDate,
        examVenue: bulkVenue,
        seatNo: `${seatPrefix}${startingSeatNo + index}`,
      },
    }));
    setApplicants(updated);
  };

  // Handle individual row field change
  const handleRowChange = (index, field, value) => {
    const updated = [...applicants];
    updated[index].examinationDetails[field] = value;
    setApplicants(updated);
  };

  //Pagination
  const [page, setPage] = useState(1); 
  const [pagination, setpagination] = useState({});
  const [load2, setload2] = useState(false);
  const limit = 25

  //fetching applicants
  async function getApplicants(pg){
    try {
      const res = await axios.get(`${mainApi}/applicants/all?page=${pg}&limit=${limit}`);
     // alert(res.data.msg);
     // console.log(res.data)
      setpagination(res.data.pagination)
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
    getApplicants(page);
  }, []);

  const [alertMsg, setAlertMsg] = useState("")
  async function submitRecord(){
   // console.log(applicants);
    if(!applicants || applicants.length < 1) return;
    console.log(applicants)
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


  const btn = "flex items-center gap-2 p-1 text-white rounded-md bg-amber-600"
  
  return (
    <div className="space-y-6">
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
      {/* Top Bulk Action Bar */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="flex items-center gap-4 justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          Bulk Assignment Controls
        </h3>
        {applicants.length > 0 &&
        <div className="my-4 p-1">
          <button className="w-full cursor-pointer p-2 rounded-md text-center text-white bg-sky-700" onClick={submitRecord}>Save Records</button>
        </div>
        }
        </div>
        {/* Paging 
        <div className="flex p-2 bg-gray-100 my-2 text-slate-700 bg-gray-100 cursor-pointer rounded-md">
          {pagination.hasPrevPage && <div className={`${btn} `}> <FaArrowLeft size={12}/> PREV</div>}
          {pager(pagination).map((item) => (<div className={`${btn} ${item === page && "bg-amber-700 text-white " }`}>{item}</div>))}
          {pagination.hasNextPage && <div className={`${btn} `}> NEXT <FaArrowRight size={12}/> </div>}
        </div>
        */}
        <form
          onSubmit={handleApplyBulk}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end"
        >
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Exam Date
            </label>
            <input
              type="text"
              value={bulkDate}
              onChange={(e) => setBulkDate(e.target.value)}
              placeholder="e.g. Aug 15, 2026"
              className="w-full text-xs px-3 py-2 rounded border border-slate-300 focus:outline-teal-700"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Exam Venue
            </label>
            <input
              type="text"
              value={bulkVenue}
              onChange={(e) => setBulkVenue(e.target.value)}
              placeholder="e.g. Hall A"
              className="w-full text-xs px-3 py-2 rounded border border-slate-300 focus:outline-teal-700"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Seat Prefix
            </label>
            <input
              type="text"
              value={seatPrefix}
              onChange={(e) => setSeatPrefix(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded border border-slate-300 focus:outline-teal-700"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Start Seat #
            </label>
            <input
              type="number"
              value={startingSeatNo}
              onChange={(e) => setStartingSeatNo(Number(e.target.value))}
              className="w-full text-xs px-3 py-2 rounded border border-slate-300 focus:outline-teal-700"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs py-2 px-4 rounded transition-all shadow"
          >
            Apply to All
          </button>
        </form>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
            <tr>
              <th className="p-3">Reg No</th>
              <th className="p-3">Full Name</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Exam Date</th>
              <th className="p-3">Exam Venue</th>
              <th className="p-3">Seat No</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {applicants.map((app, index) => (
              <tr key={app._id} className="hover:bg-slate-50 transition">
                <td className="p-3 font-mono font-bold text-teal-900">
                  {app.regNo}
                </td>
                <td className="p-3 font-semibold">{app.fullName}</td>
                <td className="p-3">{app.gender}</td>
                <td className="p-3">
                  <input
                    type="text"
                    value={app.examinationDetails.examDate}
                    onChange={(e) =>
                      handleRowChange(index, "examDate", e.target.value)
                    }
                    className="w-full px-2 py-1 border border-slate-200 rounded focus:border-teal-700 text-xs"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="text"
                    value={app.examinationDetails.examVenue}
                    onChange={(e) =>
                      handleRowChange(index, "examVenue", e.target.value)
                    }
                    className="w-full px-2 py-1 border border-slate-200 rounded focus:border-teal-700 text-xs"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="text"
                    value={app.examinationDetails.seatNo}
                    onChange={(e) =>
                      handleRowChange(index, "seatNo", e.target.value)
                    }
                    className="w-full px-2 py-1 font-mono font-semibold border border-slate-200 rounded focus:border-teal-700 text-xs bg-amber-50/50"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}


const pager = ({param}) => {
  let pages = [];
  for(let p=0; p<param.totalPages; p++){
    pages.push[p+1]
  };
  return pages;
}