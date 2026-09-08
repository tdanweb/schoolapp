import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaIdCard,
  FaUser,
  FaGraduationCap,
  FaCheckCircle,
  FaExclamationCircle,
  FaFileAlt,
  FaTrophy,
  FaChair,
  FaBookOpen,
  FaTimes,
} from "react-icons/fa";
import { mainApi } from "../api";


// ======================================================
// ENTRANCE EXAM PORTAL
// ======================================================
export default function EntranceExam() {
  const [applicant, setApplicant] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getApplicant = async () => {
      try {
        setLoading(true);

        // Get logged applicant
        const loggedApplicant = JSON.parse(
          localStorage.getItem("logged-applicant")
        );

        const appId = loggedApplicant?.appId;

        if (!appId) {
          setError("Applicant data not found");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${mainApi}/applicant/${appId}`
        );

        setApplicant(response.data?.applicant || response.data);
      } catch (err) {
        console.error("Applicant fetch error:", err);

        setError(
          err.response?.status === 404
            ? "Applicant data not found"
            : "Unable to load applicant information"
        );
      } finally {
        setLoading(false);
      }
    };

    getApplicant();
  }, []);


  // ======================================================
  // FORMATTERS
  // ======================================================

  const formatDate = (date) => {
    if (!date) return "Not scheduled";

    return new Date(date).toLocaleDateString("en-NG", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "Not scheduled";

    return new Date(date).toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateOnly = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-700 rounded-full animate-spin mx-auto" />

          <p className="mt-3 text-sm text-gray-500">
            Loading applicant information...
          </p>
        </div>
      </div>
    );
  }


  // ======================================================
  // APPLICANT NOT FOUND
  // ======================================================

  if (!applicant) {
    return (
      <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-7 text-center">

          <div className="mx-auto w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <FaExclamationCircle size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-800">
            Applicant Data Not Found
          </h2>

          <p className="mt-2 text-sm text-gray-500 leading-6">
            We could not find your applicant registration data.
            Please register to continue.
          </p>

          <button
            onClick={() => {
              window.location.href = "/applicant/data";
            }}
            className="mt-6 w-full py-3 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold transition"
          >
            Register Now
          </button>
        </div>
      </div>
    );
  }


  // ======================================================
  // DATA
  // ======================================================

  const exam = applicant.examinationDetails || {};
  const academic = applicant.academic || {};
  const contact = applicant.contact || {};


  // ======================================================
  // STATUS
  // ======================================================

  const examStatus = exam.status?.toLowerCase();

  const isPending =
    examStatus === "pending" ||
    !exam.examDate;

  const isCompleted =
    examStatus === "completed" ||
    examStatus === "passed" ||
    examStatus === "failed";


  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-5 py-5">

      {/* ==================================================
          SCHOOL HEADER
      ================================================== */}

      <div className="bg-gradient-to-r from-teal-900 to-teal-700 rounded-t-2xl text-white overflow-hidden">

        <div className="px-4 sm:px-6 py-4 flex items-center gap-3">

          <img
            src="/crest.png"
            alt="School crest"
            className="w-14 h-14 sm:w-16 sm:h-16 object-contain bg-white rounded-full p-1"
          />

          <div className="flex-1">
            <h1 className="text-base sm:text-xl font-bold">
              Achievers International Schools
            </h1>

            <p className="text-[10px] sm:text-xs text-teal-100 mt-1">
              ENTRANCE EXAMINATION PORTAL
            </p>
          </div>

          <div className="hidden sm:block">
            <FaGraduationCap size={30} />
          </div>

        </div>
      </div>


      {/* ==================================================
          APPLICANT MINI PROFILE
      ================================================== */}

      <div className="bg-white border-x border-gray-200 px-4 sm:px-6 py-4">

        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">

          <img
            src={applicant.passportUrl || "/passport.png"}
            alt={applicant.fullName}
            className="w-24 h-28 object-cover rounded-lg border-2 border-teal-700 shadow"
          />

          <div className="flex-1 text-center sm:text-left">

            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              {applicant.fullName || "Applicant"}
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Registration No:
              <span className="font-bold text-teal-700 ml-1">
                {applicant.regNo || "N/A"}
              </span>
            </p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">

              <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-[10px] font-semibold">
                {academic.classOnAdmission || "Class N/A"}
              </span>

              <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-semibold">
                {academic.arm ? `Arm ${academic.arm}` : "Arm N/A"}
              </span>

              <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-semibold">
                {academic.session || "Session N/A"}
              </span>

            </div>
          </div>

        </div>
      </div>


      {/* ==================================================
          TABS
      ================================================== */}

      <div className="bg-white border border-gray-200 border-t-0 px-2 sm:px-4">

        <div className="grid grid-cols-3 gap-1">

          <TabButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            icon={<FaBookOpen />}
            label="Overview"
          />

          <TabButton
            active={activeTab === "schedule"}
            onClick={() => setActiveTab("schedule")}
            icon={<FaCalendarAlt />}
            label="Schedule"
          />

          <TabButton
            active={activeTab === "result"}
            onClick={() => setActiveTab("result")}
            icon={<FaTrophy />}
            label="Result"
          />

        </div>
      </div>


      {/* ==================================================
          CONTENT
      ================================================== */}

      <div className="bg-gray-50 border border-gray-200 border-t-0 rounded-b-2xl p-3 sm:p-5">


        {/* ==================================================
            OVERVIEW
        ================================================== */}

        {activeTab === "overview" && (
          <div className="space-y-4">

            {/* Exam Status */}

            <div className="bg-white rounded-xl border p-4">

              <div className="flex items-center justify-between gap-3">

                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-semibold">
                    Examination Status
                  </p>

                  <h3 className="text-lg font-bold text-gray-800 capitalize mt-1">
                    {exam.status || "Pending"}
                  </h3>
                </div>

                <StatusBadge status={exam.status} />

              </div>
            </div>


            {/* Schedule */}

            <ScheduleCard exam={exam} />


            {/* Result */}

            <ResultCard
              exam={exam}
              completed={isCompleted}
            />

          </div>
        )}


        {/* ==================================================
            SCHEDULE
        ================================================== */}

        {activeTab === "schedule" && (
          <ScheduleCard
            exam={exam}
            detailed
          />
        )}


        {/* ==================================================
            RESULT
        ================================================== */}

        {activeTab === "result" && (
          <ResultCard
            exam={exam}
            completed={isCompleted}
            detailed
          />
        )}

      </div>

    </div>
  );
}


// ======================================================
// TAB BUTTON
// ======================================================

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center gap-2
        py-3 px-2
        text-[11px] sm:text-xs
        font-semibold
        border-b-2
        transition
        ${
          active
            ? "text-teal-700 border-teal-700 bg-teal-50"
            : "text-gray-500 border-transparent hover:text-teal-600"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}


// ======================================================
// SCHEDULE CARD
// ======================================================

function ScheduleCard({ exam, detailed = false }) {

  const scheduled = !!exam.examDate;

  const date = scheduled
    ? new Date(exam.examDate)
    : null;

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

      <div className="bg-teal-50 px-4 py-3 border-b">
        <div className="flex items-center gap-2 text-teal-800">
          <FaCalendarAlt />
          <h3 className="font-bold text-sm">
            Entrance Examination Schedule
          </h3>
        </div>
      </div>

      <div className="p-4">

        {!scheduled ? (
          <div className="py-8 text-center">

            <div className="mx-auto w-14 h-14 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center">
              <FaClock size={24} />
            </div>

            <h4 className="mt-4 font-bold text-gray-800">
              Examination Not Yet Scheduled
            </h4>

            <p className="text-xs text-gray-500 mt-1">
              Your examination date and venue will appear here once
              they are assigned.
            </p>

          </div>
        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

            <InfoBox
              icon={<FaCalendarAlt />}
              title="Date"
              value={date.toLocaleDateString("en-NG", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            />

            <InfoBox
              icon={<FaClock />}
              title="Time"
              value={ "08:00 AM" || date.toLocaleTimeString("en-NG", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />

            <InfoBox
              icon={<FaMapMarkerAlt />}
              title="Venue"
              value={exam.examVenue || "To be announced"}
            />

            <InfoBox
              icon={<FaChair />}
              title="Seat No."
              value={exam.seatNo || "Not assigned"}
            />

          </div>
        )}

        {detailed && scheduled && (
          <div className="mt-5 pt-4 border-t">

            <h4 className="text-xs font-bold text-gray-700 mb-3">
              Applicant Examination Information
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

              <Detail
                label="Full Name"
                value={exam.fullName}
              />

              <Detail
                label="Reg. No"
                value={exam.regNo}
              />

              <Detail
                label="Admission No"
                value={exam.admissionNo || "Pending"}
              />

              <Detail
                label="Class"
                value={exam.classOnAdmission}
              />

              <Detail
                label="Arm"
                value={exam.arm}
              />

              <Detail
                label="Session"
                value={exam.session}
              />

            </div>
          </div>
        )}

      </div>
    </div>
  );
}


// ======================================================
// RESULT CARD
// ======================================================

function ResultCard({ exam, completed, detailed = false }) {

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

      <div className="bg-blue-50 px-4 py-3 border-b">

        <div className="flex items-center gap-2 text-blue-800">
          <FaFileAlt />
          <h3 className="font-bold text-sm">
            Examination Result & Report
          </h3>
        </div>

      </div>

      <div className="p-4">

        {!completed ? (

          <div className="py-7 text-center">

            <div className="mx-auto w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <FaFileAlt size={23} />
            </div>

            <h4 className="mt-4 font-bold text-gray-800">
              Result Not Available
            </h4>

            <p className="text-xs text-gray-500 mt-1">
              Your examination report will appear here after the
              examination has been completed and processed.
            </p>

          </div>

        ) : (

          <>
            <div className="grid grid-cols-2 gap-3">

              <div className="bg-teal-50 rounded-xl p-4 text-center">

                <p className="text-[10px] uppercase text-gray-500 font-semibold">
                  Score
                </p>

                <p className="text-3xl font-black text-teal-700 mt-1">
                  {exam.score ?? 0}
                </p>

              </div>


              <div className="bg-blue-50 rounded-xl p-4 text-center">

                <p className="text-[10px] uppercase text-gray-500 font-semibold">
                  Rating
                </p>

                <p className="text-3xl font-black text-blue-700 mt-1">
                  {exam.rating ?? 0}
                </p>

              </div>

            </div>


            <div className="mt-4 flex items-center justify-center gap-2">

              <StatusBadge status={exam.status} />

            </div>


            {detailed && (
              <div className="mt-5 pt-4 border-t">

                <h4 className="font-bold text-sm text-gray-800">
                  Examination Report
                </h4>

                <p className="text-sm text-gray-600 mt-2 leading-6">
                  {exam.report ||
                    "No examination report has been provided yet."}
                </p>

              </div>
            )}

          </>

        )}

      </div>
    </div>
  );
}


// ======================================================
// INFO BOX
// ======================================================

function InfoBox({ icon, title, value }) {
  return (
    <div className="border rounded-lg p-3 bg-gray-50">

      <div className="flex items-center gap-2 text-teal-700">
        {icon}

        <span className="text-[10px] uppercase font-bold text-gray-500">
          {title}
        </span>
      </div>

      <p className="text-xs sm:text-sm font-bold text-gray-800 mt-2">
        {value || "N/A"}
      </p>

    </div>
  );
}


// ======================================================
// DETAIL
// ======================================================

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-[9px] uppercase text-gray-400 font-bold">
        {label}
      </p>

      <p className="text-xs font-semibold text-gray-700 mt-1">
        {value || "N/A"}
      </p>
    </div>
  );
}


// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({ status }) {

  const value = status?.toLowerCase() || "pending";

  let style = "bg-yellow-50 text-yellow-700 border-yellow-200";
  let icon = <FaExclamationCircle />;

  if (
    value === "passed" ||
    value === "successful" ||
    value === "completed"
  ) {
    style = "bg-green-50 text-green-700 border-green-200";
    icon = <FaCheckCircle />;
  }

  if (value === "failed") {
    style = "bg-red-50 text-red-700 border-red-200";
    icon = <FaTimes />;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold capitalize ${style}`}
    >
      {icon}
      {value}
    </span>
  );
}