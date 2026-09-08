import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function SaveResultPDF({
  targetId = "student-result-sheet",
  fileName = "student-result.pdf",
}) {
  const [saving, setSaving] = useState(false);

  const savePDF = async () => {
    const original = document.getElementById(targetId);

    if (!original) {
      alert("Result sheet not found.");
      return;
    }

    let wrapper = null;

    try {
      setSaving(true);

      /*
       * ---------------------------------------------------------
       * 1. CREATE A COMPLETELY INDEPENDENT PDF VERSION
       * ---------------------------------------------------------
       */

      wrapper = document.createElement("div");

      wrapper.style.position = "fixed";
      wrapper.style.left = "-100000px";
      wrapper.style.top = "0";
      wrapper.style.width = "794px";
      wrapper.style.background = "#ffffff";
      wrapper.style.zIndex = "-9999";

      const clone = original.cloneNode(true);

      /*
       * Remove every Tailwind class.
       *
       * This is important because Tailwind v4 generates
       * modern CSS color functions such as oklch().
       */
      clone.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("class");
      });

      clone.removeAttribute("class");

      /*
       * ---------------------------------------------------------
       * 2. PDF-ONLY CSS
       * ---------------------------------------------------------
       */

      const style = document.createElement("style");

      style.textContent = `
        * {
          box-sizing: border-box !important;
        }

        body {
          margin: 0;
          padding: 0;
          background: #ffffff !important;
          color: #1e293b !important;
          font-family: Arial, Helvetica, sans-serif !important;
        }

        #pdf-result {
          width: 794px;
          min-height: 1123px;
          padding: 28px;
          position: relative;
          overflow: hidden;
          background: #ffffff !important;
          color: #1e293b !important;
        }

        .watermark {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .watermark img {
          width: 430px;
          opacity: 0.035;
        }

        .school-header {
          display: grid;
          grid-template-columns: 90px 1fr 190px;
          align-items: center;
          gap: 16px;
          padding-bottom: 16px;
          border-bottom: 2px solid #0f172a;
        }

        .crest {
          width: 80px;
          height: 80px;
          object-fit: contain;
        }

        .school-title {
          text-align: center;
        }

        .school-name {
          margin: 0;
          font-size: 20px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #0f172a;
        }

        .motto {
          margin-top: 4px;
          font-size: 10px;
          font-style: italic;
        }

        .term-box {
          display: inline-flex;
          gap: 8px;
          margin-top: 10px;
        }

        .term {
          padding: 5px 12px;
          color: #ffffff;
          background: #0f172a;
          border-radius: 4px;
          font-size: 10px;
          font-weight: bold;
        }

        .session {
          padding: 5px 12px;
          border: 1px solid #94a3b8;
          border-radius: 4px;
          font-size: 10px;
          font-weight: bold;
        }

        .school-contact {
          text-align: right;
          font-size: 9px;
          line-height: 1.6;
        }

        .student-section {
          margin-top: 20px;
        }

        .student-grid {
          display: grid;
          grid-template-columns: 100px 1fr 90px;
          gap: 16px;
        }

        .passport {
          width: 96px;
          height: 112px;
          object-fit: cover;
          border: 2px solid #cbd5e1;
          border-radius: 4px;
        }

        .section-title {
          margin: 0 0 8px;
          padding-bottom: 4px;
          border-bottom: 1px solid #cbd5e1;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .student-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 20px;
          font-size: 10px;
        }

        .student-details strong {
          font-weight: 700;
        }

        .surname {
          font-weight: 900;
          text-transform: uppercase;
        }

        .qr-area {
          text-align: center;
        }

        .qr-box {
          display: inline-block;
          padding: 4px;
          border: 1px solid #cbd5e1;
        }

        .qr-box svg {
          display: block;
        }

        .small-text {
          margin-top: 6px;
          font-size: 9px;
        }

        .result-heading {
          margin: 20px 0;
          padding: 8px 0;
          border-top: 2px solid #0f172a;
          border-bottom: 2px solid #0f172a;
          text-align: center;
        }

        .result-heading h2 {
          margin: 0;
          font-size: 14px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          padding: 7px 4px;
          color: #ffffff;
          background: #0f172a;
          border: 1px solid #ffffff;
          font-size: 9px;
        }

        td {
          padding: 6px 4px;
          border: 1px solid #cbd5e1;
          font-size: 9px;
        }

        tbody tr:nth-child(even) {
          background: #ffffff;
        }

        tbody tr:nth-child(odd) {
          background: #f8fafc;
        }

        .center {
          text-align: center;
        }

        .bold {
          font-weight: 700;
        }

        .teacher-signature {
          width: 60px;
          height: 28px;
          object-fit: contain;
          display: block;
          margin: auto;
        }

        .total-row td {
          color: #ffffff;
          background: #0f172a !important;
          border-color: #ffffff;
          font-weight: 900;
        }

        .three-columns {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
          margin-top: 22px;
        }

        .box-title {
          margin: 0 0 8px;
          padding: 7px 8px;
          color: #ffffff;
          background: #0f172a;
          text-align: center;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .rating-table td {
          padding: 6px;
          font-size: 10px;
        }

        .rating-table td:last-child {
          width: 45px;
          text-align: center;
          font-weight: 900;
        }

        .s6 {
          display: grid;
          grid-template-columns: 1fr 1fr 1.35fr;
          gap: 16px;
          margin-top: 22px;
        }

        .info-box {
          border: 1px solid #cbd5e1;
          padding: 8px;
          font-size: 10px;
        }

        .info-box + .info-box {
          margin-top: 8px;
        }

        .comment {
          margin-bottom: 7px;
          font-size: 9px;
          line-height: 1.5;
        }

        .signature {
          min-height: 50px;
          text-align: center;
          font-size: 9px;
        }

        .signature img {
          width: 100px;
          height: 35px;
          object-fit: contain;
        }

        .signature-line {
          border-top: 1px solid #94a3b8;
          padding-top: 3px;
        }

        .footer {
          margin-top: 24px;
          padding-top: 8px;
          border-top: 1px solid #cbd5e1;
          text-align: center;
          color: #64748b;
          font-size: 8px;
        }
      `;

      /*
       * Give the cloned result a clean ID.
       */
      clone.id = "pdf-result";

      /*
       * Append CSS and clone.
       */
      wrapper.appendChild(style);
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      /*
       * ---------------------------------------------------------
       * 3. WAIT FOR IMAGES
       * ---------------------------------------------------------
       */

      const images = Array.from(
        clone.querySelectorAll("img")
      );

      await Promise.all(
        images.map((img) => {
          if (img.complete) {
            return Promise.resolve();
          }

          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      );

      /*
       * ---------------------------------------------------------
       * 4. CAPTURE
       * ---------------------------------------------------------
       */

      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: false,
        logging: false,
        imageTimeout: 15000,
      });

      /*
       * ---------------------------------------------------------
       * 5. REMOVE TEMPORARY DOM
       * ---------------------------------------------------------
       */

      document.body.removeChild(wrapper);
      wrapper = null;

      /*
       * ---------------------------------------------------------
       * 6. CREATE A4 PDF
       * ---------------------------------------------------------
       */

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = 210;
      const pageHeight = 297;

      const margin = 5;

      const availableWidth =
        pageWidth - margin * 2;

      const availableHeight =
        pageHeight - margin * 2;

      const ratio =
        canvas.width / canvas.height;

      let width = availableWidth;
      let height = width / ratio;

      if (height > availableHeight) {
        height = availableHeight;
        width = height * ratio;
      }

      const x =
        (pageWidth - width) / 2;

      const y =
        (pageHeight - height) / 2;

      pdf.addImage(
        canvas.toDataURL("image/jpeg", 0.92),
        "JPEG",
        x,
        y,
        width,
        height,
        undefined,
        "FAST"
      );

      pdf.save(fileName);

    } catch (error) {
      console.error("PDF ERROR:", error);

      /*
       * Clean up temporary element if an error occurs.
       */
      if (wrapper && document.body.contains(wrapper)) {
        document.body.removeChild(wrapper);
      }

      alert(
        `PDF generation failed:\n\n${
          error?.message || "Unknown error"
        }`
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      type="button"
      onClick={savePDF}
      disabled={saving}
      className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {saving
        ? "Generating PDF..."
        : "Save Result as PDF"}
    </button>
  );
}

export function PaperView(){

    return <div id="student-result-sheet" className="paper">
        <h4>Opening the FloodGate of Blessings...</h4>
        </div>
}