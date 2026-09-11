import React, { useState, useCallback } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function SaveResultPDF({
  targetId = "student-result-sheet",
  fileName = "student-result.pdf",
}) {
  const [saving, setSaving] = useState(false);

  const savePDF = useCallback(async () => {
    const element = document.getElementById(targetId);

    if (!element) {
      alert("Result sheet element not found.");
      return;
    }

    try {
      setSaving(true);

      // 1. Wait for all images inside the element to fully load
      const images = Array.from(element.querySelectorAll("img"));
      await Promise.all(
        images.map((img) => {
          if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      // 2. Capture the actual DOM node using its computed Tailwind styles
      const canvas = await html2canvas(element, {
        scale: 2, // Double DPI for sharp text and crisp images
        useCORS: true, // Allows loading cross-origin avatars/logos
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      // 3. Create exact A4 portrait PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Fit content perfectly onto standard A4 dimensions
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      pdf.save(fileName);
    } catch (error) {
      console.error("PDF Export Error:", error);
      alert(`PDF generation failed: ${error?.message || "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  }, [targetId, fileName]);

  return (
    <button
      type="button"
      onClick={savePDF}
      disabled={saving}
      className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
    >
      {saving ? "Generating PDF..." : "Save Result as PDF"}
    </button>
  );
}

export function PaperView(){

    return <div id="student-result-sheet" className="paper">
        <h4>Opening the FloodGate of Blessings...</h4>
        </div>
}