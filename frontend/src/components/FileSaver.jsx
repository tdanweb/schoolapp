import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotate,
  faFilePdf,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

const StudentIDCard = ({
  schoolName = "Achiever's International Academy",
  schoolCrest,
  schoolGateImage = "/school-gate.jpg",

  student = {
    passportUrl: "",
    regNo: "",
    admissionNo: "",
    dob: "",
    clubHouse: "",
    realClassId: "",
    session: "2026/2027",
    parentContact: "",
  },

  principalName = "Dr. Marvelous Ike",

  principalInstruction = `This card remains the property of the school and must be
presented whenever requested. If found, please return it to the school authority.`,

  schoolAddress = "14, Adeolu Crescent, Maitama Abuja Nigeria.",
  principalSignature = "/p-signature.jpg",

  QRComponent,
}) => {
  const [showBack, setShowBack] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const frontRef = useRef(null);
  const backRef = useRef(null);

  /*
   * ---------------------------------------------------------
   * SAFE DATA HELPERS
   * ---------------------------------------------------------
   */

  const personalInfo = student?.personalInfo || {};

  const studentName =
    personalInfo?.surname || personalInfo?.firstName
      ? `${personalInfo?.surname || ""} ${
          personalInfo?.firstName || ""
        }`.trim()
      : student?.fullname || "STUDENT";

  const formattedDOB = (() => {
    if (!personalInfo?.dob && !student?.dob) return "—";

    const date = new Date(personalInfo?.dob || student?.dob);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toDateString();
  })();

  /*
   * ---------------------------------------------------------
   * WAIT FOR IMAGES
   * ---------------------------------------------------------
   */

  const waitForImages = async (element) => {
    if (!element) return;

    const images = Array.from(element.querySelectorAll("img"));

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
  };

  /*
   * ---------------------------------------------------------
   * CARD EXPORT
   *
   * IMPORTANT:
   * We clone the card before exporting it.
   *
   * This prevents the flip animation and
   * backface-visibility from interfering with
   * html2canvas.
   *
   * We also use only HEX/RGBA colors inside the
   * exportable card because Tailwind v4 can generate
   * oklch()/color-mix() values that html2canvas
   * cannot parse.
   * ---------------------------------------------------------
   */

  const captureCard = async (element) => {
    if (!element) return null;

    await waitForImages(element);

    const clone = element.cloneNode(true);

    const width = element.offsetWidth;
    const height = element.offsetHeight;

    /*
     * Remove the clone from the normal document flow
     * and make it a standalone card.
     */
    clone.style.position = "fixed";
    clone.style.left = "-10000px";
    clone.style.top = "0";
    clone.style.width = `${width}px`;
    clone.style.height = `${height}px`;

    /*
     * Very important for the BACK card.
     *
     * The visible UI has rotateY(180deg), but we don't
     * want html2canvas capturing the backface.
     */
    clone.style.transform = "none";
    clone.style.backfaceVisibility = "visible";
    clone.style.webkitBackfaceVisibility = "visible";

    /*
     * Explicit export-safe colors.
     *
     * These CSS variables are also useful for any nested
     * component that happens to consume them.
     */
    clone.style.setProperty("--export-navy", "#071b41");
    clone.style.setProperty("--export-blue", "#123b7a");
    clone.style.setProperty("--export-gold", "#d6a928");
    clone.style.setProperty("--export-light-gold", "#f0ca55");
    clone.style.setProperty("--export-white", "#ffffff");
    clone.style.setProperty("--export-slate-100", "#f1f5f9");
    clone.style.setProperty("--export-slate-200", "#e2e8f0");
    clone.style.setProperty("--export-slate-400", "#94a3b8");
    clone.style.setProperty("--export-slate-500", "#64748b");
    clone.style.setProperty("--export-slate-700", "#334155");
    clone.style.setProperty("--export-slate-800", "#1e293b");

    document.body.appendChild(clone);

    try {
      /*
       * html2canvas can capture the clone as a normal
       * standalone element now.
       */
      const canvas = await html2canvas(clone, {
        scale: 4,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
        imageTimeout: 15000,

        /*
         * Make sure html2canvas works against the
         * clone rather than the animated original.
         */
        onclone: (clonedDocument) => {
          const clonedCard = clonedDocument.body.lastElementChild;

          if (!clonedCard) return;

          clonedCard.style.transform = "none";
          clonedCard.style.backfaceVisibility = "visible";
          clonedCard.style.webkitBackfaceVisibility = "visible";
        },
      });

      return canvas;
    } finally {
      clone.remove();
    }
  };

  /*
   * ---------------------------------------------------------
   * SAVE IMAGE
   * ---------------------------------------------------------
   */

  const saveImage = async (side) => {
    if (isExporting) return;

    try {
      setIsExporting(true);

      const element =
        side === "front" ? frontRef.current : backRef.current;

      const canvas = await captureCard(element);

      if (!canvas) return;

      const link = document.createElement("a");

      link.download = `${
        student?.admissionNo ||
        student?.regNo ||
        "student"
      }-id-${side}.png`;

      link.href = canvas.toDataURL("image/png");

      link.click();
    } catch (error) {
      console.error(`Failed to save ${side} image:`, error);
    } finally {
      setIsExporting(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * SAVE PDF
   * ---------------------------------------------------------
   */

const savePDF = async () => {
  if (isExporting) return;

  try {
    setIsExporting(true);

    const frontCanvas = await captureCard(frontRef.current);
    const backCanvas = await captureCard(backRef.current);

    if (!frontCanvas || !backCanvas) return;

    /*
     * ---------------------------------------------------------
     * PRINT SIZE
     * ---------------------------------------------------------
     *
     * 70mm wide ID card
     * Maintains standard 85.6 : 54 ratio
     */
    const cardWidth = 70;
    const cardHeight = cardWidth * (54 / 85.6);

    /*
     * A4 dimensions
     */
    const pageWidth = 210;
    const pageHeight = 297;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const frontImage =
      frontCanvas.toDataURL("image/jpeg", 0.85);

    const backImage =
      backCanvas.toDataURL("image/jpeg", 0.85);

    /*
     * Center the cards horizontally.
     */
    const x = (pageWidth - cardWidth) / 2;

    /*
     * Total height of both cards + gap.
     */
    const gap = 8;

    const totalHeight =
      cardHeight * 2 + gap;

    /*
     * Center both cards vertically.
     */
    const startY =
      (pageHeight - totalHeight) / 2;

    /*
     * FRONT
     */
    pdf.addImage(
      frontImage,
      "JPEG",
      x,
      startY,
      cardWidth,
      cardHeight,
      undefined,
      "FAST"
    );

    /*
     * BACK
     */
    pdf.addImage(
      backImage,
      "JPEG",
      x,
      startY + cardHeight + gap,
      cardWidth,
      cardHeight,
      undefined,
      "FAST"
    );

    pdf.save(
      `${
        student?.admissionNo ||
        student?.regNo ||
        "student"
      }-id-card.pdf`
    );
  } catch (error) {
    console.error(
      "Failed to generate PDF:",
      error
    );
  } finally {
    setIsExporting(false);
  }
};
  /*
   * ---------------------------------------------------------
   * INFORMATION ROW
   * ---------------------------------------------------------
   */

const Info = ({ label, value }) => (
  <div className="min-w-0 overflow-visible">
    <p className="text-[6px] leading-[1.2] uppercase tracking-[0.12em] font-semibold text-[#64748b]">
      {label}
    </p>
<p
  style={{
    fontFamily: "Poppins, sans-serif",
    color: "#1e293b",
    fontSize: "8px",
    lineHeight: "1.35",
    fontWeight: "700",
    whiteSpace: "normal",
    overflowWrap: "break-word",
    wordBreak: "break-word",
    margin: 0,
  }}
>
  {value || "—"}
</p>
  </div>
);
  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */

  return (
    <div className="w-full flex flex-col items-center gap-5">

      {/* =====================================================
          CARD
      ====================================================== */}

      <div
        className="relative w-[430px] max-w-full"
        style={{
          aspectRatio: "85.6 / 54",
          perspective: "1400px",
        }}
      >
        <div
          className="relative w-full h-full transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: showBack
              ? "rotateY(180deg)"
              : "rotateY(0deg)",
          }}
        >

          {/* =================================================
              FRONT
          ================================================== */}

          <div
            ref={frontRef}
            className="
              absolute
              inset-0
              overflow-hidden
              rounded-[18px]
              bg-[#ffffff]
            "
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              boxShadow:
                "0 20px 35px rgba(0,0,0,0.18)",
            }}
          >

            {/* WATERMARK CREST */}

            {schoolCrest && (
              <img
                src={schoolCrest}
                alt=""
                crossOrigin="anonymous"
                className="
                  absolute
                  w-[58%]
                  right-[10%]
                  bottom-[-15%]
                  pointer-events-none
                  select-none
                "
                style={{
                  opacity: 0.055,
                }}
              />
            )}

            {/* TOP ACCENT */}

            <div
              className="absolute top-0 left-0 right-0 h-[7px]"
              style={{
                background:
                  "linear-gradient(to right, #071b41, #123b7a, #d6a928)",
              }}
            />

            {/* MAIN CONTENT */}

            <div className="relative h-full flex flex-col px-5 py-4">

              {/* HEADER */}

              <div className="flex items-center gap-3">

                {schoolCrest && (
                  <div
                    className="
                      w-[47px]
                      h-[47px]
                      flex-shrink-0
                      rounded-full
                      flex
                      items-center
                      justify-center
                    "
                    style={{
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <img
                      src={schoolCrest}
                      alt="School Crest"
                      crossOrigin="anonymous"
                      className="
                        w-full
                        h-full
                        object-contain
                      "
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">

                  <h2
                    className="
                      text-[14px]
                      leading-none
                      font-black
                      tracking-tight
                      uppercase
                    "
                    style={{
                      color: "#071b41",
                    }}
                  >
                    {schoolName}
                  </h2>

                  <div className="mt-1 flex items-center gap-2">

                    <span
                      className="h-[1px] w-7"
                      style={{
                        backgroundColor: "#d6a928",
                      }}
                    />

                    <p
                      className="
                        text-[6px]
                        tracking-[0.25em]
                        font-bold
                      "
                      style={{
                        color: "#d6a928",
                      }}
                    >
                      STUDENT ID CARD
                    </p>

                  </div>
                </div>

              </div>

              {/* STUDENT AREA */}

              <div className="flex gap-4 mt-4 flex-1">

                {/* PASSPORT */}

                <div className="w-[92px] flex-shrink-0">

                  <div
                    className="
                      relative
                      w-[92px]
                      h-[112px]
                      rounded-xl
                      overflow-hidden
                      border-[3px]
                    "
                    style={{
                      backgroundColor: "#f1f5f9",
                      borderColor: "#ffffff",
                      boxShadow:
                        "0 4px 8px rgba(0,0,0,0.12)",
                      outline:
                        "1px solid #e2e8f0",
                    }}
                  >

                    {student?.passportUrl ? (
                      <img
                        src={student.passportUrl}
                        alt={
                          student?.fullname ||
                          "Student"
                        }
                        crossOrigin="anonymous"
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />
                    ) : (
                      <div
                        className="
                          w-full
                          h-full
                          flex
                          items-center
                          justify-center
                          text-[7px]
                        "
                        style={{
                          color: "#94a3b8",
                        }}
                      >
                        PASSPORT
                      </div>
                    )}

                    {/* SMALL BADGE */}

                    <div
                      className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        py-1
                        text-center
                        text-[5px]
                        font-bold
                        tracking-widest
                      "
                      style={{
                        backgroundColor:
                          "rgba(7,27,65,0.90)",
                        color: "#ffffff",
                      }}
                    >
                      {studentName.toUpperCase()}
                    </div>

                  </div>

                </div>

                {/* DETAILS */}

                <div
                  className="
                    flex-1
                    grid
                    grid-cols-2
                    content-start
                    gap-x-5
                    gap-y-3
                  "
                >

                  <Info
                    label="Portal Reg. No."
                    value={student?.regNo}
                  />

                  <Info
                    label="Admission No."
                    value={student?.admissionNo}
                  />

                  <Info
                    label="Date of Birth"
                    value={formattedDOB}
                  />

                  <Info
                    label="Class"
                    value={
                      student?.realClassNow?.mainClass ||
                      "—"
                    }
                  />

                  <Info
                    label="Class Wing"
                    value={student?.realClassId}
                  />

                  <Info
                    label="Club / House"
                    value={student?.clubHouse}
                  />

                  <Info
                    label="Session"
                    value={
                      student?.session ||
                      "2026/2027"
                    }
                  />
                  <Info
                    label="Blood Group"
                    value={
                      student?.medical?.bloodGroup ||
                      "--"
                    }
                  />
                </div>

              </div>

              {/* FOOTER */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-t
                  pt-2
                  mt-2
                "
                style={{
                  borderColor: "#e2e8f0",
                }}
              >

                <div>

                  <p
                    className="
                      text-[5px]
                      uppercase
                      tracking-widest
                    "
                    style={{
                      color: "#94a3b8",
                    }}
                  >
                    Property of
                  </p>

                  <p
                    className="
                      text-[6px]
                      font-bold
                    "
                    style={{
                      color: "#071b41",
                    }}
                  >
                    {schoolName}
                  </p>

                </div>

                <div className="text-right">

                  <p
                    className="text-[5px]"
                    style={{
                      color: "#94a3b8",
                    }}
                  >
                    Valid Session
                  </p>

                  <p
                    className="
                      text-[7px]
                      font-black
                    "
                    style={{
                      color: "#071b41",
                    }}
                  >
                    {student?.session || "—"}
                  </p>

                </div>

              </div>

            </div>
          </div>


          {/* =================================================
              BACK
          ================================================== */}

          <div
            ref={backRef}
            className="
              absolute
              inset-0
              overflow-hidden
              rounded-[18px]
            "
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              boxShadow:
                "0 20px 35px rgba(0,0,0,0.18)",
            }}
          >

            {/* SCHOOL GATE BACKGROUND */}

            {schoolGateImage && (
              <img
                src={schoolGateImage}
                alt=""
                crossOrigin="anonymous"
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                "
              />
            )}

            {/* GRADIENT OVERLAY */}

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(7,27,65,0.95), rgba(7,27,65,0.75), rgba(7,27,65,0.95))",
              }}
            />

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(7,27,65,0.90), transparent, rgba(7,27,65,0.90))",
              }}
            />

            {/* BACK CONTENT */}

            <div
              className="
                relative
                z-10
                h-full
                px-5
                py-4
              "
              style={{
                color: "#ffffff",
              }}
            >

              {/* HEADER */}

              <div className="flex items-center gap-3">

                {schoolCrest && (
                  <img
                    src={schoolCrest}
                    alt=""
                    crossOrigin="anonymous"
                    className="
                      w-9
                      h-9
                      object-contain
                    "
                  />
                )}

                <div>

                  <p
                    className="
                      text-[10px]
                      font-black
                      uppercase
                      tracking-wide
                    "
                  >
                    {schoolName}
                  </p>

                  <p
                    className="
                      text-[5px]
                      uppercase
                      tracking-[0.25em]
                    "
                    style={{
                      color: "#f0ca55",
                    }}
                  >
                    Student Identification
                  </p>

                </div>

              </div>


              {/* MAIN BACK CONTENT */}

              <div
                className="
                  grid
                  grid-cols-[1fr_65px]
                  gap-4
                  mt-3
                "
              >

                {/* PRINCIPAL MESSAGE */}

                <div>

                  <p
                    className="
                      text-[5px]
                      uppercase
                      tracking-[0.2em]
                      font-bold
                      mb-1
                    "
                    style={{
                      color: "#f0ca55",
                    }}
                  >
                    Principal's Instruction
                  </p>

                  <p
                    className="
                      text-[7px]
                      leading-[1.45]
                      max-w-[235px]
                    "
                    style={{
                      color:
                        "rgba(255,255,255,0.95)",
                    }}
                  >
                    {principalInstruction}
                  </p>

                  <div className="mt-2">

                    {principalSignature && (
                      <img
                        src="signature.jpg"
                        alt="Principal Signature"
                        crossOrigin="anonymous"
                        className="
                          h-7
                          max-w-[70px]
                          object-contain
                          object-left
                        "
                      />
                    )}

                    <div
                      className="h-[1px] w-20"
                      style={{
                        backgroundColor:
                          "rgba(255,255,255,0.50)",
                      }}
                    />

                    <p
                      className="
                        text-[6px]
                        font-bold
                        mt-1
                      "
                    >
                      {principalName}
                    </p>

                    <p
                      className="text-[5px]"
                      style={{
                        color:
                          "rgba(255,255,255,0.60)",
                      }}
                    >
                      Principal
                    </p>

                  </div>

                </div>


                {/* QR */}

                <div
                  className="
                    flex
                    flex-col
                    items-center
                    justify-start
                  "
                >

                  <div
                    className="
                      p-[2px]
                      rounded-lg
                      w-[61px]
                      h-[61px]
                      flex
                      items-center
                      justify-center
                    "
                    style={{
                      backgroundColor: "#ffffff",
                      boxShadow:
                        "0 8px 15px rgba(0,0,0,0.18)",
                    }}
                  >

                    {QRComponent ? (
                      QRComponent
                    ) : (
                      <div
                        className="
                          text-[5px]
                          text-center
                        "
                        style={{
                          color: "#64748b",
                        }}
                      >
                        QR CODE
                      </div>
                    )}

                  </div>

                  <p
                    className="
                      mt-1
                      text-[5px]
                      uppercase
                      tracking-widest
                    "
                    style={{
                      color:
                        "rgba(255,255,255,0.80)",
                    }}
                  >
                    Verify Student
                  </p>

                </div>

              </div>


              {/* BOTTOM INFORMATION */}

              <div
                className="
                  absolute
                  bottom-4
                  left-5
                  right-5
                "
              >

                <div
                  className="
                    grid
                    grid-cols-[1fr_1fr]
                    gap-5
                    border-t
                    pt-2
                  "
                  style={{
                    borderColor:
                      "rgba(255,255,255,0.20)",
                  }}
                >

                  {/* ADDRESS */}

                  <div>

                    <p
                      className="
                        text-[5px]
                        uppercase
                        tracking-widest
                      "
                      style={{
                        color: "#f0ca55",
                      }}
                    >
                      School Address
                    </p>

                    <p
                      className="
                        text-[6px]
                        font-medium
                        leading-tight
                        mt-1
                      "
                      style={{
                        color:
                          "rgba(255,255,255,0.90)",
                      }}
                    >
                      {schoolAddress}
                    </p>

                  </div>


                  {/* PARENT CONTACT */}

                  <div>

                    <p
                      className="
                        text-[5px]
                        uppercase
                        tracking-widest
                      "
                      style={{
                        color: "#f0ca55",
                      }}
                    >
                      Parents / Guardian Contact
                    </p>

                    <p
                      className="
                        text-[7px]
                        font-bold
                        mt-1
                      "
                    >
                      {student?.parentContact || "—"}
                    </p>

                    <p
                      className="
                        text-[5px]
                        mt-1
                      "
                      style={{
                        color:
                          "rgba(255,255,255,0.60)",
                      }}
                    >
                      Admission No:{" "}
                      <span
                        className="font-bold"
                        style={{
                          color: "#ffffff",
                        }}
                      >
                        {student?.admissionNo || "—"}
                      </span>
                    </p>

                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </div>


      {/* =====================================================
          CONTROLS
      ====================================================== */}

      <div
        className="
          flex
          flex-wrap
          items-center
          justify-center
          gap-2
        "
      >

        {/* FLIP */}

        <button
          type="button"
          onClick={() => setShowBack(!showBack)}
          disabled={isExporting}
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            bg-[#071b41]
            px-4
            py-2
            text-xs
            font-semibold
            text-white
            hover:bg-[#0d2a60]
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          <FontAwesomeIcon icon={faRotate} />

          {showBack
            ? "View Front"
            : "View Back"}
        </button>


        {/* PDF */}

        <button
          type="button"
          onClick={savePDF}
          disabled={isExporting}
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            border
            border-[#e2e8f0]
            bg-[#ffffff]
            px-4
            py-2
            text-xs
            font-semibold
            text-[#334155]
            hover:bg-[#f8fafc]
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          <FontAwesomeIcon icon={faFilePdf} />

          {isExporting
            ? "Exporting..."
            : "Save PDF"}
        </button>


        {/* FRONT IMAGE */}

        <button
          type="button"
          onClick={() => saveImage("front")}
          disabled={isExporting}
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            border
            border-[#e2e8f0]
            bg-[#ffffff]
            px-4
            py-2
            text-xs
            font-semibold
            text-[#334155]
            hover:bg-[#f8fafc]
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          <FontAwesomeIcon icon={faImage} />

          Front Image
        </button>


        {/* BACK IMAGE */}

        <button
          type="button"
          onClick={() => saveImage("back")}
          disabled={isExporting}
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            border
            border-[#e2e8f0]
            bg-[#ffffff]
            px-4
            py-2
            text-xs
            font-semibold
            text-[#334155]
            hover:bg-[#f8fafc]
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          <FontAwesomeIcon icon={faImage} />

          Back Image
        </button>

      </div>

    </div>
  );
};

export default StudentIDCard;