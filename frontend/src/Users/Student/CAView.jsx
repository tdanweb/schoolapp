import axios from "axios";
import { mainApi } from "../../api";
import { useEffect, useMemo, useState } from "react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import {
    FaChartLine,
    FaBook,
    FaCalendarWeek,
    FaTrophy
} from "react-icons/fa";


export default function WeeklyCAView() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState("");

    async function getUser() {

        const id = JSON.parse(localStorage.getItem("logged-user"));

        const regNo = id.user;

        try {

            const res = await axios.get(
                `${mainApi}/results/weekly/student?regNo=${regNo}`
            );

            setData(res.data);

            // Select first subject automatically
            if (res.data.subjects?.length > 0) {
                setSelectedSubject(res.data.subjects[0]);
            }

        } catch (error) {

            if (error.response) {
                console.log(error.response.data);
            }

        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        getUser();
    }, []);


    /*
    -----------------------------------------
    BASIC DATA
    -----------------------------------------
    */

    const scores = data?.thisTermScores || [];

    const currentWeek = Number(data?.appSettings?.schoolWeek || 0);


    /*
    -----------------------------------------
    STUDENT NAME
    -----------------------------------------
    */

    const studentName = useMemo(() => {

        const student = scores[0]?.studentId?.personalInfo;

        if (!student) return "Student";

        return [
            student.firstName,
            student.otherName,
            student.surname
        ]
            .filter(Boolean)
            .join(" ");

    }, [scores]);


    /*
    -----------------------------------------
    AVAILABLE WEEKS
    -----------------------------------------
    */

    const availableWeeks = useMemo(() => {

        return [...new Set(
            scores.map(item => Number(item.week))
        )]
        .sort((a, b) => a - b);

    }, [scores]);


    /*
    -----------------------------------------
    SUBJECT GRAPH
    -----------------------------------------
    
    Converts:

    score: 22
    max: 30

    into:

    percentage: 73.33
    */

    const subjectGraphData = useMemo(() => {

        return availableWeeks.map(week => {

            const record = scores.find(
                item =>
                    item.subject === selectedSubject &&
                    Number(item.week) === week
            );

            if (!record) {
                return {
                    week: `Week ${week}`,
                    percentage: null,
                    score: null,
                    max: null
                };
            }

            const percentage =
                record.max > 0
                    ? Number(((record.score / record.max) * 100).toFixed(1))
                    : 0;

            return {
                week: `Week ${week}`,
                percentage,
                score: record.score,
                max: record.max
            };

        });

    }, [scores, selectedSubject, availableWeeks]);


    /*
    -----------------------------------------
    OVERALL GRAPH
    -----------------------------------------
    
    Average percentage of all subjects
    recorded for each week.
    */

    const overallGraphData = useMemo(() => {

        return availableWeeks.map(week => {

            const weekScores = scores.filter(
                item => Number(item.week) === week
            );

            if (!weekScores.length) {
                return {
                    week: `Week ${week}`,
                    percentage: null
                };
            }

            const percentages = weekScores.map(item => {

                if (!item.max) return 0;

                return (item.score / item.max) * 100;

            });

            const average =
                percentages.reduce(
                    (total, value) => total + value,
                    0
                ) / percentages.length;

            return {
                week: `Week ${week}`,
                percentage: Number(average.toFixed(1))
            };

        });

    }, [scores, availableWeeks]);


    /*
    -----------------------------------------
    CURRENT WEEK RECORDS
    -----------------------------------------
    */

    const currentWeekScores = scores.filter(
        item => Number(item.week) === currentWeek
    );


    /*
    -----------------------------------------
    CURRENT WEEK AVERAGE
    -----------------------------------------
    */

    const currentWeekAverage = useMemo(() => {

        if (!currentWeekScores.length) return 0;

        const percentages = currentWeekScores.map(item => {

            if (!item.max) return 0;

            return (item.score / item.max) * 100;

        });

        const average =
            percentages.reduce(
                (total, value) => total + value,
                0
            ) / percentages.length;

        return average.toFixed(1);

    }, [currentWeekScores]);


    /*
    -----------------------------------------
    LOADING
    -----------------------------------------
    */

    if (loading) {
        return (
            <div className="p-6 text-center text-slate-500">
                Loading weekly performance...
            </div>
        );
    }


    /*
    -----------------------------------------
    UI
    -----------------------------------------
    */

    return (

        <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">

            {/* HEADER */}

            <div>

                <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                    Weekly Performance
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                    {studentName}
                </p>

            </div>


            {/* SUMMARY CARDS */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">


                {/* CURRENT WEEK */}

                <div className="bg-white border border-slate-200 rounded-2xl p-4">

                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <FaCalendarWeek />
                        Current Week
                    </div>

                    <p className="text-2xl font-bold mt-2 text-slate-800">
                        {currentWeek}
                    </p>

                </div>


                {/* RECORDED SUBJECTS */}

                <div className="bg-white border border-slate-200 rounded-2xl p-4">

                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <FaBook />
                        Recorded
                    </div>

                    <p className="text-2xl font-bold mt-2 text-slate-800">
                        {currentWeekScores.length}
                    </p>

                    <p className="text-xs text-slate-400">
                        subjects this week
                    </p>

                </div>


                {/* CURRENT AVERAGE */}

                <div className="bg-white border border-slate-200 rounded-2xl p-4">

                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <FaChartLine />
                        Current Average
                    </div>

                    <p className="text-2xl font-bold mt-2 text-slate-800">
                        {currentWeekAverage}%
                    </p>

                </div>


                {/* WEEKS AVAILABLE */}

                <div className="bg-white border border-slate-200 rounded-2xl p-4">

                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <FaTrophy />
                        Weeks
                    </div>

                    <p className="text-2xl font-bold mt-2 text-slate-800">
                        {availableWeeks.length}
                    </p>

                    <p className="text-xs text-slate-400">
                        with recorded scores
                    </p>

                </div>

            </div>


            {/* SUBJECT PERFORMANCE */}

            <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

                    <div>

                        <h3 className="font-bold text-slate-800">
                            Subject Performance
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                            Performance across available weeks
                        </p>

                    </div>


                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none bg-white"
                    >

                        {data?.subjects?.map(subject => (
                            <option
                                key={subject}
                                value={subject}
                            >
                                {subject}
                            </option>
                        ))}

                    </select>

                </div>


                <div className="w-full h-[280px]">

                    <ResponsiveContainer width="100%" height="100%">

                        <LineChart data={subjectGraphData}>

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="week" />

                            <YAxis
                                domain={[0, 100]}
                                unit="%"
                            />

                            <Tooltip
                                formatter={(value) => [
                                    `${value}%`,
                                    "Performance"
                                ]}
                            />

                            <Line
                                type="monotone"
                                dataKey="percentage"
                                stroke="#2563eb"
                                strokeWidth={3}
                                connectNulls
                                dot={{ r: 5 }}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

            </div>


            {/* OVERALL PERFORMANCE */}

            <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6">

                <div className="mb-6">

                    <h3 className="font-bold text-slate-800">
                        Overall Performance
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                        Average performance across all recorded subjects
                    </p>

                </div>


                <div className="w-full h-[300px]">

                    <ResponsiveContainer width="100%" height="100%">

                        <LineChart data={overallGraphData}>

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="week" />

                            <YAxis
                                domain={[0, 100]}
                                unit="%"
                            />

                            <Tooltip
                                formatter={(value) => [
                                    `${value}%`,
                                    "Average"
                                ]}
                            />

                            <Line
                                type="monotone"
                                dataKey="percentage"
                                stroke="#16a34a"
                                strokeWidth={3}
                                connectNulls
                                dot={{ r: 5 }}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

            </div>


            {/* CURRENT WEEK SUBJECT BREAKDOWN */}

            <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6">

                <h3 className="font-bold text-slate-800 mb-4">
                    Week {currentWeek} Breakdown
                </h3>


                <div className="space-y-3">

                    {currentWeekScores.length === 0 ? (

                        <p className="text-sm text-slate-500">
                            No scores have been recorded for this week.
                        </p>

                    ) : (

                        currentWeekScores.map((item, index) => {

                            const percentage =
                                item.max > 0
                                    ? ((item.score / item.max) * 100).toFixed(1)
                                    : 0;

                            return (

                                <div
                                    key={`${item.subject}-${index}`}
                                    className="flex items-center justify-between border-b border-slate-100 pb-3"
                                >

                                    <div>

                                        <p className="font-medium text-sm text-slate-700">
                                            {item.subject}
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            {item.score} / {item.max}
                                            {" • "}
                                            {item.day?.toUpperCase()}
                                        </p>

                                    </div>


                                    <div className="text-right">

                                        <p className="font-bold text-sm text-slate-800">
                                            {percentage}%
                                        </p>

                                    </div>

                                </div>

                            );

                        })

                    )}

                </div>

            </div>

        </div>

    );
}