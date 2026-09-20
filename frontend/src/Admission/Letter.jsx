import SaveResultPDF from "../components/ResultsSavePDF";

import { useParams } from "react-router-dom";
import { mainApi } from "../api";
import axios from "axios";
import React, { useEffect, useState } from "react";


export default function AdmissionLetter () {
 const {id} = useParams();

 const [data, setData] = useState(null)

 async function getApplicant() {
    const api = `${mainApi}/applicant/letter/${id}`
    
    try {
        const res = await axios.get(api);
        setData(res.data.student);
      //  console.log(res.data)
    } catch (error) {
        if(error.response){
            alert(error.response.data.msg)
        } else{
            alert("Network/Server Error....")
        }
    }
 }

 useEffect(() => {
    getApplicant()
 }, [])

 //return letter template... with print option... or pdf save

 return <div>
         {data &&
                <div className="mb-5 flex justify-end">
                    <SaveResultPDF
                        targetId="admission-letter"
                        fileName={`${data.admissionNo}-${data.fullName} letter.pdf` || "results.pdf"}
                    />
                </div>
}

    {data && <Letter applicantData={data}/>}
 </div>
}




import { QRCodeSVG } from "qrcode.react";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  CalendarDays,
} from "lucide-react";


function Letter({ applicantData }) {
  const student = applicantData || {};

  const schoolName = "ACHIEVERS INTERNATIONAL SCHOOLS";
  const schoolAddress = "22, GRA Avenue, Garki Abuja, Nigeria";
  const schoolMotto = "Excellence, Discipline & Leadership";

  // Change these to your actual school contacts
  const schoolPhone = "0800 000 0000";
  const schoolEmail = "info@achieversschool.edu.ng";
  const schoolWebsite = "www.achieversschool.edu.ng";

  const classAdmitted =
    student?.academic?.classOnAdmission || "N/A";

  const arm = student?.academic?.arm || "";

  const session =
    student?.academic?.session ||
    student?.streamId ||
    "2026/2027";

  const term =
    student?.academic?.term || "First";

  const admissionNo =
    student?.admissionNo || "Pending";

  const dateAdmitted = student?.dateAdmitted
    ? new Date(student.dateAdmitted).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  const dob = student?.dob
    ? new Date(student.dob).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  const acceptanceDeadline = new Date(
    new Date(student?.dateAdmitted || new Date()).getTime() +
      20 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // These can later come from your backend/database
  const totalFee =
    student?.expectedFee?.total ||
    student?.feeDetails?.total ||
    0;

  const seventyPercent =
    totalFee > 0 ? Math.round(totalFee * 0.7) : 0;

  const balance =
    totalFee > 0 ? totalFee - seventyPercent : 0;

  const formatMoney = (amount) => {
    if (!amount) return "—";

    return `₦${Number(amount).toLocaleString("en-NG")}`;
  };

  // QR can later point directly to your verification route
  const verificationValue = `${window.location.origin}/verify-admission/${admissionNo}`;

  return (
<>
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Inter:wght@400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap');

      /* Page Shell & Printing Setup */
      #admission-letter {
        width: 210mm;
        min-height: 297mm;
        margin: 0 auto;
        background: #525659;
        box-sizing: border-box;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: #1e293b;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      #admission-letter * {
        box-sizing: border-box;
      }
.letter-date {
  text-align: right;
  margin: 25px 0 20px;
  font-size: 14px;
  font-weight: 500;
}
      .admission-page {
        width: 210mm;
        height: 297mm;
        padding: 12mm 16mm 18mm;
        position: relative;
        background: #ffffff;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
        margin: 0 auto;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      }

      /* Subtle Security Pattern Border */
      .admission-page::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 6px;
        background: linear-gradient(90deg, #0f2b48 0%, #063b6d 50%, #d6a82f 50%, #f3c649 100%);
      }

      /* Watermark */
      .admission-watermark {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        z-index: 0;
        opacity: 0.03;
      }

      .admission-watermark img {
        width: 140mm;
        height: 140mm;
        object-fit: contain;
        filter: grayscale(100%);
      }

      /* Content Stack */
      .admission-content {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      /* Header Layout */
      .header {
        display: flex;
        align-items: center;
        gap: 20px;
        padding-bottom: 12px;
        border-bottom: 2px solid #063b6d;
        position: relative;
      }

      .header::after {
        content: "";
        position: absolute;
        bottom: -5px;
        left: 0;
        right: 0;
        height: 1px;
        background: #d6a82f;
      }

      .crest {
        width: 82px;
        height: 82px;
        object-fit: contain;
        flex-shrink: 0;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.06));
      }

      .header-text {
        flex: 1;
        text-align: center;
      }

      .school-name {
        font-family: 'Cinzel', serif;
        font-size: 22px;
        font-weight: 800;
        letter-spacing: 0.8px;
        color: #063b6d;
        margin: 0;
        text-transform: uppercase;
        line-height: 1.15;
      }

      .school-address {
        font-size: 10.5px;
        margin-top: 4px;
        color: #475569;
        font-weight: 500;
        letter-spacing: 0.2px;
      }

      .motto {
        font-family: 'Merriweather', serif;
        font-size: 11px;
        font-style: italic;
        font-weight: 400;
        color: #b18415;
        margin-top: 5px;
        letter-spacing: 0.3px;
      }

      /* Stream Bar */
      .stream-section {
        margin-top: 10px;
        display: grid;
        grid-template-columns: 1fr 1.3fr 1fr;
        gap: 12px;
        align-items: center;
      }

      .stream-box {
        border: 1px solid #cbd5e1;
        padding: 5px 10px;
        border-radius: 4px;
        background: #f8fafc;
        font-size: 10px;
        color: #334155;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      .stream-box strong {
        color: #063b6d;
        font-weight: 700;
      }

      /* Title Banner */
      .letter-title {
        text-align: center;
        margin: 12px 0 10px;
        padding: 8px 12px;
        background: linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%);
        border-top: 1px solid #063b6d;
        border-bottom: 2px solid #063b6d;
        border-radius: 2px;
      }

      .letter-title h1 {
        margin: 0;
        font-family: 'Cinzel', serif;
        font-size: 17px;
        font-weight: 700;
        color: #063b6d;
        letter-spacing: 1.5px;
      }

      .letter-title p {
        margin: 2px 0 0;
        font-size: 9.5px;
        color: #b18415;
        font-weight: 700;
        letter-spacing: 1px;
      }

      /* Student Info Area */
      .student-area {
        display: grid;
        grid-template-columns: 1fr 110px;
        gap: 14px;
        align-items: start;
      }

      .details-box {
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        overflow: hidden;
        background: #ffffff;
      }

      .section-heading {
        background: #063b6d;
        color: #ffffff;
        font-weight: 700;
        font-size: 10px;
        padding: 5px 10px;
        letter-spacing: 0.8px;
        text-transform: uppercase;
      }

      .details-grid {
        display: grid;
        grid-template-columns: 135px 1fr;
        font-size: 10px;
      }

      .detail-label,
      .detail-value {
        padding: 4px 8px;
        border-bottom: 1px solid #f1f5f9;
        line-height: 1.3;
      }

      .details-grid > div:nth-last-child(-n+2) {
        border-bottom: none;
      }

      .detail-label {
        font-weight: 600;
        color: #475569;
        background: #f8fafc;
        border-right: 1px solid #f1f5f9;
      }

      .detail-value {
        color: #0f172a;
        font-weight: 500;
      }

      .photo-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }

      .passport {
        width: 95px;
        height: 112px;
        object-fit: cover;
        border: 2px solid #063b6d;
        border-radius: 3px;
        background: #f1f5f9;
        box-shadow: 0 2px 4px rgba(0,0,0,0.08);
      }

      .qr-box {
        text-align: center;
        background: #f8fafc;
        padding: 5px;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .qr-box svg {
        width: 68px;
        height: 68px;
      }

      .qr-text {
        font-size: 7.5px;
        color: #64748b;
        margin-top: 3px;
        font-weight: 600;
        letter-spacing: 0.2px;
        text-transform: uppercase;
      }

      /* Letter Content */
      .letter-body {
        margin-top: 10px;
        font-family: 'Merriweather', Georgia, serif;
        font-size: 10.5px;
        line-height: 1.55;
        color: #1e293b;
      }

      .letter-body p {
        margin: 0 0 7px;
        text-align: justify;
      }

      .dear {
        font-weight: 700;
        font-size: 11.5px;
        color: #063b6d;
        margin-bottom: 6px !important;
      }

      .important {
        font-weight: 700;
        color: #9a6c00;
        text-decoration: underline;
        text-decoration-color: #d6a82f;
      }

      .fee-heading {
        margin-top: 8px;
        font-family: 'Inter', sans-serif;
        font-size: 10.5px;
        font-weight: 800;
        color: #063b6d;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }

      .fee-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 4px;
        font-family: 'Inter', sans-serif;
        font-size: 9.5px;
      }

      .fee-table th {
        background: #063b6d;
        color: #ffffff;
        padding: 5px 8px;
        border: 1px solid #063b6d;
        font-weight: 600;
        letter-spacing: 0.3px;
        text-transform: uppercase;
      }

      .fee-table td {
        padding: 5px 8px;
        border: 1px solid #cbd5e1;
        text-align: center;
        color: #0f172a;
      }

      .fee-note {
        margin-top: 6px;
        padding: 6px 10px;
        border-left: 3px solid #d6a82f;
        background: #fffdf5;
        border-right: 1px solid #fef3c7;
        border-top: 1px solid #fef3c7;
        border-bottom: 1px solid #fef3c7;
        font-size: 9px;
        line-height: 1.4;
        font-family: 'Inter', sans-serif;
        color: #451a03;
        border-radius: 0 4px 4px 0;
      }

      .closing {
        margin-top: 10px;
        font-family: 'Merriweather', Georgia, serif;
        font-size: 10.5px;
        line-height: 1.4;
      }

      .signature-area {
        margin-top: 4px;
        width: 180px;
      }

      .signature {
        width: 90px;
        height: 40px;
        object-fit: contain;
        object-position: left bottom;
        display: block;
      }

      .principal-name {
        font-family: 'Inter', sans-serif;
        font-weight: 700;
        font-size: 10.5px;
        color: #063b6d;
        margin-top: 2px;
      }

      .principal-title {
        font-family: 'Inter', sans-serif;
        font-size: 8.5px;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 600;
      }

      /* Fixed Document Footer */
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: #063b6d;
  color: white;
  padding: 8px 14mm 9px;
  font-size: 8px;
  box-sizing: border-box;
}

      .footer-main {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
        flex-wrap: nowrap;
      }

      .footer-item {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #f1f5f9;
        white-space: nowrap;
      }

      .footer-item svg {
        width: 10px;
        height: 10px;
        color: #f3c649;
        flex-shrink: 0;
      }

      .footer-bottom {
        text-align: center;
        margin-top: 4px;
        padding-top: 4px;
        border-top: 1px solid rgba(255,255,255,0.15);
        color: #cbd5e1;
        font-size: 7.5px;
        letter-spacing: 0.2px;
      }

      /* Page Break and Print Enhancements */
      @media print {
        @page {
          size: A4 portrait;
          margin: 0;
        }

        html, body {
          width: 210mm;
          height: 297mm;
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        #admission-letter {
          width: 210mm !important;
          height: 297mm !important;
          margin: 0 !important;
          padding: 0 !important;
          box-shadow: none !important;
          background: #ffffff !important;
        }

        .admission-page {
          width: 210mm !important;
          height: 297mm !important;
          margin: 0 !important;
          box-shadow: none !important;
          page-break-after: avoid !important;
          page-break-inside: avoid !important;
        }
      }
    `}
  </style>

  <div id="admission-letter">
    <div className="admission-page">

      {/* WATERMARK */}
      <div className="admission-watermark">
        <img src="/crest.png" alt="" />
      </div>

      <div className="admission-content">

        {/* HEADER */}
        <div className="header">
          <img
            src="/crest.png"
            alt="School Crest"
            className="crest"
          />

          <div className="header-text">
            <h2 className="school-name">
              {schoolName}
            </h2>

            <div className="school-address">
              {schoolAddress}
            </div>

            <div className="motto">
              "{schoolMotto}"
            </div>
          </div>
        </div>

        {/* SESSION INFORMATION */}
        <div className="stream-section">
          <div className="stream-box">
            <strong>Stream:</strong> {student?.streamId || session}
          </div>

          <div className="stream-box" style={{ textAlign: "center" }}>
            <strong>Academic Session:</strong> {session}
          </div>

          <div className="stream-box" style={{ textAlign: "right" }}>
            <strong>Term:</strong> {term}
          </div>
        </div>

        {/* TITLE */}
        <div className="letter-title">
          <h1>OFFER OF PROVISIONAL ADMISSION</h1>
          <p>
            PROVISIONAL ADMISSION LETTER • {session}
          </p>
        </div>

<p className="letter-date">
  {new Date().toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })}
</p>
        {/* STUDENT INFORMATION */}
        <div className="student-area">

          <div className="details-box">
            <div className="section-heading">
              STUDENT DETAILS
            </div>

            <div className="details-grid">

              <div className="detail-label">
                Full Name
              </div>
              <div className="detail-value">
                {student?.fullName || "N/A"}
              </div>

              <div className="detail-label">
                Date of Birth
              </div>
              <div className="detail-value">
                {dob}
              </div>

              <div className="detail-label">
                Gender
              </div>
              <div className="detail-value">
                {student?.gender || "N/A"}
              </div>

              <div className="detail-label">
                Nationality
              </div>
              <div className="detail-value">
                {student?.nationality || "Nigeria"}
              </div>

              <div className="detail-label">
                State of Origin
              </div>
              <div className="detail-value">
                {student?.stateOfOrigin || "N/A"}
              </div>

              <div className="detail-label">
                LGA
              </div>
              <div className="detail-value">
                {student?.lga || "N/A"}
              </div>

              <div className="detail-label">
                Residential Address
              </div>
              <div className="detail-value">
                {student?.contact?.address || "N/A"}
              </div>

              <div className="detail-label">
                Portal Reg. No.
              </div>
              <div className="detail-value">
                {student?.regNo || "N/A"}
              </div>

              <div className="detail-label">
                Admission No.
              </div>
              <div className="detail-value">
                <strong>{admissionNo}</strong>
              </div>

              <div className="detail-label">
                Class on Admission
              </div>
              <div className="detail-value">
                {classAdmitted}
                {arm ? ` — Arm ${arm}` : ""}
              </div>

            </div>
          </div>

          {/* PASSPORT + QR */}
          <div className="photo-area">

            {student?.passportUrl ? (
              <img
                src={student.passportUrl}
                alt={student.fullName}
                className="passport"
              />
            ) : (
              <div className="passport" />
            )}

            <div className="qr-box">
              <QRCodeSVG
                value={verificationValue}
                size={68}
              />

              <div className="qr-text">
                Scan to verify
              </div>
            </div>

          </div>
        </div>

        {/* LETTER */}
        <div className="letter-body">

          <p className="dear">
            Dear {student?.fullName?.split(" ")[0] || "Applicant"},
          </p>

          <p>
            We are pleased to inform you that you have been
            offered <strong>provisional admission</strong> into{" "}
            <strong>{schoolName}</strong> for the{" "}
            <strong>{session}</strong> academic session.
          </p>

          <p>
            Your admission is offered subject to the successful
            completion of all admission requirements and
            compliance with the rules, regulations and standards
            of the school.
          </p>

          <p>
            Your admission details are as follows: you have been
            offered a place in <strong>{classAdmitted}</strong>
            {arm ? `, Arm ${arm}` : ""}, for the{" "}
            <strong>{term} Term</strong> of the{" "}
            <strong>{session}</strong> academic session.
          </p>

          <p>
            To secure this admission, you are required to pay the
            school's <span className="important">
              non-refundable acceptance fee
            </span>{" "}
            on or before <strong>{acceptanceDeadline}</strong>.
            Failure to meet this requirement within the stated
            period may result in the withdrawal of this offer.
          </p>

          {/* FEE TABLE */}
          <div className="fee-heading">
            EXPECTED SCHOOL FEES
          </div>

          <table className="fee-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Total School Fee</th>
                <th>70% Initial Payment</th>
                <th>Balance</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <strong>{classAdmitted}</strong>
                </td>
                <td>{formatMoney(totalFee)}</td>
                <td>{formatMoney(seventyPercent)}</td>
                <td>{formatMoney(balance)}</td>
              </tr>
            </tbody>
          </table>

          <div className="fee-note">
            <strong>Important:</strong> Parents/guardians are
            required to pay at least <strong>70% of the school
            fees</strong> on or before resumption, preferably
            two weeks before resumption, to facilitate proper
            preparation and a smooth commencement of the
            academic session.
          </div>

          <p style={{ marginTop: "8px" }}>
            We look forward to welcoming you into our school
            community and trust that you will uphold the values
            of excellence, discipline and leadership throughout
            your time with us.
          </p>

        </div>

        {/* CLOSING */}
        <div className="closing">
          <div>Yours sincerely,</div>

          <div className="signature-area">
            <img
              src="/p-signature.jpg"
              alt="Principal's Signature"
              className="signature"
            />

            <div className="principal-name">
              Dr. A.A Achiever
            </div>

            <div className="principal-title">
              Principal
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="footer">

        <div className="footer-main">

          <div className="footer-item">
            <Phone />
            <span>{schoolPhone}</span>
          </div>

          <div className="footer-item">
            <Mail />
            <span>{schoolEmail}</span>
          </div>

          <div className="footer-item">
            <MapPin />
            <span>{schoolAddress}</span>
          </div>

          <div className="footer-item">
            <Globe />
            <span>{schoolWebsite}</span>
          </div>

        </div>

        <div className="footer-bottom">
          © 2026 {schoolName}. All rights reserved.
          &nbsp; | &nbsp;
          <span>
            <CalendarDays
              style={{
                width: "9px",
                height: "9px",
                display: "inline",
                verticalAlign: "middle",
              }}
            />{" "}
            Date Admitted: {dateAdmitted}
          </span>
          &nbsp; | &nbsp;
          Validate this letter at {schoolWebsite}
        </div>

      </div>

    </div>
  </div>
</>
  );
}