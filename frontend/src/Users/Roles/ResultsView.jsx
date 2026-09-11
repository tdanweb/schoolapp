//import "./ResultSheet.css";
import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

import SaveResultPDF, { PaperView } from "../../components/ResultsSavePDF";
import { mainApi } from "../../api";
import axios from "axios";


// main Portal
function ResultPage() {


    // ==========================================
    // RESULT CHECKING PARAMS
    // ==========================================
    const [admissionNo, setAdmissionNo] = useState("");
    const [term, setTerm] = useState("");
    const [session, setSession] = useState("");
    const [pin, setPin] = useState("");

    const [setups, setSetups] = useState(null);
    const [thisTerm, setThisTerm] = useState(null)
    const [allTerms, setAllTerms] = useState([]);
    const [currTerms, setCurrTerms] = useState([])
    
    const setAvailTerms = (e) => {
      const val = e.target.value;
      const filter = allTerms.filter(k => k.session === val);
      setCurrTerms(filter);
      setSession(val)
    }
    const [ msg, setMsg ] = useState("")
    const [sessions, setSessions] = useState([])
    // include data as StudentResultData later to fetch from backend
    const [showResult, setShowResult] = useState(false);
    const [resultData, setResultData] = useState(null);
    const [studentId, setStudentId] = useState("")


    async function getResultData() {

        // ==========================================
        // BUILD CHECKING PARAMS
        // ==========================================
        const params = new URLSearchParams ({
            admissionNo: admissionNo.trim(),
            term,
            session,
            checkerPin: pin.trim(),
        });
        console.log("Result checking params:", params);

        // fetch result from backend here later
        console.log("fetching results......");

        const url = `${mainApi}/student/result?${params.toString()}`
        //fetching bock
        try {
          const res = await axios.get(url)
          setResultData(res.data)

          const name = res.data.student.personalInfo
          setStudentId(`${admissionNo}-${name.surname.toUpperCase()} ${name.otherName} ${term} term, ${session} Session Results.pdf`);
          setShowResult(true)
        } catch (error) {
          if(error.response){
            console.log(error.response.data)
          } else{
            alert("Network Error... Try Again Later")
          }
        }  
    }

async function getSetting() {
  const api = `${mainApi}/setting`
  
  try {
    const res = await axios.get(api)
    const data = res.data;
    console.log(data)
    setAllTerms(data.terms)
    const filter = data.terms.map(s => s.session).filter(
      (name, i, arr) => arr.indexOf(name) === i);
    setSessions(filter)
    setSetups(data.settings.setUps);
    setThisTerm(data.termSetting);
  } catch (error) {
    if(error.response){
      setMsg(error.response.data.msg)
    } else {
      setMsg("Network Error, cannot get web settings")
    }
  }
}


useEffect(()  => {
  getSetting();
}, [])


    return (
        <div>

            {/* ==========================================
                RESULT CHECKER
            ========================================== */}
            {!showResult && (
                <section className="relative overflow-hidden rounded-xl min-h-[520px] flex items-center justify-center">

                    {/* BACKGROUND */}
                    <div
                        className="
                            absolute
                            inset-0
                            bg-cover
                            bg-center
                            scale-105
                        "
                        style={{
                            backgroundImage: "url('/exam-hall.jpg')",
                            filter: "blur(2px)",
                        }}
                    />

                    {/* SUBTLE OVERLAY */}
                    <div className="absolute inset-0 bg-slate-900/35" />


                    {/* FORM CARD */}
                    <div
                        className="
                            relative
                            z-10
                            w-[calc(100%-2rem)]
                            max-w-md
                            my-8
                            rounded-2xl
                            border
                            border-white/30
                            bg-white/95
                            shadow-2xl
                            overflow-hidden
                        "
                    >

                        {/* FORM HEADER */}
                        <div className="px-6 pt-7 pb-5 text-center">

                            {/* CREST */}
                            <div
                                className="
                                    mx-auto
                                    mb-4
                                    h-20
                                    w-20
                                    rounded-full
                                    bg-white
                                    p-1
                                    shadow-md
                                    ring-1
                                    ring-slate-200
                                "
                            >
                                <img
                                    src="/crest.png"
                                    alt="Achievers International Schools crest"
                                    className="
                                        h-full
                                        w-full
                                        rounded-full
                                        object-cover
                                    "
                                />
                            </div>


                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                Achievers International Schools
                            </p>

                            <h1 className="mt-1 text-2xl font-bold text-slate-800">
                                RESULT CHECKING PORTAL
                            </h1>

                            <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                Enter your details below to access your academic
                                result.
                            </p>

<div
  className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
    thisTerm?.resultsPublished
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-amber-200 bg-amber-50 text-amber-700"
  }`}
>
  <div className="flex items-start gap-3">
    <i
      className={`fa-solid mt-0.5 ${
        thisTerm?.resultsPublished
          ? "fa-circle-check"
          : "fa-circle-info"
      }`}
    />

    <div>
      <p className="font-semibold">
        {thisTerm?.resultsPublished
          ? "Results Available"
          : "The Term Result is Not Yet Published"}
      </p>

      <p className="mt-1 leading-5">
        {thisTerm?.resultsPublished
          ? `The ${thisTerm?.termName} Term, ${thisTerm?.session.replace("-", "/")} session results are now available for checking.`
          : `The ${thisTerm?.termName} Term, ${thisTerm?.session.replace("-", "/")} session results have not been published yet. You can check for previous terms.`}
      </p>
    </div>
  </div>
</div>
                        </div>


                        {/* FORM */}

                        {setups?.resultsViewing &&
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                getResultData();
                            }}
                            className="px-6 pb-7"
                        >

                            {/* ADMISSION NUMBER */}
                            <div className="mb-4">

                                <label
                                    htmlFor="admissionNo"
                                    className="
                                        mb-1.5
                                        block
                                        text-xs
                                        font-bold
                                        text-slate-600
                                    "
                                >
                                    Admission Number
                                </label>

                                <input
                                    id="admissionNo"
                                    type="text"
                                    value={admissionNo}
                                    onChange={(e) =>
                                        setAdmissionNo(e.target.value)
                                    }
                                    placeholder="Enter admission number"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        px-4
                                        py-3
                                        text-sm
                                        text-slate-700
                                        outline-none
                                        transition
                                        placeholder:text-slate-400
                                        focus:border-slate-500
                                        focus:bg-white
                                        focus:ring-2
                                        focus:ring-slate-200
                                    "
                                    required
                                />

                            </div>


                            {/* TERM + SESSION */}
                            <div className="grid grid-cols-2 gap-3 mb-4">

                                {/* TERM */}
                                <div>

                                    <label
                                        htmlFor="term"
                                        className="
                                            mb-1.5
                                            block
                                            text-xs
                                            font-bold
                                            text-slate-600
                                        "
                                    >
                                        Term
                                    </label>

                                    <select
                                        id="term"
                                        value={term}
                                        onChange={(e) =>
                                            setTerm(e.target.value)
                                        }
                                        className="
                                            w-full
                                            rounded-lg
                                            border
                                            border-slate-200
                                            bg-slate-50
                                            px-3
                                            py-3
                                            text-sm
                                            text-slate-700
                                            outline-none
                                            focus:border-slate-500
                                            focus:bg-white
                                            focus:ring-2
                                            focus:ring-slate-200
                                        "
                                        required
                                    >
                                        <option value="">
                                            Select term
                                        </option>
                                        {currTerms?.map((item) => (<option value={item.termName}>{item.termName} Term</option>))}
                                    </select>

                                </div>


                                {/* SESSION */}
                                <div>

                                    <label
                                        htmlFor="session"
                                        className="
                                            mb-1.5
                                            block
                                            text-xs
                                            font-bold
                                            text-slate-600
                                        "
                                    >
                                        Session
                                    </label>

                                    <select
                                        id="session"
                                        value={session}
                                        onChange={setAvailTerms}
                                        className="
                                            w-full
                                            rounded-lg
                                            border
                                            border-slate-200
                                            bg-slate-50
                                            px-3
                                            py-3
                                            text-sm
                                            text-slate-700
                                            outline-none
                                            focus:border-slate-500
                                            focus:bg-white
                                            focus:ring-2
                                            focus:ring-slate-200
                                        "
                                        required
                                    >
                                        <option value="">
                                            Select session
                                        </option>

                                        {sessions?.map((item) => (<option value={item}>{item.replace("-", "/")}</option>))}
                                    </select>

                                </div>

                            </div>


                            {/* PIN */}
                            <div className="mb-5">

                                <label
                                    htmlFor="pin"
                                    className="
                                        mb-1.5
                                        block
                                        text-xs
                                        font-bold
                                        text-slate-600
                                    "
                                >
                                    Result Checking PIN
                                </label>

                                <input
                                    id="pin"
                                    type="text"
                                    value={pin}
                                    onChange={(e) =>
                                        setPin(e.target.value)
                                    }
                                    placeholder="Enter your result PIN"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        px-4
                                        py-3
                                        font-mono
                                        text-sm
                                        tracking-wider
                                        text-slate-700
                                        outline-none
                                        transition
                                        placeholder:font-sans
                                        placeholder:tracking-normal
                                        placeholder:text-slate-400
                                        focus:border-slate-500
                                        focus:bg-white
                                        focus:ring-2
                                        focus:ring-slate-200
                                    "
                                    required
                                />

                            </div>


                            {/* SUBMIT */}
                            <button
                                type="submit"
                                className="
                                    w-full
                                    rounded-lg
                                    bg-slate-800
                                    px-4
                                    py-3
                                    text-sm
                                    font-bold
                                    text-white
                                    shadow-sm
                                    transition
                                    hover:bg-slate-700
                                    active:scale-[0.99]
                                "
                            >
                                Check Result
                            </button>


                            {/* NOTE */}
                            <p className="mt-4 text-center text-[10px] leading-relaxed text-slate-400">
                                Enter the details exactly as provided by the
                                school. Your PIN is required to access your result.
                            </p>

                        </form>
}
{
  !setups?.resultsViewing && (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl">
        🔒
      </div>

      <h3 className="mb-2 text-lg font-semibold text-slate-800">
        Results Currently Unavailable
      </h3>

      <p className="text-sm leading-6 text-slate-600">
        Results viewing is temporarily unavailable while the portal is under
        maintenance. Please check back later or contact the school
        administration for assistance.
      </p>
    </div>
  )
}

</div>

                </section>
            )}


            {/* ==========================================
                SAVE RESULT
            ========================================== */}
            {showResult &&
                <div className="mb-5 flex justify-end">
                    <SaveResultPDF
                        targetId="student-result-sheet"
                        fileName={studentId || "results.pdf"}
                    />
                </div>
            }


            {/* ==========================================
                RESULT SHEET
            ========================================== */}
            {
      
    showResult &&
                // a data param would be passed in for result as resultData sheet
           <ResultViewer resultData={resultData} checkPin={pin} 
            header={{
                address: "GRA, Abuja Avenue, Jos Nigeria.",
                contact: "0800 000 0000",
                email: "school@email.com",
                website: "www.acheivers-school.com"
                }}/>
            }

        </div>
    );
}
export { ResultPage };



//main viewer
function ResultViewer({
  resultData,
  checkPin,
  header = {},
}) {
  if (!resultData) {
    return null;
  }

  const {
    student,
    studentClass,
    term,
    results = [],
    otherRecords,
  } = resultData;

  const personalInfo = student?.personalInfo || {};

  const currentFee = student?.currentFee?.find(
    (fee) =>
      fee.session === term?.session &&
      fee.term === term?.termName
  );

  const totalFee = currentFee?.total ?? 0;
  const paid = currentFee?.paid ?? 0;
  const outstanding = Math.max(totalFee - paid, 0);

  const formatDate = (date) => {
    if (!date) return "";

    const value = new Date(date);

    return value.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const displayedPin = "******" + checkPin?.slice(-5) || "";

const qrData = JSON.stringify({
    regNo: student?.regNo || "",
    name: `${personalInfo.surname || ""} ${personalInfo.firstName || ""}`,
    pin: displayedPin,
  });


  return (
    <div className="result-page">

      {/* A4 RESULT SHEET */}
      <div className="result-sheet" id="student-result-sheet">

        {/* =========================
            SCHOOL HEADER
        ========================== */}
        <header className="result-header">

          <div className="school-logo-wrapper">
            <img
              src="/crest.png"
              alt="School Crest"
              className="school-crest"
            />
          </div>

          <div className="school-header-content">

            <h1 className="school-name">
              Achievers International Schools
            </h1>

            <p className="school-motto">
              For Outstanding Success with Discipline
            </p>

            {header.address && (
              <p className="school-contact">
                {header.address}
              </p>
            )}

            <div className="school-contact-row">

              {header.contact && (
                <span>{header.contact}</span>
              )}

              {header.email && (
                <span>{header.email}</span>
              )}

              {header.website && (
                <span>{header.website}</span>
              )}

            </div>

          </div>

        </header>

<div className="watermark-container">
  <img
    src="/crest.png" /* Make sure this path to your crest is correct */
    alt="Watermark Crest"
    className="watermark-crest"
  />
</div>
        {/* =========================
            RESULT TITLE
        ========================== */}
        <section className="result-title-section">

          <div>
            <h2>STUDENT ACADEMIC REPORT</h2>

            <p>
              {term?.termName || ""} Term Result
            </p>
          </div>

          <div className="result-session">
            <span>Session</span>
            <strong>
              {term?.session || ""}
            </strong>
          </div>

        </section>

{/* =========================
    STUDENT INFORMATION
========================== */}
<section className="student-section">

  {/* PASSPORT - LEFT */}
  <div className="student-passport">

    {student?.passportUrl ? (
      <img
        src={student.passportUrl}
        alt="Student"
      />
    ) : (
      <div className="passport-placeholder">
        PASSPORT
      </div>
    )}

  </div>


  {/* STUDENT DETAILS - MIDDLE */}
  <div className="student-details">

    <div className="student-detail-row">
      <span>Student Name</span>
      <strong>
        {personalInfo.surname}{" "}
        {personalInfo.firstName}{" "}
        {personalInfo.otherName}
      </strong>
    </div>

    <div className="student-detail-row">
      <span>Admission No.</span>
      <strong>
        {otherRecords?.admissionNo || ""}
      </strong>
    </div>

    <div className="student-detail-row">
      <span>Portal Reg. No.</span>
      <strong>
        {student?.regNo || ""}
      </strong>
    </div>

    <div className="student-detail-row">
      <span>Gender</span>
      <strong>
        {personalInfo.gender || ""}
      </strong>
    </div>

    <div className="student-detail-row">
      <span>Date of Birth</span>
      <strong>
        {formatDate(personalInfo.dob)}
      </strong>
    </div>

    <div className="student-detail-row">
      <span>Class</span>
      <strong>
        {student?.realClassNow?.mainClass ||
          studentClass?.mainClass ||
          ""}
      </strong>
    </div>

    <div className="student-detail-row">
      <span>Arm</span>
      <strong>
        {student?.realClassNow?.arm || ""}
      </strong>
    </div>

    <div className="student-detail-row">
      <span>Club/House</span>
      <strong>
        {student?.club_house || ""}
      </strong>
    </div>

  </div>


  {/* QR - RIGHT */}
  <div className="student-qr">

    <div className="qr-box">
      <QRCodeSVG
        value={otherRecords?.admissionNo || ""}
        size={90}
      />
    </div>

    <div className="qr-info">
      <span>Admission No.</span>
      <strong>
        {otherRecords?.admissionNo || ""}
      </strong>
    </div>

  </div>

</section>


        {/* =========================
            PIN / RESULT STATUS
        ========================== */}
        <section className="result-meta">

          <div>
            <span>Result PIN</span>
            <strong>{displayedPin}</strong>
          </div>

          <div>
          </div>

        </section>


        {/* =========================
            SUBJECT RESULTS
        ========================== */}
        <section className="results-section">

          <div className="section-heading">
            <h3>ACADEMIC PERFORMANCE</h3>
          </div>

          <table className="results-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Subject</th>
                <th>CA 1</th>
                <th>CA 2</th>
                <th>Exam</th>
                <th>Total</th>
                <th>Grade</th>
                <th>Remark</th>
              </tr>
            </thead>

            <tbody>

              {results.map((result, index) => (

                <tr key={result._id || index}>

                  <td>{index + 1}</td>

                  <td className="subject-name">
                    {result.subject}
                  </td>

                  <td>{result.ca1 ?? 0}</td>

                  <td>{result.ca2 ?? 0}</td>

                  <td>{result.exam ?? 0}</td>

                  <td>
                    <strong>
                      {result.total ?? 0}
                    </strong>
                  </td>

                  <td>
                    <strong>
                      {result.grade || "-"}
                    </strong>
                  </td>

                  <td>
                    {result.remark || "-"}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </section>


        {/* =========================
            TRAITS
        ========================== */}
        <section className="traits-section">

          <div className="trait-card">

            <h3>PSYCHOMOTOR SKILLS</h3>

            <div className="trait-list">

              {Object.entries(
                otherRecords?.psychoScores || {}
              ).map(([key, value]) => (

                <div
                  className="trait-row"
                  key={key}
                >
                  <span>{key}</span>
                  <strong>{value}</strong>
                </div>

              ))}

            </div>

          </div>


          <div className="trait-card">

            <h3>AFFECTIVE DOMAIN</h3>

            <div className="trait-list">

              {Object.entries(
                otherRecords?.affectiveScores || {}
              ).map(([key, value]) => (

                <div
                  className="trait-row"
                  key={key}
                >
                  <span>{key}</span>
                  <strong>{value}</strong>
                </div>

              ))}

            </div>

          </div>

        </section>


        {/* =========================
            FEE INFORMATION
        ========================== */}
        <section className="fee-section">

          <div className="section-heading">
            <h3>FEE INFORMATION</h3>
          </div>

          <div className="fee-grid">

            <div>
              <span>Total Fee</span>
              <strong>
                ₦{totalFee.toLocaleString()}
              </strong>
            </div>

            <div>
              <span>Paid</span>
              <strong>
                ₦{paid.toLocaleString()}
              </strong>
            </div>

            <div>
              <span>Outstanding</span>
              <strong>
                ₦{outstanding.toLocaleString()}
              </strong>
            </div>

          </div>

        </section>


        {/* =========================
            ACADEMIC INFORMATION
        ========================== */}
        <section className="academic-info">

          <div>
            <span>Promotion</span>

            <strong>
              {otherRecords?.promotion || "NIL"}
            </strong>
          </div>

          <div>
            <span>Next Term Begins</span>

            <strong>
              —
            </strong>
          </div>

        </section>


        {/* =========================
            COMMENTS
        ========================== */}
        <section className="comments-section">

          <div className="section-heading">
            <h3>COMMENTS</h3>
          </div>


          <div className="comment-box">

            <h4>Class Teacher's Comment</h4>

            <p>
              {otherRecords?.teacherComment?.text ||
                "No comment"}
            </p>

            {otherRecords?.teacherComment?.signature && (
              <div className="comment-signature">
                Signature:{" "}
                {otherRecords.teacherComment.signature}
              </div>
            )}

          </div>


          <div className="comment-box">

            <h4>Principal's Comment</h4>

            <p>
              {otherRecords?.principalComment?.text ||
                "No comment"}
            </p>

            {otherRecords?.principalComment?.signature && (
              <div className="comment-signature">
                Signature:{" "}
                {otherRecords.principalComment.signature}
              </div>
            )}

          </div>


          {otherRecords?.generalComment && (
            <div className="comment-box">

              <h4>General Comment</h4>

              <p>
                {otherRecords.generalComment}
              </p>

            </div>
          )}

        </section>


        {/* =========================
            FOOTER
        ========================== */}
        <footer className="result-footer">

          <span>
            Generated: {formatDate(otherRecords?.createdAt)}
          </span>

          <span>
            Official School Result
          </span>

        </footer>

      </div>

    </div>
  );
}
