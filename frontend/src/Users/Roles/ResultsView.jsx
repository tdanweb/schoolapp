//import "./ResultSheet.css";
import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import SaveResultPDF, { PaperView } from "../../components/ResultsSavePDF";
import { mainApi } from "../../api";
import axios from "axios";

const mockResult = {
  school: {
    name: "Achievers International Schools",
    motto: "For Outstanding Success with Discipline",
    crest: "/crest.png",
    address: "12 Excellence Avenue, Abuja, Nigeria",
    phone: "+234 800 000 0000",
    email: "info@achieversschools.com",
    website: "www.achieversschools.com",
    facebook: "@AchieversInternationalSchools",
    instagram: "@achieversschools",
  },

  term: "Third Term",
  session: "2025/2026",

  student: {
    passportUrl: "https://res.cloudinary.com/dqfmedorr/image/upload/v1787745994/app_uploads/kdklrlf5luymzmmilmfh.jpg",
    surname: "BETIKU",
    otherName: "Daniel Temidayo",
    admissionNo: "AIS/2023/0045",
    portalRegNo: "AIS-P-009821",
    gender: "Male",
    dob: "09 August 2010",
    className: "JSS 3",
    arm: "A",
    dateGenerated: "28 August 2026",
    checkerPin: "******78214",
    house: "Gold House",
    club: "Press Club",
  },

  results: [
    {
      subject: "Mathematics",
      ca1: 18,
      ca2: 17,
      exam: 58,
      lts: 82,
      grade: "A",
      remark: "Excellent",
      teacherSignature:
        "https://res.cloudinary.com/dqfmedorr/image/upload/w_120,h_60,c_fit,q_auto,f_auto/v1/sample.png",
    },
    {
      subject: "Digital Technology",
      ca1: 19,
      ca2: 18,
      exam: 57,
      lts: 88,
      grade: "A",
      remark: "Excellent",
      teacherSignature:
        "https://res.cloudinary.com/dqfmedorr/image/upload/w_120,h_60,c_fit,q_auto,f_auto/v1/sample.png",
    },
    {
      subject: "English Studies",
      ca1: 16,
      ca2: 18,
      exam: 52,
      lts: 76,
      grade: "B",
      remark: "Very Good",
      teacherSignature:
        "https://res.cloudinary.com/dqfmedorr/image/upload/w_120,h_60,c_fit,q_auto,f_auto/v1/sample.png",
    },
    {
      subject: "Basic Science",
      ca1: 17,
      ca2: 16,
      exam: 54,
      lts: 79,
      grade: "A",
      remark: "Excellent",
      teacherSignature:
        "https://res.cloudinary.com/dqfmedorr/image/upload/w_120,h_60,c_fit,q_auto,f_auto/v1/sample.png",
    },
    {
      subject: "Social Studies",
      ca1: 15,
      ca2: 16,
      exam: 48,
      lts: 72,
      grade: "B",
      remark: "Very Good",
      teacherSignature:
        "https://res.cloudinary.com/dqfmedorr/image/upload/w_120,h_60,c_fit,q_auto,f_auto/v1/sample.png",
    },
    {
      subject: "Computer Studies",
      ca1: 19,
      ca2: 18,
      exam: 57,
      lts: null,
      grade: "A",
      remark: "Excellent",
      teacherSignature:
        "https://res.cloudinary.com/dqfmedorr/image/upload/w_120,h_60,c_fit,q_auto,f_auto/v1/sample.png",
    },
    {
      subject: "Civic Education",
      ca1: 16,
      ca2: 15,
      exam: 51,
      lts: 74,
      grade: "B",
      remark: "Very Good",
      teacherSignature:
        "https://res.cloudinary.com/dqfmedorr/image/upload/w_120,h_60,c_fit,q_auto,f_auto/v1/sample.png",
    },
  ],

  psychomotor: {
    punctuality: "A",
    neatness: "A",
    handwriting: "B",
    sports: "A",
    creativity: "A",
    leadership: "B",
  },

  affective: {
    attentiveness: "A",
    cooperation: "A",
    honesty: "A",
    responsibility: "A",
    politeness: "B",
    selfControl: "A",
  },

  fees: {
    totalFee: 250000,
    paid: 180000,
    outstanding: 70000,
  },

  nextTermBegins: "14 September 2026",
  promotedTo: "SS 1",

  comments: {
    teacher:
      "Daniel has demonstrated remarkable improvement this term. He should continue with his excellent attitude towards learning.",
    principal:
      "A very impressive performance. Keep working hard and maintain this standard.",
    general:
      "We congratulate the student and wish him continued success.",
    teacherName: "Mrs. A. Johnson",
    principalName: "Dr. J. Williams",
    teacherSignature:
      "https://res.cloudinary.com/dqfmedorr/image/upload/w_160,h_70,c_fit,q_auto,f_auto/v1/sample.png",
    principalSignature:
      "https://res.cloudinary.com/dqfmedorr/image/upload/w_160,h_70,c_fit,q_auto,f_auto/v1/sample.png",
  },
};

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const getCaTotal = (result) => result.ca1 + result.ca2;

const getCurrentTotal = (result) =>
  getCaTotal(result) + result.exam;

const getFinalScore = (result) => {
  const current = getCurrentTotal(result);
  if (result.lts !== null && result.lts !== undefined) {
    return ((current + result.lts) / 2).toFixed(1);
  }

  return current;
};

const getOverallSummary = (results) => {
  const scores = results.map((result) => Number(getFinalScore(result)));

  const total = scores.reduce((sum, score) => sum + score, 0);
  const average = total / scores.length;

  let grade = "F";
  let rating = "Needs Improvement";
  let remark = "More effort is required.";

  if (average >= 80) {
    grade = "A";
    rating = "Excellent";
    remark = "Outstanding academic performance.";
  } else if (average >= 70) {
    grade = "B";
    rating = "Very Good";
    remark = "Very good academic performance.";
  } else if (average >= 60) {
    grade = "C";
    rating = "Good";
    remark = "Good academic performance.";
  } else if (average >= 50) {
    grade = "D";
    rating = "Fair";
    remark = "Fair performance. More effort is encouraged.";
  }

  return {
    total: total.toFixed(1),
    average: average.toFixed(1),
    rating,
    grade,
    remark,
  };
};

const RatingTable = ({ title, data }) => (
  <div className="flex-1">
    <h4 className="mb-2 bg-slate-900 px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-white">
      {title}
    </h4>

    <table className="w-full border-collapse text-[10px]">
      <tbody>
        {Object.entries(data).map(([key, value]) => (
          <tr key={key}>
            <td className="border border-slate-300 px-2 py-1.5 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </td>

            <td className="w-14 border border-slate-300 px-2 py-1.5 text-center font-bold">
              {value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Signature = ({ src, name }) => (
  <div className="flex min-h-14 flex-col items-center justify-end">
    {src && (
      <img
        src={src}
        alt="signature"
        className="mb-0.5 h-9 w-24 object-contain"
      />
    )}

    <div className="w-full border-t border-slate-400 pt-1 text-center text-[9px]">
      {name}
    </div>
  </div>
);


function ResultSheet({ data = mockResult }) {
  const summary = getOverallSummary(data.results);

  const totalFee =
    data.fees.totalFee ??
    data.fees.paid + data.fees.outstanding;

  const outstanding =
    data.fees.outstanding ??
    totalFee - data.fees.paid;

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 print:bg-white print:p-0">

      {/* A4 SHEET */}
      <div
        id="student-result-sheet"
        className="relative mx-auto w-full max-w-[794px] overflow-hidden bg-white text-slate-800 shadow-xl print:max-w-none print:shadow-none"
      >

        {/* WATERMARK */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <img
            src={data.school.crest}
            alt=""
            className="w-[430px] opacity-[0.035]"
          />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 p-7">

          {/* =====================================================
              S1 - SCHOOL HEADER
          ====================================================== */}
          <section className="grid grid-cols-[90px_1fr_190px] items-center gap-4 border-b-2 border-slate-800 pb-4">

            {/* Crest */}
            <div className="flex justify-center">
              <img
                src={data.school.crest}
                alt="School crest"
                className="h-20 w-20 object-contain"
              />
            </div>

            {/* School name */}
            <div className="text-center">
              <h1 className="text-xl font-black uppercase tracking-wide text-slate-900">
                {data.school.name}
              </h1>

              <p className="mt-1 text-[10px] italic">
                "{data.school.motto}"
              </p>

              <div className="mt-3 inline-flex gap-2 text-[10px] font-bold">
                <span className="rounded bg-slate-900 px-3 py-1 text-white">
                  {data.term}
                </span>

                <span className="rounded border border-slate-400 px-3 py-1">
                  {data.session}
                </span>
              </div>
            </div>

            {/* Address/contact */}
            <div className="text-right text-[9px] leading-4">
              <p>{data.school.address}</p>

              <p className="mt-1">
                ☎ {data.school.phone}
              </p>

              <p>✉ {data.school.email}</p>

              <p>🌐 {data.school.website}</p>

              <p className="mt-1">
                {data.school.facebook}
              </p>

              <p>{data.school.instagram}</p>
            </div>
          </section>

          {/* =====================================================
              S2 - STUDENT DETAILS
          ====================================================== */}
          <section className="mt-5">

            <div className="grid grid-cols-[100px_1fr_90px] gap-4">

              {/* Passport */}
              <div className="flex items-start justify-center">
                <img
                  src={data.student.passportUrl}
                  alt={data.student.surname}
                  className="h-28 w-24 rounded border-2 border-slate-300 object-cover"
                />
              </div>

              {/* Details */}
              <div>
                <h3 className="mb-2 border-b border-slate-300 pb-1 text-xs font-black uppercase">
                  Student Information
                </h3>

                <div className="grid grid-cols-2 gap-x-5 gap-y-1.5 text-[10px]">

                  <div>
                    <span className="font-bold">Surname:</span>{" "}
                    <span className="font-black uppercase">
                      {data.student.surname}
                    </span>
                  </div>

                  <div>
                    <span className="font-bold">Other Name:</span>{" "}
                    {data.student.otherName}
                  </div>

                  <div>
                    <span className="font-bold">Admission No:</span>{" "}
                    {data.student.admissionNo}
                  </div>

                  <div>
                    <span className="font-bold">Portal Reg. No:</span>{" "}
                    {data.student.portalRegNo}
                  </div>

                  <div>
                    <span className="font-bold">Gender:</span>{" "}
                    {data.student.gender}
                  </div>

                  <div>
                    <span className="font-bold">Date of Birth:</span>{" "}
                    {data.student.dob}
                  </div>

                  <div>
                    <span className="font-bold">Class:</span>{" "}
                    {data.student.className} ({data.student.arm})
                  </div>

                  <div>
                    <span className="font-bold">Generated:</span>{" "}
                    {data.student.dateGenerated}
                  </div>

                  <div>
                    <span className="font-bold">Checker PIN:</span>{" "}
                    {data.student.checkerPin}
                  </div>
                </div>
              </div>

              {/* QR / House */}
              <div className="flex flex-col items-center">

                <div className="border border-2 border-gray-200 p-1 rounded-md">
                  <QRCodeSVG
                    value={`https://aia-schools.com/r-doc/${data.student.portalRegNo}`}
                    size={72}
                    level="M"
                  />
                </div>

                <p className="mt-2 text-center text-[9px]">
                  <span className="font-bold">House:</span>{" "}
                  {data.student.house}
                </p>

                <p className="text-center text-[9px]">
                  <span className="font-bold">Club:</span>{" "}
                  {data.student.club}
                </p>
              </div>
            </div>
          </section>

          {/* =====================================================
              S3 - RESULT LABEL
          ====================================================== */}
          <section className="my-5">
            <div className="border-y-2 border-slate-900 py-2 text-center">
              <h2 className="text-sm font-black uppercase tracking-[0.2em]">
                Student End of Term Result
              </h2>
            </div>
          </section>

          {/* =====================================================
              S4 - MAIN RESULT TABLE
          ====================================================== */}
          <section>

            <table className="w-full border-collapse text-[9px]">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="border border-white px-2 py-2 text-left">
                    Subject
                  </th>

                  <th className="border border-white px-1">
                    CA1
                  </th>

                  <th className="border border-white px-1">
                    CA2
                  </th>

                  <th className="border border-white px-1">
                    CA Total
                  </th>

                  <th className="border border-white px-1">
                    Exam
                  </th>

                  <th className="border border-white px-1">
                    LTS
                  </th>

                  <th className="border border-white px-1">
                    Total Score
                  </th>

                  <th className="border border-white px-1">
                    Grade
                  </th>

                  <th className="border border-white px-2">
                    Remark
                  </th>

                  <th className="border border-white px-1">
                    Teacher
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.results.map((result, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-slate-50" : "bg-white"}
                  >
                    <td className="border border-slate-300 px-2 py-2 font-semibold">
                      {result.subject}
                    </td>

                    <td className="border border-slate-300 text-center">
                      {result.ca1}
                    </td>

                    <td className="border border-slate-300 text-center">
                      {result.ca2}
                    </td>

                    <td className="border border-slate-300 text-center font-semibold">
                      {getCaTotal(result)}
                    </td>

                    <td className="border border-slate-300 text-center">
                      {result.exam}
                    </td>

                    <td className="border border-slate-300 text-center">
                      {result.lts ?? "—"}
                    </td>

                    <td className="border border-slate-300 text-center font-bold">
                      {getFinalScore(result)}
                    </td>

                    <td className="border border-slate-300 text-center font-bold">
                      {result.grade}
                    </td>

                    <td className="border border-slate-300 px-2 text-center">
                      {result.remark}
                    </td>

                    <td className="border border-slate-300 text-center">
                      <img
                        src={result.teacherSignature}
                        alt="Teacher signature"
                        className="mx-auto h-7 w-16 object-contain"
                      />
                    </td>
                  </tr>
                ))}

                <tr className="bg-slate-900 font-black text-white">
                  <td
                    colSpan="6"
                    className="border border-white px-2 py-2 text-right"
                  >
                    TOTAL SCORE
                  </td>

                  <td className="border border-white text-center">
                    {summary.total}
                  </td>

                  <td
                    colSpan="3"
                    className="border border-white"
                  ></td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* =====================================================
              S5 - TRAITS + SUMMARY
          ====================================================== */}
          <section className="mt-6 grid grid-cols-[1fr_1fr_1fr] gap-4">

            {/* Psychomotor */}
            <RatingTable
              title="Psychomotor Skills"
              data={data.psychomotor}
            />

            {/* Affective */}
            <RatingTable
              title="Affective Traits"
              data={data.affective}
            />

            {/* Summary */}
            <div>
              <h4 className="mb-2 bg-slate-900 px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-white">
                Score Summary
              </h4>

              <table className="w-full border-collapse text-[10px]">
                <tbody>
                  <tr>
                    <td className="border border-slate-300 px-2 py-2 font-semibold">
                      Total
                    </td>
                    <td className="border border-slate-300 px-2 text-center font-bold">
                      {summary.total}
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-slate-300 px-2 py-2 font-semibold">
                      Average
                    </td>
                    <td className="border border-slate-300 px-2 text-center font-bold">
                      {summary.average}
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-slate-300 px-2 py-2 font-semibold">
                      Rating
                    </td>
                    <td className="border border-slate-300 px-2 text-center">
                      {summary.rating}
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-slate-300 px-2 py-2 font-semibold">
                      Grade
                    </td>
                    <td className="border border-slate-300 px-2 text-center font-black">
                      {summary.grade}
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-slate-300 px-2 py-2 font-semibold">
                      Remark
                    </td>
                    <td className="border border-slate-300 px-2 text-center">
                      {summary.remark}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* =====================================================
              S6 - FEES / PROMOTION / COMMENTS
          ====================================================== */}
          <section className="mt-6 grid grid-cols-[1fr_1fr_1.35fr] gap-4">

            {/* Fees */}
            <div>
              <h4 className="mb-2 bg-slate-900 px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-white">
                Fee Information
              </h4>

              <table className="w-full border-collapse text-[10px]">
                <tbody>
                  <tr>
                    <td className="border border-slate-300 px-2 py-2">
                      Total Fee
                    </td>
                    <td className="border border-slate-300 px-2 text-right font-bold">
                      {formatMoney(totalFee)}
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-slate-300 px-2 py-2">
                      Paid
                    </td>
                    <td className="border border-slate-300 px-2 text-right font-bold">
                      {formatMoney(data.fees.paid)}
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-slate-300 px-2 py-2">
                      Outstanding
                    </td>
                    <td className="border border-slate-300 px-2 text-right font-bold">
                      {formatMoney(outstanding)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Next term / promotion */}
            <div>
              <h4 className="mb-2 bg-slate-900 px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-white">
                Academic Information
              </h4>

              <div className="space-y-3 text-[10px]">

                <div className="border border-slate-300 p-2">
                  <p className="font-bold">
                    Next Term Begins
                  </p>

                  <p className="mt-1">
                    {data.nextTermBegins}
                  </p>
                </div>

                <div className="border border-slate-300 p-2">
                  <p className="font-bold">
                    Promoted To
                  </p>

                  <p className="mt-1 font-black">
                    {data.promotedTo || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div>
              <h4 className="mb-2 bg-slate-900 px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-white">
                Comments
              </h4>

              <div className="space-y-2 text-[9px] leading-4">

                <div>
                  <span className="font-black">
                    Class Teacher:
                  </span>{" "}
                  {data.comments.teacher}
                </div>

                <Signature
                  src={data.comments.teacherSignature}
                  name={data.comments.teacherName}
                />

                <div>
                  <span className="font-black">
                    Principal:
                  </span>{" "}
                  {data.comments.principal}
                </div>

                <Signature
                  src={data.comments.principalSignature}
                  name={data.comments.principalName}
                />

                <div>
                  <span className="font-black">
                    General:
                  </span>{" "}
                  {data.comments.general}
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              FOOTER
          ====================================================== */}
          <footer className="mt-7 border-t border-slate-300 pt-3 text-center text-[8px] text-slate-500">
            <p>
              © {new Date().getFullYear()} {data.school.name}. All rights
              reserved.
            </p>

            <p className="mt-1">
              Verify this result at{" "}
              <span className="font-bold text-slate-700">
                {data.school.website}/results
              </span>
            </p>
          </footer>

        </div>
      </div>
    </div>
  );

}

export default ResultSheet;

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
          console.log(res.data)
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
                        fileName="Daniel-Betiku-Term-Result.pdf"
                    />
                </div>
            }


            {/* ==========================================
                RESULT SHEET
            ========================================== */}
            {showResult &&
                // a data param would be passed in for result as resultData sheet
                <ResultSheet />
            }

        </div>
    );
}
export { ResultPage };