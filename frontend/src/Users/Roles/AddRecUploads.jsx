// =============
//==== uploading of additional scores and class teacher comments
//============
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMoreVertical,
  FiCheck,
  FiX,
  FiUpload,
  FiUser,
  FiMessageSquare,
} from "react-icons/fi";
import { mainApi } from "../../api";
import axios from "axios";


// ---------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------

const PSYCHO_KEYS = [
  "punctuality",
  "neatness",
  "handwriting",
  "sports",
  "creativity",
  "leadership",
];

const AFFECTIVE_KEYS = [
  "attentiveness",
  "cooperation",
  "honesty",
  "responsibility",
  "politeness",
  "self_control",
];

const emptyPsycho = () => ({
  punctuality: "",
  neatness: "",
  handwriting: "",
  sports: "",
  creativity: "",
  leadership: "",
});

const emptyAffective = () => ({
  attentiveness: "",
  cooperation: "",
  honesty: "",
  responsibility: "",
  politeness: "",
  self_control: "",
});


// ---------------------------------------------------------
// HELPERS
// ---------------------------------------------------------

const getFullName = (student) => {
  const personal = student?.personalInfo || {};

  return [
    personal.surname,
    personal.firstName,
    personal.otherName,
  ]
    .filter(Boolean)
    .join(" ");
};


// Normalize a NEW student from classroom list
const createNewRecord = (student, classId) => ({
  studentId: student?._id,

  admissionNo: student?.admissionNo || "",
  regNo: student?.regNo || "",

  fullName: getFullName(student),

  passportUrl: student?.passportUrl || "",

  classId,

  userID: student?.admissionNo || "",

  // These are supplied by parent / session logic
  session: "",
  term: "",

  teacherComment: {
    text: "",
    signature: "",
  },

  // Principal is deliberately empty/disabled for now
  principalComment: {
    text: "",
    signature: "",
  },

  generalComment: "",

  psychoScores: emptyPsycho(),

  affectiveScores: emptyAffective(),

  promotion: "NIL",
});


// Normalize PREVIOUSLY SAVED record
const normalizePreviousRecord = (record, student, classId) => ({
  studentId: student?._id || record?.admissionNo,

  admissionNo:
    student?.admissionNo ||
    record?.admissionNo ||
    "",

  regNo:
    student?.regNo ||
    record?.regNo ||
    "",

  fullName:
    getFullName(student) ||
    record?.fullName ||
    "",

  passportUrl:
    student?.passportUrl ||
    record?.passportUrl ||
    "",

  classId:
    record?.classId ||
    classId,

  userID:
    record?.userID ||
    student?.admissionNo ||
    "",

  session: record?.session || "",

  term: record?.term || "",

  teacherComment: {
    text: record?.teacherComment?.text || "",
    signature: record?.teacherComment?.signature || "",
  },

  principalComment: {
    text: record?.principalComment?.text || "",
    signature: record?.principalComment?.signature || "",
  },

  generalComment:
    record?.generalComment || "",

  psychoScores: {
    ...emptyPsycho(),
    ...(record?.psychoScores || {}),
  },

  affectiveScores: {
    ...emptyAffective(),
    ...(record?.affectiveScores || {}),
  },

  promotion:
    record?.promotion || "NIL",
});


// ---------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------

function UploadAdditionalRecords({
  list = [],
  classId,
  prevList = [],
  regNo = ""
}) {

  const [records, setRecords] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);


  // -------------------------------------------------------
  // BUILD WORKING ARRAY
  // -------------------------------------------------------

  useEffect(() => {

    if (!list?.length) {
      setRecords([]);
      return;
    }

    /*
      If previous records exist:
      merge previous data with current classroom students.

      This is important because prevList may contain only
      additional-record information while list contains
      the student's identity information.
    */

    if (prevList?.length > 0) {

      const merged = list.map((student) => {

        const previous = prevList.find(
          (record) =>
            record?.admissionNo === student?.admissionNo ||
            record?.userID === student?.admissionNo ||
            record?.admissionNo?._id === student?._id
        );

        if (previous) {
          return normalizePreviousRecord(
            previous,
            student,
            classId
          );
        }

        // Student has no previous record yet
        return createNewRecord(student, classId);
      });

      setRecords(merged);

    } else {

      // No previous records
      const fresh = list.map((student) =>
        createNewRecord(student, classId)
      );

      setRecords(fresh);
    }

  }, [list, prevList, classId]);


  // -------------------------------------------------------
  // UPDATE CURRENT STUDENT
  // -------------------------------------------------------

  const updateRecord = (index, changes) => {

    setRecords((prev) =>
      prev.map((record, i) =>
        i === index
          ? {
              ...record,
              ...changes,
            }
          : record
      )
    );
  };


  // -------------------------------------------------------
  // UPDATE NESTED FIELD
  // -------------------------------------------------------

  const updateNested = (
    index,
    parent,
    field,
    value
  ) => {

    setRecords((prev) =>
      prev.map((record, i) => {

        if (i !== index) return record;

        return {
          ...record,

          [parent]: {
            ...record[parent],
            [field]: value,
          },
        };
      })
    );
  };


  // -------------------------------------------------------
  // COMPLETION CHECKS
  // -------------------------------------------------------

  const isPsychoComplete = (record) => {

    return PSYCHO_KEYS.every(
      (key) =>
        record?.psychoScores?.[key]
    );
  };


  const isAffectiveComplete = (record) => {

    return AFFECTIVE_KEYS.every(
      (key) =>
        record?.affectiveScores?.[key]
    );
  };


  const hasTeacherComment = (record) => {

    return Boolean(
      record?.teacherComment?.text?.trim()
    );
  };


  // -------------------------------------------------------
  // OPEN STUDENT
  // -------------------------------------------------------

  const openStudent = (index) => {
    setSelectedIndex(index);
  };


  const closeStudent = () => {
    setSelectedIndex(null);
  };


  // -------------------------------------------------------
  // NEXT STUDENT
  // -------------------------------------------------------

  const doneAndNext = () => {

    if (selectedIndex === null) return;

    if (selectedIndex < records.length - 1) {

      setSelectedIndex(selectedIndex + 1);

    } else {

      setSelectedIndex(null);
    }
  };


  // -------------------------------------------------------
  // UPLOAD
  // -------------------------------------------------------

  const [loading, setLoading] = useState(false)
  const handleUpload = async () => {
    setLoading(true);

    const uploadAPI = `${mainApi}/results/upload-records?regNo=${regNo}&classId=${classId}`
    console.log(
      "ADDITIONAL RECORDS TO UPLOAD:",
      records
    );

    try {
      const res = await axios.put(uploadAPI, records);
      console.log(res.data)
    } catch (error) {
      if(error.response){
        alert(error.response.data.msg)
      }

      alert("Network/Sever Error.. Try again later..")
    }finally{
      setLoading(false)
    }
  };


  // -------------------------------------------------------
  // CURRENT STUDENT
  // -------------------------------------------------------

  const selectedStudent =
    selectedIndex !== null
      ? records[selectedIndex]
      : null;


  return (
    <div className="w-full">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-5">

        <h2 className="text-xl font-bold text-slate-800">
          Additional Student Records
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Record psychomotor, affective and class teacher
          comments for your students.
        </p>

      </div>


      {/* =================================================
          LEGEND
      ================================================= */}

      <div className="
        flex flex-wrap items-center gap-4
        mb-4 px-3 py-2
        bg-slate-50
        border border-slate-200
        rounded-xl
        text-xs text-slate-500
      ">

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          Recorded
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          Not recorded
        </div>

        <div className="flex items-center gap-1.5">
          <FiCheck className="text-emerald-600" />
          Comment passed
        </div>

      </div>


      {/* =================================================
          TABLE
      ================================================= */}

      <div className="
        overflow-x-auto
        rounded-2xl
        border border-slate-200
        bg-white
        shadow-sm
      ">

        <table className="w-full text-sm">

          <thead>

            <tr className="
              bg-slate-900
              text-white
              text-left
            ">

              <th className="px-4 py-3 font-medium">
                #
              </th>

              <th className="px-4 py-3 font-medium min-w-[240px]">
                Student
              </th>

              <th className="px-4 py-3 text-center font-medium">
                Psycho
              </th>

              <th className="px-4 py-3 text-center font-medium">
                Affective
              </th>

              <th className="px-4 py-3 text-center font-medium">
                Teacher
              </th>

              <th className="px-4 py-3 text-center font-medium">
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {records.map((student, index) => {

              const psychoComplete =
                isPsychoComplete(student);

              const affectiveComplete =
                isAffectiveComplete(student);

              const teacherComment =
                hasTeacherComment(student);


              return (

                <tr
                  key={`${student.admissionNo}-${index}`}
                  className="
                    border-t
                    border-slate-100
                    hover:bg-slate-50
                    transition
                  "
                >

                  {/* NUMBER */}

                  <td className="
                    px-4 py-3
                    text-slate-400
                    font-medium
                  ">
                    {index + 1}
                  </td>


                  {/* STUDENT */}

                  <td className="px-4 py-3">

                    <div className="flex items-center gap-3">

                      <div className="
                        w-10 h-10
                        rounded-full
                        overflow-hidden
                        bg-slate-100
                        shrink-0
                      ">

                        {student.passportUrl ? (

                          <img
                            src={student.passportUrl}
                            alt={student.fullName}
                            className="
                              w-full h-full
                              object-cover
                            "
                          />

                        ) : (

                          <div className="
                            w-full h-full
                            flex items-center
                            justify-center
                            text-slate-400
                          ">
                            <FiUser />
                          </div>

                        )}

                      </div>


                      <div className="min-w-0">

                        <p className="
                          font-semibold
                          text-slate-800
                          truncate
                        ">
                          {student.fullName ||
                            "Unnamed Student"}
                        </p>

                        <div className="
                          flex items-center
                          gap-2
                          text-xs
                          text-slate-400
                        ">

                          <span>
                            {student.admissionNo}
                          </span>

                          {student.regNo && (
                            <>
                              <span>•</span>
                              <span>
                                {student.regNo}
                              </span>
                            </>
                          )}

                        </div>

                      </div>

                    </div>

                  </td>


                  {/* PSYCHO */}

                  <td className="px-4 py-3">

                    <div className="
                      flex justify-center
                      items-center gap-1
                    ">

                      {PSYCHO_KEYS.map((key) => (

                        <span
                          key={key}
                          title={key}
                          className={`
                            w-2.5 h-2.5
                            rounded-full
                            ${
                              student?.psychoScores?.[key]
                                ? "bg-emerald-500"
                                : "bg-slate-300"
                            }
                          `}
                        />

                      ))}

                    </div>

                  </td>


                  {/* AFFECTIVE */}

                  <td className="px-4 py-3">

                    <div className="
                      flex justify-center
                      items-center gap-1
                    ">

                      {AFFECTIVE_KEYS.map((key) => (

                        <span
                          key={key}
                          title={key}
                          className={`
                            w-2.5 h-2.5
                            rounded-full
                            ${
                              student?.affectiveScores?.[key]
                                ? "bg-emerald-500"
                                : "bg-slate-300"
                            }
                          `}
                        />

                      ))}

                    </div>

                  </td>


                  {/* TEACHER COMMENT */}

                  <td className="px-4 py-3">

                    <div className="flex justify-center">

                      {teacherComment ? (

                        <div className="
                          w-7 h-7
                          rounded-full
                          bg-emerald-50
                          text-emerald-600
                          flex items-center
                          justify-center
                        ">

                          <FiCheck size={15} />

                        </div>

                      ) : (

                        <div className="
                          w-7 h-7
                          rounded-full
                          bg-slate-100
                          text-slate-400
                          flex items-center
                          justify-center
                        ">

                          <FiX size={14} />

                        </div>

                      )}

                    </div>

                  </td>


                  {/* ACTION */}

                  <td className="px-4 py-3">

                    <div className="flex justify-center">

                      <button
                        type="button"
                        onClick={() =>
                          openStudent(index)
                        }
                        className="
                          w-9 h-9
                          rounded-lg
                          flex items-center
                          justify-center
                          text-slate-500
                          hover:text-slate-900
                          hover:bg-slate-100
                          transition
                        "
                        title="Open student"
                      >

                        <FiMoreVertical size={19} />

                      </button>

                    </div>

                  </td>

                </tr>

              );

            })}


            {/* EMPTY */}

            {records.length === 0 && (

              <tr>

                <td
                  colSpan={6}
                  className="
                    py-14
                    text-center
                    text-slate-400
                  "
                >

                  No students found.

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>


      {/* =================================================
          UPLOAD BUTTON
      ================================================= */}

      <div className="
        flex
        justify-end
        mt-5
      ">

        <button
          type="button"
          onClick={handleUpload}
          disabled={!records.length || loading}
          className="
            inline-flex
            items-center
            gap-2
            px-5 py-2.5
            rounded-xl
            bg-slate-900
            text-white
            text-sm
            font-semibold
            hover:bg-slate-800
            disabled:opacity-40
            disabled:cursor-not-allowed
            transition
          "
        >

          <FiUpload size={16} />

          Upload Records

        </button>

      </div>


      {/* =================================================
          STUDENT OVERLAY
      ================================================= */}

      <AnimatePresence>

        {selectedStudent && (

          <motion.div
            className="
              fixed inset-0
              z-50
              bg-black/50
              backdrop-blur-sm
              flex items-center
              justify-center
              p-4
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {

              if (e.target === e.currentTarget) {
                closeStudent();
              }

            }}
          >

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.97,
              }}
              transition={{
                duration: 0.2,
              }}
              className="
                w-full
                max-w-3xl
                max-h-[92vh]
                overflow-y-auto
                bg-white
                rounded-2xl
                shadow-2xl
              "
            >

              {/* =========================================
                  OVERLAY HEADER
              ========================================= */}

              <div className="
                sticky top-0
                z-10
                bg-white
                border-b
                border-slate-100
                px-5 py-4
                flex items-center
                justify-between
              ">

                <div className="
                  flex items-center
                  gap-3
                ">

                  <div className="
                    w-11 h-11
                    rounded-full
                    overflow-hidden
                    bg-slate-100
                  ">

                    {selectedStudent.passportUrl ? (

                      <img
                        src={selectedStudent.passportUrl}
                        alt=""
                        className="
                          w-full h-full
                          object-cover
                        "
                      />

                    ) : (

                      <div className="
                        w-full h-full
                        flex items-center
                        justify-center
                        text-slate-400
                      ">
                        <FiUser />
                      </div>

                    )}

                  </div>


                  <div>

                    <h3 className="
                      font-bold
                      text-slate-800
                    ">
                      {selectedStudent.fullName}
                    </h3>

                    <p className="
                      text-xs
                      text-slate-400
                    ">
                      {selectedStudent.admissionNo}
                      {selectedStudent.regNo &&
                        ` • ${selectedStudent.regNo}`}
                    </p>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={closeStudent}
                  className="
                    w-9 h-9
                    rounded-lg
                    flex items-center
                    justify-center
                    text-slate-400
                    hover:bg-slate-100
                    hover:text-slate-700
                  "
                >

                  <FiX size={20} />

                </button>

              </div>


              {/* =========================================
                  FORM
              ========================================= */}

              <div className="p-5 space-y-7">


                {/* -----------------------------------------
                    PSYCHOMOTOR
                ----------------------------------------- */}

                <section>

                  <div className="mb-3">

                    <h4 className="
                      font-bold
                      text-slate-800
                    ">
                      Psychomotor Scores
                    </h4>

                    <p className="
                      text-xs
                      text-slate-400
                      mt-0.5
                    ">
                      Select the appropriate grade.
                    </p>

                  </div>


                  <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-3
                  ">

                    {PSYCHO_KEYS.map((key) => (

                      <ScoreSelector
                        key={key}
                        label={formatLabel(key)}
                        value={
                          selectedStudent
                            .psychoScores?.[key] || ""
                        }
                        onChange={(value) =>
                          updateNested(
                            selectedIndex,
                            "psychoScores",
                            key,
                            value
                          )
                        }
                      />

                    ))}

                  </div>

                </section>


                {/* -----------------------------------------
                    AFFECTIVE
                ----------------------------------------- */}

                <section>

                  <div className="mb-3">

                    <h4 className="
                      font-bold
                      text-slate-800
                    ">
                      Affective Scores
                    </h4>

                  </div>


                  <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-3
                  ">

                    {AFFECTIVE_KEYS.map((key) => (

                      <ScoreSelector
                        key={key}
                        label={formatLabel(key)}
                        value={
                          selectedStudent
                            .affectiveScores?.[key] || ""
                        }
                        onChange={(value) =>
                          updateNested(
                            selectedIndex,
                            "affectiveScores",
                            key,
                            value
                          )
                        }
                      />

                    ))}

                  </div>

                </section>


                {/* -----------------------------------------
                    TEACHER COMMENT
                ----------------------------------------- */}

                <section>

                  <div className="
                    flex items-center
                    gap-2
                    mb-3
                  ">

                    <FiMessageSquare
                      className="text-slate-500"
                    />

                    <h4 className="
                      font-bold
                      text-slate-800
                    ">
                      Class Teacher's Comment
                    </h4>

                  </div>


                  <textarea
                    value={
                      selectedStudent
                        .teacherComment?.text || ""
                    }
                    onChange={(e) =>
                      updateNested(
                        selectedIndex,
                        "teacherComment",
                        "text",
                        e.target.value
                      )
                    }
                    rows={4}
                    placeholder="Enter teacher's comment..."
                    className="
                      w-full
                      rounded-xl
                      border border-slate-200
                      px-4 py-3
                      text-sm
                      outline-none
                      resize-none
                      focus:border-slate-400
                      focus:ring-2
                      focus:ring-slate-100
                    "
                  />

                </section>


                {/* -----------------------------------------
                    GENERAL COMMENT
                ----------------------------------------- */}

                <section>

                  <label className="
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-2
                  ">
                    General Comment
                  </label>

                  <textarea
                    value={
                      selectedStudent.generalComment || ""
                    }
                    onChange={(e) =>
                      updateRecord(
                        selectedIndex,
                        {
                          generalComment:
                            e.target.value,
                        }
                      )
                    }
                    rows={3}
                    placeholder="Optional general comment..."
                    className="
                      w-full
                      rounded-xl
                      border border-slate-200
                      px-4 py-3
                      text-sm
                      outline-none
                      resize-none
                      focus:border-slate-400
                      focus:ring-2
                      focus:ring-slate-100
                    "
                  />

                </section>


                {/* -----------------------------------------
                    PROMOTION
                ----------------------------------------- */}

                <section>

                  <label className="
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                    mb-2
                  ">
                    Promotion
                  </label>

                  <select
                    value={
                      selectedStudent.promotion || "NIL"
                    }
                    onChange={(e) =>
                      updateRecord(
                        selectedIndex,
                        {
                          promotion: e.target.value,
                        }
                      )
                    }
                    className="
                      w-full
                      rounded-xl
                      border border-slate-200
                      px-4 py-3
                      text-sm
                      bg-white
                      outline-none
                      focus:border-slate-400
                    "
                  >

                    <option value="NIL">
                      NIL
                    </option>

                    <option value="Promoted">
                      Promoted
                    </option>

                    <option value="Not Promoted">
                      Not Promoted
                    </option>

                    <option value="Promoted on Trial">
                      Promoted on Trial
                    </option>

                  </select>

                </section>


                {/* -----------------------------------------
                    PRINCIPAL
                ----------------------------------------- */}

                {/* 
                  Intentionally disabled for now.
                  Principal comments will be handled later
                  according to your permission/business logic.
                */}

                <div className="
                  rounded-xl
                  border border-dashed
                  border-slate-200
                  bg-slate-50
                  px-4 py-3
                  text-xs
                  text-slate-400
                ">
                  Principal's comment will be handled
                  separately.
                </div>

              </div>


              {/* =========================================
                  FOOTER
              ========================================= */}

              <div className="
                sticky bottom-0
                bg-white
                border-t
                border-slate-100
                px-5 py-4
                flex items-center
                justify-between
                gap-3
              ">

                <button
                  type="button"
                  onClick={closeStudent}
                  className="
                    px-4 py-2.5
                    rounded-xl
                    text-sm
                    font-semibold
                    text-slate-600
                    hover:bg-slate-100
                  "
                >
                  Close
                </button>


                <button
                  type="button"
                  onClick={doneAndNext}
                  className="
                    px-5 py-2.5
                    rounded-xl
                    bg-slate-900
                    text-white
                    text-sm
                    font-semibold
                    hover:bg-slate-800
                    transition
                  "
                >

                  {selectedIndex <
                  records.length - 1
                    ? "Done & Next"
                    : "Done"}

                </button>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}


// ---------------------------------------------------------
// SCORE SELECTOR
// ---------------------------------------------------------

function ScoreSelector({
  label,
  value,
  onChange,
}) {

  const grades = ["A", "B", "C", "D"];

  return (

    <div className="
      flex items-center
      justify-between
      gap-3
      p-3
      rounded-xl
      border border-slate-200
      bg-slate-50/50
    ">

      <span className="
        text-sm
        font-medium
        text-slate-700
      ">
        {label}
      </span>


      <div className="flex gap-1.5">

        {grades.map((grade) => (

          <button
            key={grade}
            type="button"
            onClick={() => onChange(grade)}
            className={`
              w-8 h-8
              rounded-lg
              text-xs
              font-bold
              transition
              ${
                value === grade
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-100"
              }
            `}
          >
            {grade}
          </button>

        ))}

      </div>

    </div>

  );
}


// ---------------------------------------------------------
// LABEL FORMATTER
// ---------------------------------------------------------

function formatLabel(value) {

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export default UploadAdditionalRecords;