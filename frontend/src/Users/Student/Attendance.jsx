import { useEffect, useMemo, useState } from "react";
import {
    FaCalendarCheck,
    FaChartLine,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaUserGraduate,
} from "react-icons/fa";

import { mockStudents, mockAttendance } from "../../dataBase";

// ----------------------------------
// HELPERS
// ----------------------------------

function calculateAttendance(records, mode = "both") {
    let expected = 0;
    let present = 0;

    records.forEach((record) => {

        if (mode === "morning" || mode === "both") {
            expected++;

            if (record.mor) {
                present++;
            }
        }

        if (mode === "afternoon" || mode === "both") {
            expected++;

            if (record.aft) {
                present++;
            }
        }
    });

    const percentage = expected
        ? Math.round((present / expected) * 100)
        : 0;

    return {
        expected,
        present,
        absent: expected - present,
        percentage,
    };
}


function getWeeklyData(records, mode = "both") {
    const grouped = {};

    records.forEach((record) => {
        if (!grouped[record.week]) {
            grouped[record.week] = [];
        }

        grouped[record.week].push(record);
    });

    return Object.entries(grouped).map(
        ([week, weekRecords]) => ({
            week: `Week ${week}`,
            ...calculateAttendance(
                weekRecords,
                mode
            ),
        })
    );
}


// ----------------------------------
// MAIN COMPONENT
// ----------------------------------

export default function StudentAttendance() {

    const [students] = useState(mockStudents);
    const [attendance] = useState(mockAttendance);

    const [currentStudent, setCurrentStudent] =
        useState(mockStudents[0]);

    // Universal school setting
    const attendanceMode = "both";

    const [currentWeek] = useState(2);


    // ----------------------------------
    // CURRENT STUDENT RECORDS
    // ----------------------------------

    const currentAttendance = useMemo(() => {

        if (!currentStudent?.regNo) {
            return [];
        }

        return attendance.filter(
            record =>
                record.regNo === currentStudent.regNo
        );

    }, [attendance, currentStudent]);


    // ----------------------------------
    // TERM SUMMARY
    // ----------------------------------

    const termSummary = useMemo(() => {

        return calculateAttendance(
            currentAttendance,
            attendanceMode
        );

    }, [currentAttendance, attendanceMode]);


    // ----------------------------------
    // CURRENT WEEK
    // ----------------------------------

    const thisWeekAttendance = useMemo(() => {

        return currentAttendance.filter(
            record =>
                record.week === currentWeek
        );

    }, [currentAttendance, currentWeek]);


    const thisWeekSummary = useMemo(() => {

        return calculateAttendance(
            thisWeekAttendance,
            attendanceMode
        );

    }, [thisWeekAttendance, attendanceMode]);


    // ----------------------------------
    // WEEKLY GRAPH DATA
    // ----------------------------------

    const weeklyData = useMemo(() => {

        return getWeeklyData(
            currentAttendance,
            attendanceMode
        );

    }, [currentAttendance, attendanceMode]);


    return (
        <div className="w-full max-w-6xl mx-auto p-4 space-y-5">

            {/* HEADER */}
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                    Student Attendance
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                    First Term • 2026/2027 Academic Session
                </p>
            </div>


            {/* STUDENT SELECTOR */}
            {students.length > 1 && (
                <div className="bg-white border rounded-xl p-4">

                    <label className="text-xs font-semibold text-slate-500 uppercase">
                        Select Student
                    </label>

                    <select
                        value={currentStudent?.regNo || ""}
                        onChange={(e) => {

                            const student =
                                students.find(
                                    item =>
                                        item.regNo === e.target.value
                                );

                            setCurrentStudent(student);
                        }}
                        className="
                            w-full mt-2
                            border border-slate-200
                            rounded-lg
                            px-3 py-3
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "
                    >

                        {students.map(student => (
                            <option
                                key={student.regNo}
                                value={student.regNo}
                            >
                                {student.fullname} — {student.classId}
                            </option>
                        ))}

                    </select>
                </div>
            )}


            {/* STUDENT INFO */}
            <div className="
                bg-white border rounded-xl
                p-4 flex items-center gap-3
            ">

                <div className="
                    w-12 h-12
                    rounded-full
                    bg-slate-100
                    flex items-center justify-center
                    text-slate-500
                ">
                    <FaUserGraduate />
                </div>

                <div>
                    <h2 className="font-bold text-slate-800">
                        {currentStudent?.fullname}
                    </h2>

                    <p className="text-xs text-slate-500">
                        {currentStudent?.classId} •{" "}
                        {currentStudent?.regNo}
                    </p>
                </div>

            </div>


            {/* SUMMARY CARDS */}
            <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-4
            ">

                <SummaryCard
                    icon={<FaCalendarCheck />}
                    title="Term Attendance"
                    value={`${termSummary.percentage}%`}
                    subtitle={`${termSummary.present} of ${termSummary.expected} sessions`}
                />

                <SummaryCard
                    icon={<FaClock />}
                    title="This Week"
                    value={`${thisWeekSummary.percentage}%`}
                    subtitle={`Week ${currentWeek}`}
                />

                <SummaryCard
                    icon={<FaCheckCircle />}
                    title="Present"
                    value={termSummary.present}
                    subtitle={`${termSummary.absent} absent`}
                />

            </div>


            {/* ATTENDANCE TREND */}
            <div className="
                bg-white
                border
                rounded-xl
                p-4
            ">

                <div className="flex items-center gap-2 mb-5">

                    <FaChartLine className="text-slate-500" />

                    <div>
                        <h3 className="font-bold text-slate-800">
                            Attendance Trend
                        </h3>

                        <p className="text-xs text-slate-500">
                            Weekly attendance percentage
                        </p>
                    </div>

                </div>


                {/* Simple CSS GRAPH */}
                <div className="
                    flex items-end
                    gap-3
                    h-48
                    overflow-x-auto
                    pb-2
                ">

                    {weeklyData.map(item => (

                        <div
                            key={item.week}
                            className="
                                min-w-[55px]
                                h-full
                                flex
                                flex-col
                                justify-end
                                items-center
                                gap-2
                            "
                        >

                            <span className="
                                text-xs
                                font-semibold
                                text-slate-600
                            ">
                                {item.percentage}%
                            </span>

                            <div
                                className="
                                    w-8
                                    bg-slate-700
                                    rounded-t-md
                                    transition-all
                                "
                                style={{
                                    height: `${Math.max(
                                        item.percentage,
                                        5
                                    )}%`
                                }}
                            />

                            <span className="
                                text-[10px]
                                text-slate-500
                            ">
                                {item.week.replace("Week ", "W")}
                            </span>

                        </div>

                    ))}

                </div>

            </div>


            {/* THIS WEEK */}
            <div className="
                bg-white
                border
                rounded-xl
                overflow-hidden
            ">

                <div className="p-4 border-b">

                    <h3 className="font-bold text-slate-800">
                        Week {currentWeek} Attendance
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                        Daily attendance record
                    </p>

                </div>


                <div className="divide-y">

                    {thisWeekAttendance.map(record => {

                        const present =
                            attendanceMode === "morning"
                                ? record.mor
                                : attendanceMode === "afternoon"
                                    ? record.aft
                                    : record.mor && record.aft;

                        return (
                            <div
                                key={record._id}
                                className="
                                    p-4
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                "
                            >

                                <div>
                                    <p className="
                                        font-medium
                                        text-slate-700
                                    ">
                                        {record.day}
                                    </p>

                                    <p className="
                                        text-xs
                                        text-slate-400
                                    ">
                                        {new Date(
                                            record.dated
                                        ).toLocaleDateString(
                                            "en-GB",
                                            {
                                                day: "numeric",
                                                month: "short",
                                            }
                                        )}
                                    </p>
                                </div>


                                <div className="
                                    flex items-center gap-2
                                ">

                                    {record.mor && (
                                        <span className="
                                            text-[10px]
                                            px-2 py-1
                                            rounded-full
                                            bg-slate-100
                                            text-slate-600
                                        ">
                                            Morning
                                        </span>
                                    )}

                                    {record.aft && (
                                        <span className="
                                            text-[10px]
                                            px-2 py-1
                                            rounded-full
                                            bg-slate-100
                                            text-slate-600
                                        ">
                                            Afternoon
                                        </span>
                                    )}

                                    {present ? (
                                        <FaCheckCircle className="text-green-600" />
                                    ) : (
                                        <FaTimesCircle className="text-red-500" />
                                    )}

                                </div>

                            </div>
                        );
                    })}

                </div>

            </div>


            {/* FOOTER SUMMARY */}
            <div className="
                text-center
                text-xs
                text-slate-400
                pb-4
            ">
                Attendance is calculated based on the school's
                configured attendance settings.
            </div>

        </div>
    );
}


// ----------------------------------
// SUMMARY CARD
// ----------------------------------

function SummaryCard({
    icon,
    title,
    value,
    subtitle
}) {
    return (
        <div className="
            bg-white
            border
            rounded-xl
            p-4
        ">

            <div className="
                flex
                items-center
                justify-between
            ">

                <div>
                    <p className="
                        text-xs
                        uppercase
                        tracking-wide
                        text-slate-400
                    ">
                        {title}
                    </p>

                    <p className="
                        text-2xl
                        font-bold
                        text-slate-800
                        mt-1
                    ">
                        {value}
                    </p>

                    <p className="
                        text-xs
                        text-slate-500
                        mt-1
                    ">
                        {subtitle}
                    </p>
                </div>

                <div className="
                    w-10 h-10
                    rounded-lg
                    bg-slate-100
                    flex
                    items-center
                    justify-center
                    text-slate-600
                ">
                    {icon}
                </div>

            </div>

        </div>
    );
}