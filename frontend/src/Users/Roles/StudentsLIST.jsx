import { useEffect, useState } from "react";
import { mainApi } from "../../api";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaCheckCircle, 
    FaDownload, 
    FaUserCheck, 
    FaListUl, 
    FaInfoCircle, 
    FaCoins, 
    FaCalendarDay,
    FaExclamationTriangle
} from "react-icons/fa";
import { naira } from "../../staticFiles";

export default function StudentLIST() {
    const [classId, setClassId] = useState("");
    const [attdList, setAttdList] = useState([]);
    const [clazz, setClazz] = useState([]);
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState("blank");
    const [currentList, setCurrentList] = useState([]);

    const id = "SCH0001"; // Default Staff/User ID

    async function getRoles() {
        try {
            const res = await axios.get(`${mainApi}/user/staff/roles/${id}`);
            setStaff(res.data.staff);
            if (res.data.classes) {
                setClazz(res.data.classes);
            } else {
                setClazz([res.data.staff?.assignedClass].filter(Boolean));
            }
        } catch (error) {
            alert(error.response?.data?.msg || "Network Error. Try Again");
        }
    }

    useEffect(() => {
        getRoles();
    }, []);

    async function getList() {
        if (!classId) return alert("Please select a class first");
        setLoading(true);
        try {
            const api3 = `${mainApi}/students/work/${classId}`;
            const res = await axios.get(api3);
            setCurrentList(res.data.students || []);
            setAttdList(res.data.attendanceRecords || []);
            setView("attd");
        } catch (error) {
            alert(error.response?.data?.msg || "Network Error!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-800 font-sans">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800/50">
                            Staff Portal • {id}
                        </span>
                        <h1 className="text-2xl font-bold mt-2">Student & Class Management</h1>
                        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                            Track attendance, examine fee statuses, and manage academic performance records seamlessly.
                        </p>
                    </div>

                    {/* Class Selector Bar */}
                    {clazz.length > 0 && (
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-slate-800/80 backdrop-blur p-2 rounded-xl border border-slate-700/60">
                            <select 
                                value={classId}
                                onChange={(e) => setClassId(e.target.value)} 
                                className="bg-slate-900 text-sm text-slate-200 p-2.5 rounded-lg border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
                            >
                                <option value="">-- Select Assigned Class --</option>
                                {clazz.map((cls, idx) => (
                                    <option key={cls.classId || idx} value={cls.classId}>
                                        {cls.mainClass} ({cls.classId})
                                    </option>
                                ))}
                            </select>
                            <button 
                                onClick={getList} 
                                disabled={loading}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                            >
                                {loading ? "Loading..." : <>Fetch Records <FaDownload size={14}/></>}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* No Access Warning */}
            {clazz.length === 0 && (
                <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 text-amber-700 p-4 rounded-xl text-sm">
                    <FaExclamationTriangle className="text-lg shrink-0" />
                    <span>You do not currently have access to any assigned classes. Please contact your administrator.</span>
                </div>
            )}

            {/* Navigation Tabs (Only visible when class is loaded) */}
            {currentList.length > 0 && (
                <div className="flex border-b border-slate-200 space-x-4">
                    <button 
                        onClick={() => setView("attd")}
                        className={`flex items-center gap-2 pb-3 px-2 text-sm font-semibold border-b-2 transition-all cursor-pointer ${view === "attd" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                    >
                        <FaUserCheck /> Attendance
                    </button>
                    <button 
                        onClick={() => setView("list")}
                        className={`flex items-center gap-2 pb-3 px-2 text-sm font-semibold border-b-2 transition-all cursor-pointer ${view === "list" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                    >
                        <FaListUl /> Class Roster & Fees
                    </button>
                </div>
            )}

            {/* Content Views */}
            <AnimatePresence mode="wait">
                {view === "blank" && <BlankView key="blank" />}
                {view === "list" && <ViewList key="list" list={currentList} />}
                {view === "attd" && <TakeAttendance key="attd" prevList={attdList} classId={classId} list={currentList} />}
            </AnimatePresence>
        </div>
    );
}

// Default Blank View UI
function BlankView() {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-10 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center text-slate-500 bg-slate-50/50 space-y-3"
        >
            <div className="p-4 bg-indigo-50 rounded-full text-indigo-500">
                <FaInfoCircle size={32} />
            </div>
            <h3 className="font-semibold text-slate-800 text-lg">No Class Selected</h3>
            <p className="text-sm max-w-md">
                Select an assigned class from the drop-down menu above and click <b>Fetch Records</b> to view rosters or register attendance.
            </p>
        </motion.div>
    );
}

// Student List & Financial Analytics View
function ViewList({ list }) {
    const totalExpected = list.reduce((sum, student) => sum + (student.feeInfo?.total || 0), 0);
    const totalPaid = list.reduce((sum, student) => sum + (student.feeInfo?.paid || 0), 0);
    const totalOutstanding = list.reduce((sum, student) => sum + ((student.feeInfo?.total || 0) - (student.feeInfo?.paid || 0)), 0);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
        >
            {/* Analytics Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><FaCoins size={20} /></div>
                    <div>
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Expected</span>
                        <p className="text-lg font-bold text-slate-800">{naira}{totalExpected.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><FaCoins size={20} /></div>
                    <div>
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Collected</span>
                        <p className="text-lg font-bold text-emerald-600">{naira}{totalPaid.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-lg"><FaCoins size={20} /></div>
                    <div>
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Outstanding</span>
                        <p className="text-lg font-bold text-rose-600">{naira}{totalOutstanding.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Roster Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Class Roster</h3>
                    <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                        {list.length} Total Students
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3">Reg. Number</th>
                                <th className="px-6 py-3">Student Name</th>
                                <th className="px-6 py-3">Expected Fee</th>
                                <th className="px-6 py-3">Paid Fee</th>
                                <th className="px-6 py-3">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {list.map((student, i) => {
                                const total = student.feeInfo?.total || 0;
                                const paid = student.feeInfo?.paid || 0;
                                const balance = total - paid;
                                return (
                                    <tr key={student.regNo || i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-mono font-medium text-slate-800">{student.regNo}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {student.personalInfo?.surname?.toUpperCase()} {student.personalInfo?.firstName}
                                        </td>
                                        <td className="px-6 py-4">{naira}{total.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-emerald-600 font-medium">{naira}{paid.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-rose-600 font-medium">{naira}{balance.toLocaleString()}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}

// Attendance Component
function TakeAttendance({ list, classId, prevList }) {
    const [setUp, setSetUp] = useState(null);
    const [day, setDay] = useState("mon");
    const [attdList, setAttdList] = useState([]);

    useEffect(() => {
        const setting = JSON.parse(localStorage.getItem("site-settings"));
        setSetUp(setting);
        if (setting && list.length > 0) {
            initializeAttendance("mon", setting);
        }
    }, [list]);

    function initializeAttendance(dd, currentSetting = setUp) {
        if (!currentSetting) return;

        const dated = new Date().toISOString();
        const newList = list.map(({ regNo, realClassId }) => ({
            regNo,
            classId: realClassId || classId,
            term: currentSetting.currentTerm,
            session: currentSetting.currentSession,
            week: parseInt(currentSetting.schoolWeek),
            day: dd,
            dated,
            mor: false,
            aft: false,
            _id: `${regNo}-${realClassId || classId}${currentSetting.currentSession}${currentSetting.currentTerm}${currentSetting.schoolWeek}${dd}`
        }));

        setAttdList(newList);
    }

    const changeDay = (dy) => {
        setDay(dy);
        initializeAttendance(dy);
    };

    async function submitAttendance() {
        try {
            const res = await axios.post(`${mainApi}/students/attd`, attdList);
            alert(res.data.msg || "Attendance saved successfully!");
        } catch (error) {
            alert(error.response?.data?.msg || "Network Error, Try Again...");
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6"
        >
            {/* Attendance Top Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Daily Register</span>
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <FaCalendarDay /> 
                        {setUp ? `Week ${setUp.schoolWeek} • ${setUp.currentTerm} Term (${setUp.currentSession})` : "Attendance"}
                    </h2>
                </div>

                {/* Weekday Picker Tabs */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    {["mon", "tue", "wed", "thu", "fri"].map((dy) => (
                        <button
                            key={dy}
                            onClick={() => changeDay(dy)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase transition-all cursor-pointer ${
                                dy === day ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            {dy}
                        </button>
                    ))}
                </div>
            </div>

            {/* Student Attendance List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {attdList.map((item, index) => {
                    const studentInfo = list[index]?.personalInfo;
                    return (
                        <div key={item.regNo || index} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-slate-800 text-sm">
                                    {studentInfo?.surname?.toUpperCase()} {studentInfo?.firstName}
                                </p>
                                <span className="text-xs font-mono text-slate-500">{item.regNo}</span>
                            </div>

                            {/* Morning / Afternoon Toggles */}
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setAttdList(prev => prev.map(att => att.regNo === item.regNo ? { ...att, mor: !att.mor } : att))}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                        item.mor ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                                    }`}
                                >
                                    MOR {item.mor && <FaCheckCircle size={12} />}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setAttdList(prev => prev.map(att => att.regNo === item.regNo ? { ...att, aft: !att.aft } : att))}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                        item.aft ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                                    }`}
                                >
                                    AFT {item.aft && <FaCheckCircle size={12} />}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                    onClick={submitAttendance}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer text-sm"
                >
                    <FaCheckCircle /> Save Attendance Records
                </button>
            </div>
        </motion.div>
    );
}