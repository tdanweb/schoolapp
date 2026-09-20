
// for recording of weekly assessment....

import { useEffect, useState } from "react";
import { mainApi } from "../../api";
import axios from "axios";
import { FaBookOpen, FaTimes, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export function WeeklyCA() {

    const staffAPI = `${mainApi}/staff/duty/subjects/${JSON.parse(localStorage.getItem("logged-user")).user}`;

    const [assignedSubjects, setAssignedSubjects] = useState([]);
    const [load2, setLoad2] = useState(false);

    const [showSubjectOverlay, setShowSubjectOverlay] = useState(false);
    const [loadList, setLoadList] = useState(false);

    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [recordingList, setRecordingList] = useState([]);

    const [maxScore, setMaxScore] = useState("");
const [selectedDay, setSelectedDay] = useState("");

    // GET STAFF ASSIGNED SUBJECTS
    async function getAssignedSubjects() {
        setLoad2(true);

        try {

            const res = await axios.get(staffAPI);


            setAssignedSubjects(res.data.assignment || []);

            setShowSubjectOverlay(true);

        } catch (error) {

            if (error.response) {
                console.log(error.response?.data.msg);
            } else {
                console.log("Network Error");
            }

        } finally {
            setLoad2(false);
        }
    }


    // FETCH STUDENTS FOR SELECTED SUBJECT
    const fetchSubjectList = async (assignment) => {

        setLoadList(true);

        const parameters = new URLSearchParams({
            classId: assignment.forClass.classId,
            subject: assignment.subject,
            abb: assignment.abb
        });

        const getAPI =
            `${mainApi}/staff/uploading-weekly-ca/list?${parameters.toString()}`;

        try {

            const res = await axios.get(getAPI);


            const students = res.data.studentList || [];
            const previous = res.data.previousScores || [];


            // BUILD RECORDING LIST
            const list = students.map((student) => {

                // Look for an already existing weekly score
                const previousScore = previous.find(
                    (item) => item.studentId === student._id
                );


                // IF PREVIOUS SCORE EXISTS
                if (previousScore) {

                    return {
                        ...previousScore,

                        // Keep fullname from previousScores
                        fullname: previousScore.fullname,

                        // Make sure these student details are available
                        admissionNo:
                            previousScore.admissionNo || student.admissionNo,

                        regNo:
                            previousScore.regNo || student.regNo,

                        passportUrl:
                            previousScore.passportUrl || student.passportUrl
                    };
                }


                // CREATE NEW RECORD FOR STUDENT
                const fullname = [
                    student.personalInfo?.surname,
                    student.personalInfo?.firstName,
                    student.personalInfo?.otherName
                ]
                    .filter(Boolean)
                    .join(" ");


                return {

                    studentId: student._id,

                    admissionNo: student.admissionNo,

                    regNo: student.regNo,

                    passportUrl: student.passportUrl,

                    fullname,

                    score: 0,

                    max: 0
                };
            });


            // SAVE SELECTED ASSIGNMENT
            setSelectedAssignment(assignment);


            // SAVE FINAL RECORDING LIST
            setRecordingList(list);


            // CLOSE SUBJECT SELECTION
            setShowSubjectOverlay(false);


        } catch (error) {

            console.log(
                error.response?.data.msg ||
                "Network/Connectivity Error..."
            );

        } finally {

            setLoadList(false);
        }
    };
// UPDATE A STUDENT'S SCORE
const updateScore = (studentId, value) => {

    const score = Number(value);

    setRecordingList((prev) =>
        prev.map((student) => {

            if (student.studentId !== studentId) {
                return student;
            }

            return {
                ...student,
                score:
                    value === ""
                        ? ""
                        : Math.min(Math.max(score, 0), Number(maxScore) || 0)
            };
        })
    );
};

// SUBMIT WEEKLY RECORD
const [postLoad, setPostLoad] = useState(false);
const [resMsg, setResMsg] = useState("")
const submitRecord = async () => {

    if (!maxScore) {
        setResMsg("Please enter the maximum score.");
        return;
    }

    if (!selectedDay) {
        setResMsg("Please select a day.");
        return;
    }

    const finalRecord = recordingList.map((student) => ({
        ...student,
        max: Number(maxScore),
        day: selectedDay
    }));


    //posting reports
    setPostLoad(true)
    const postAPI = `${mainApi}/results/upload-results/weekly?token=${JSON.parse(localStorage.getItem("logged-user")).token}`
    try {
        const res = await axios.post(postAPI, {
        assignment: selectedAssignment,
        max: Number(maxScore),
        day: selectedDay,
        records: finalRecord 
        });

        setResMsg(res.data.msg)
    } catch (error) {
        if(error.response){
            setResMsg(error.response.data.msg)
        } else{
            setResMsg("Network/Server Error...")
        }
    } finally{
        setPostLoad(false)
    }
};

    useEffect(() => {
        getAssignedSubjects();
    }, []);


    return (

        <div className="w-full">
{resMsg && (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">

        <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center">

            {/* CLOSE */}
            <button
                onClick={() => setResMsg("")}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
                <FaTimes size={15} />
            </button>


            {/* CREST */}
            <img
                src="/crest.png"
                alt="School Crest"
                className="w-16 h-16 object-contain mx-auto mb-4"
            />


            {/* MESSAGE */}
            <p className="text-sm font-medium text-slate-700 leading-relaxed">
                {resMsg}
            </p>


            {/* CLOSE BUTTON */}
            <button
                onClick={() => setResMsg("")}
                className="mt-5 px-5 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
            >
                CLOSE
            </button>

        </div>

    </div>
)}
            {/* PAGE HEADER */}
            <div className="mb-6">

                <h1 className="text-xl font-bold text-slate-800">
                    Weekly CA Recording
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                    Record weekly continuous assessment for your assigned subjects.
                </p>

            </div>


            {/* SELECT SUBJECT BUTTON */}
            {!selectedAssignment && (

                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">

                    <FaBookOpen
                        className="mx-auto text-slate-300"
                        size={32}
                    />

                    <p className="text-sm text-slate-500 mt-3">
                        Select one of your assigned subjects to begin.
                    </p>

                    <button
                        onClick={() => setShowSubjectOverlay(true)}
                        className="mt-4 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
                    >
                        SELECT SUBJECT
                    </button>

                </div>
            )}


            {/* SELECTED SUBJECT */}
            {selectedAssignment && (

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-xs text-slate-400 uppercase font-semibold">
                                Selected Subject
                            </p>

                            <h2 className="text-lg font-bold text-slate-800 mt-1">
                                {selectedAssignment.subject}
                            </h2>

                            <p className="text-sm text-slate-500">
                                {selectedAssignment.forClass.classId}
                            </p>

                        </div>


                        <button
                            onClick={() => setShowSubjectOverlay(true)}
                            className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold hover:bg-slate-50"
                        >
                            Change Subject
                        </button>

                    </div>

{/* WEEKLY CA SETTINGS */}
<div className="mt-6 border-t border-slate-100 pt-5">

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* MAX SCORE */}
        <div>

            <label className="block text-xs font-semibold text-slate-600 mb-2">
                MAXIMUM SCORE
            </label>

            <input
                type="number"
                min="1"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                placeholder="e.g. 10"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400"
            />

        </div>


        {/* DAY */}
        <div>

            <label className="block text-xs font-semibold text-slate-600 mb-2">
                DAY
            </label>

            <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400"
            >

                <option value="">
                    Select day
                </option>

                <option value="mon">
                    Monday
                </option>

                <option value="tue">
                    Tuesday
                </option>

                <option value="wed">
                    Wednesday
                </option>

                <option value="thu">
                    Thursday
                </option>

                <option value="fri">
                    Friday
                </option>

            </select>

        </div>

    </div>


    {/* STUDENT COUNT */}
    <div className="mt-4">

        <p className="text-xs text-slate-500">
            Students:{" "}
            <span className="font-semibold text-slate-700">
                {recordingList.length}
            </span>
        </p>

    </div>

</div>


{/* RECORDING TABLE */}
<div className="mt-5 overflow-x-auto border border-slate-200 rounded-xl">

    <table className="w-full text-sm">

        <thead className="bg-slate-50 border-b border-slate-200">

            <tr>

                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                    #
                </th>

                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                    STUDENT
                </th>

                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                    ADMISSION NO.
                </th>

                <th className="text-left px-4 py-3 font-semibold text-slate-600">
                    SCORE
                </th>

            </tr>

        </thead>


        <tbody>

            {recordingList.map((student, index) => (

                <tr
                    key={student.studentId}
                    className="border-b border-slate-100 last:border-b-0"
                >

                    {/* NUMBER */}
                    <td className="px-4 py-4 text-slate-400">
                        {index + 1}
                    </td>


                    {/* STUDENT */}
                    <td className="px-4 py-4">

                        <p className="font-semibold text-slate-800">
                            {student.fullname}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                            {student.regNo}
                        </p>

                    </td>


                    {/* ADMISSION NUMBER */}
                    <td className="px-4 py-4">

                        <span className="font-bold text-slate-700">
                            {student.admissionNo}
                        </span>

                    </td>


                    {/* SCORE */}
                    <td className="px-4 py-4">

                        <div className="flex items-center gap-2">

                            <input
                                type="number"
                                min="0"
                                max={maxScore || undefined}
                                value={student.score}
                                onChange={(e) =>
                                    updateScore(
                                        student.studentId,
                                        e.target.value
                                    )
                                }
                                className="w-20 border border-slate-200 rounded-lg px-3 py-2 text-sm text-center outline-none focus:border-slate-400"
                            />

                            <span className="text-xs text-slate-400">
                                / {maxScore || "--"}
                            </span>

                        </div>

                    </td>

                </tr>

            ))}


            {recordingList.length === 0 && (

                <tr>

                    <td
                        colSpan="4"
                        className="px-4 py-10 text-center text-sm text-slate-400"
                    >
                        No students available.
                    </td>

                </tr>

            )}

        </tbody>

    </table>

</div>


{/* SUBMIT */}
<div className="mt-5 flex justify-end">

    <button
        onClick={submitRecord}
        disabled={postLoad}
        className={`px-6 py-3 rounded-xl bg-slate-900 text-white ${postLoad && 'opacity-1/4'} text-sm font-semibold hover:bg-slate-800 transition`}
    >
        {!postLoad && "SUBMIT RECORD"}
        {postLoad && "Submission in Progress..."}
    </button>

</div>

                </div>
            )}


            {/* SUBJECT SELECTION OVERLAY */}
            <AnimatePresence>

                {showSubjectOverlay && (

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                    >

                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.98 }}
                            className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden"
                        >

                            {/* OVERLAY HEADER */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">

                                <div>

                                    <h2 className="font-bold text-slate-800">
                                        Select Subject
                                    </h2>

                                    <p className="text-xs text-slate-500 mt-1">
                                        Choose one of your assigned subjects.
                                    </p>

                                </div>


                                <button
                                    onClick={() => setShowSubjectOverlay(false)}
                                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                                >
                                    <FaTimes />
                                </button>

                            </div>


                            {/* SUBJECT LIST */}
                            <div className="p-4 max-h-[65vh] overflow-y-auto">

                                {load2 ? (

                                    <div className="py-10 text-center text-sm text-slate-500">
                                        Loading assigned subjects...
                                    </div>

                                ) : assignedSubjects.length === 0 ? (

                                    <div className="py-10 text-center text-sm text-slate-500">
                                        No assigned subjects found.
                                    </div>

                                ) : (

                                    <div className="space-y-2">

                                        {assignedSubjects.map((assignment, index) => (

                                            <button
                                                key={`${assignment.abb}-${assignment.forClass.classId}-${index}`}
                                                onClick={() => fetchSubjectList(assignment)}
                                                disabled={loadList}
                                                className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition text-left disabled:opacity-60"
                                            >

                                                <div>

                                                    <p className="font-semibold text-sm text-slate-800">
                                                        {assignment.subject}
                                                    </p>

                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {assignment.forClass.classId}
                                                    </p>

                                                    <p className="text-[11px] text-slate-400 mt-1">
                                                        {assignment.abb}
                                                    </p>

                                                </div>


                                                <FaChevronRight
                                                    className="text-slate-400"
                                                    size={14}
                                                />

                                            </button>

                                        ))}

                                    </div>

                                )}

                            </div>


                            {/* LOADING WHEN FETCHING STUDENTS */}
                            {loadList && (

                                <div className="px-5 py-3 border-t border-slate-100 text-center text-xs text-slate-500">
                                    Loading student list...
                                </div>

                            )}

                        </motion.div>

                    </motion.div>

                )}

            </AnimatePresence>

        </div>
    );
}
