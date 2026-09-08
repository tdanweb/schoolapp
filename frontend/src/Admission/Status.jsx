import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaMoneyBillWave,
  FaPrint,
  FaGraduationCap,
  FaExclamationCircle,
} from "react-icons/fa";
import { mainApi } from "../api";

export default function AdmissionStatus() {
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        const logged = JSON.parse(
          localStorage.getItem("logged-applicant")
        );

        const appId = logged?.appId;

        if (!appId) return;

        const res = await axios.get(
          `${mainApi}/applicant/${appId}`
        );

        setApplicant(res.data?.applicant || res.data);
      } catch (error) {
        console.error("Failed to fetch applicant:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicant();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-9 h-9 border-4 border-teal-200 border-t-teal-700 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 mt-3">
            Checking admission status...
          </p>
        </div>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-7 max-w-sm w-full text-center shadow-xl">
          <FaExclamationCircle
            className="mx-auto text-red-500"
            size={40}
          />

          <h2 className="font-bold text-lg mt-4">
            Applicant Data Not Found
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Please register as an applicant to access this portal.
          </p>

          <button
            onClick={() => (window.location.href = "/applicant/data")}
            className="mt-5 bg-teal-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold"
          >
           Quick Register Now
          </button>
        </div>
      </div>
    );
  }

  const exam = applicant.examinationDetails || {};
  const academic = applicant.academic || {};

  const status = applicant.status?.toLowerCase() || "under review";

  const admitted = status === "admitted" ||  status === "approved" || status === "accepted";
  const absent = status === "absent"

  const statusStyle = admitted
    ? "bg-green-50 text-green-700 border-green-200"
    : status === "rejected"
    ? "bg-red-50 text-red-700 border-red-200"
    : "bg-yellow-50 text-yellow-700 border-yellow-200";

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-5 py-5">

      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 to-teal-700 text-white rounded-t-2xl p-4 flex items-center gap-3">
        <img
          src="/crest.png"
          className="w-14 h-14 bg-white rounded-full p-1 object-contain"
          alt="School crest"
        />

        <div>
          <h1 className="font-bold text-lg">
            Achievers International Schools
          </h1>

          <p className="text-[10px] text-teal-100">
            ADMISSION STATUS PORTAL
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-b-2xl shadow-sm">

        {/* Applicant */}
        <div className="p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4">

          <img
            src={applicant.passportUrl || "/passport.png"}
            alt={applicant.fullName}
            className="w-24 h-28 object-cover rounded-lg border-2 border-teal-700"
          />

          <div className="flex-1 text-center sm:text-left">

            <h2 className="text-xl font-bold text-gray-800">
              {applicant.fullName}
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Registration No:{" "}
              <b className="text-teal-700">
                {applicant.regNo || "N/A"}
              </b>
            </p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">

              <span className="px-3 py-1 rounded-full bg-gray-100 text-[10px] font-semibold">
                {applicant.gender || "Gender N/A"}
              </span>

              <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-[10px] font-semibold">
                {academic.classOnAdmission || "Class N/A"}
              </span>

              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold">
                {academic.session || "Session N/A"}
              </span>

            </div>
          </div>
        </div>


        {/* Admission Status */}
        <div className="mx-4 sm:mx-5 mb-4">

          <div className={`border rounded-xl p-5 ${statusStyle}`}>

            <div className="flex items-center gap-3">

              {admitted ? (
                <FaCheckCircle size={28} />
              ) : (
                <FaClock size={28} />
              )}

              <div>
                <p className="text-[10px] uppercase font-bold">
                  Admission Status
                </p>

                <h2 className="text-xl font-black capitalize">
                  {status}
                </h2>
              </div>

            </div>

            {admitted && (
              <p className="text-xs mt-3 leading-5">
                Congratulations! You have been offered admission.
                Please print your admission letter and complete your
                acceptance fee payment to proceed with admission.
              </p>
            )}

          </div>
        </div>


        {/* Exam + Class */}
        <div className="px-4 sm:px-5 pb-5 grid grid-cols-2 gap-3">

          <div className="border rounded-xl p-4 bg-gray-50">

            <FaGraduationCap className="text-teal-700" />

            <p className="text-[9px] uppercase text-gray-400 font-bold mt-2">
              Class Applied For
            </p>

            <p className="font-bold text-gray-800 mt-1">
              {academic.classOnAdmission || "N/A"}
            </p>

          </div>

          <div className="border rounded-xl p-4 bg-gray-50">

            <FaFileAlt className="text-blue-700" />

            <p className="text-[9px] uppercase text-gray-400 font-bold mt-2">
              Entrance Exam Score
            </p>

            <p className="font-bold text-gray-800 mt-1">
              {exam.score ?? 0}
              {exam.rating != null && (<span className="text-xs text-gray-400 ml-1"> / Rating {exam.rating}% </span> )}
              {absent && <span className="block my-1 text-xs text-red-600 font-poppins bg-red-100 p-1 rounded-lg">You were absent from this Exam.</span>}
            </p>


          </div>

        </div>


        {/* Admission Actions */}
        {admitted && (
          <div className="border-t bg-gray-50 p-4 sm:p-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <button
                onClick={() =>
                  window.open(
                    `/admission-letter/${applicant._id}`,
                    "_blank"
                  )
                }
                className="flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg py-3 text-sm font-bold transition"
              >
                <FaPrint />
                Print Admission Letter
              </button>

              <button
                onClick={() =>
                  window.location.href = `/acceptance-fee/${applicant._id}`
                }
                className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg py-3 text-sm font-bold transition"
              >
                <FaMoneyBillWave />
                Pay Acceptance Fee
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}