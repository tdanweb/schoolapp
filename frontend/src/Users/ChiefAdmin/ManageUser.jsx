import { useState, useEffect } from "react";
import { mainApi } from "../../api";
import axios from "axios";
import {
    FaCheck,
    FaCheckCircle,
    FaClock,
    FaPhone,
    FaShieldAlt,
    FaUser,
    FaUserCheck,
    FaUserCircle,
    FaTimes,
    FaExclamationTriangle
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";


export function ViewUser() {

    const [savedUsers, setSavedUsers] = useState(null);
    const [page, setPage] = useState(1);
    const LIMIT = 40;

    const api = mainApi + "/users";

    const userAllowed = true;

    // Selected user
    const [selection, setSelection] = useState(null);

    // Confirmation/result overlay
    const [overlay2, setOverlay2] = useState(false);
    const [approval, setApproval] = useState(null);
    const [loading, setLoading] = useState(false);


    if (!userAllowed) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-5">
                <div className="bg-white border border-red-200 rounded-2xl p-8 text-center shadow-sm max-w-md">
                    <FaShieldAlt className="mx-auto text-red-500 text-3xl mb-4" />

                    <h2 className="font-bold text-slate-800 text-lg">
                        Access Restricted
                    </h2>

                    <p className="text-sm text-slate-500 mt-2">
                        Only authorized administrators can access this section.
                    </p>
                </div>
            </div>
        );
    }


    // Fetch users
    async function fetchUser() {

        try {

            const allUsers = await axios.get(api);

            console.log(allUsers.data);

            setSavedUsers(allUsers.data.users);

        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        fetchUser();
    }, []);


    // Approve user
    async function approveUser() {

        if (!selection) return;

        setLoading(true);

        try {

            const api2 = `${mainApi}/user/approve`;

            const approving = await axios.put(api2, {
                user: selection,
                regNo: "SCH0018"
            });

            setApproval(approving.data);
            setOverlay2(true);

            setSavedUsers(prev =>
                prev.map(user =>
                    user.regNo === selection
                        ? {
                            ...user,
                            approved: true
                        }
                        : user
                )
            );

        } catch (error) {

            console.log(error);

            setApproval({
                msg:
                    error.response?.data?.msg ||
                    "Unable to approve this account."
            });

            setOverlay2(true);

        } finally {
            setLoading(false);
        }
    }


    const hideBtn = () => {
        setApproval(null);
        setSelection(null);
        setOverlay2(false);
    };


    const selectedUser = savedUsers?.find(
        user => user.regNo === selection
    );


    return (

        <div className="min-h-full bg-slate-50 p-3 sm:p-5 md:p-7">

            {/* =========================
                CONFIRMATION OVERLAY
            ========================== */}

            <AnimatePresence>

                {selection && (

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
                    >

                        {!overlay2 ? (

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 30,
                                    scale: 0.96
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1
                                }}
                                exit={{
                                    opacity: 0,
                                    y: 20,
                                    scale: 0.96
                                }}
                                transition={{
                                    duration: 0.25
                                }}
                                className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                            >

                                {/* Modal Header */}

                                <div className="bg-slate-900 px-5 sm:px-6 py-5 flex items-center justify-between">

                                    <div className="flex items-center gap-3">

                                        <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                                            <FaUserCheck />
                                        </div>

                                        <div>

                                            <h3 className="font-bold text-white">
                                                Approve Account
                                            </h3>

                                            <p className="text-xs text-slate-400">
                                                Chief Admin authorization
                                            </p>

                                        </div>

                                    </div>


                                    <button
                                        onClick={hideBtn}
                                        className="w-8 h-8 rounded-lg bg-white/10 text-slate-300 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition"
                                    >
                                        <FaTimes size={13} />
                                    </button>

                                </div>


                                {/* Modal Body */}

                                <div className="p-5 sm:p-6">

                                    <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">

                                        <div className="w-12 h-12 shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                            <FaUserCircle size={28} />
                                        </div>

                                        <div className="min-w-0">

                                            <p className="font-bold text-slate-800 truncate">
                                                {selectedUser?.fullname || "Selected User"}
                                            </p>

                                            <p className="text-xs text-slate-500 mt-1">
                                                Registration No:
                                                <span className="font-semibold text-slate-700 ml-1">
                                                    {selectedUser?.regNo}
                                                </span>
                                            </p>

                                            <span className="inline-block mt-2 text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-blue-100 text-blue-700">
                                                {selectedUser?.thisUser}
                                            </span>

                                        </div>

                                    </div>


                                    {/* Warning */}

                                    <div className="mt-5 flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">

                                        <FaExclamationTriangle className="text-amber-600 mt-0.5 shrink-0" />

                                        <p className="text-xs sm:text-sm text-amber-800 leading-5">
                                            Are you sure you want to approve this
                                            user account? The user will be granted
                                            access according to their assigned
                                            account permissions.
                                        </p>

                                    </div>


                                    {/* Buttons */}

                                    <div className="grid grid-cols-2 gap-3 mt-6">

                                        <button
                                            onClick={hideBtn}
                                            disabled={loading}
                                            className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition disabled:opacity-50"
                                        >
                                            CANCEL
                                        </button>

                                        <button
                                            onClick={approveUser}
                                            disabled={loading}
                                            className="px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
                                        >

                                            {loading ? (
                                                <>
                                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                    APPROVING...
                                                </>
                                            ) : (
                                                <>
                                                    <FaCheck />
                                                    APPROVE
                                                </>
                                            )}

                                        </button>

                                    </div>

                                </div>

                            </motion.div>

                        ) : (

                            /* =========================
                               RESULT OVERLAY
                            ========================== */

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.9
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1
                                }}
                                className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
                            >

                                <div className="bg-emerald-600 p-6 text-center">

                                    <div className="w-16 h-16 mx-auto rounded-full bg-white/15 flex items-center justify-center text-white">

                                        <FaCheckCircle size={36} />

                                    </div>

                                    <h3 className="text-white font-bold text-xl mt-4">
                                        Action Completed
                                    </h3>

                                </div>


                                <div className="p-6 text-center">

                                    <p className="text-sm leading-6 text-slate-600">
                                        {approval?.msg ||
                                            "The user account has been successfully approved."}
                                    </p>

                                    <button
                                        onClick={hideBtn}
                                        className="mt-6 w-full py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
                                    >
                                        DONE
                                    </button>

                                </div>

                            </motion.div>

                        )}

                    </motion.div>

                )}

            </AnimatePresence>


            {/* =========================
                PAGE HEADER
            ========================== */}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

                <div>

                    <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-sm">
                            <FaShieldAlt />
                        </div>

                        <div>

                            <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                                Manage User Accounts
                            </h1>

                            <p className="text-xs md:text-sm text-slate-500 mt-1">
                                Activate and manage access to school web accounts.
                            </p>

                        </div>

                    </div>

                </div>


                {/* User Count */}

                {savedUsers && (

                    <div className="flex items-center gap-3 self-start sm:self-auto">

                        <div className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">

                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                                <FaUser size={14} />
                            </div>

                            <div>

                                <p className="text-lg font-bold text-slate-800 leading-none">
                                    {savedUsers.length}
                                </p>

                                <p className="text-[10px] uppercase tracking-wide text-slate-400 mt-1">
                                    Accounts
                                </p>

                            </div>

                        </div>

                    </div>

                )}

            </div>


            {/* =========================
                SUMMARY
            ========================== */}

            {savedUsers && (

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">

                    <div className="bg-white border border-slate-200 rounded-xl p-4">

                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <FaUser />
                            Total Users
                        </div>

                        <p className="text-2xl font-bold text-slate-800 mt-2">
                            {savedUsers.length}
                        </p>

                    </div>


                    <div className="bg-white border border-emerald-100 rounded-xl p-4">

                        <div className="flex items-center gap-2 text-xs text-emerald-600">
                            <FaCheckCircle />
                            Approved
                        </div>

                        <p className="text-2xl font-bold text-emerald-700 mt-2">
                            {
                                savedUsers.filter(
                                    user => user.approved
                                ).length
                            }
                        </p>

                    </div>


                    <div className="bg-white border border-amber-100 rounded-xl p-4">

                        <div className="flex items-center gap-2 text-xs text-amber-600">
                            <FaClock />
                            Pending
                        </div>

                        <p className="text-2xl font-bold text-amber-700 mt-2">
                            {
                                savedUsers.filter(
                                    user => !user.approved
                                ).length
                            }
                        </p>

                    </div>

                </div>

            )}


            {/* =========================
                DESKTOP TABLE
            ========================== */}

            <div className="hidden md:block bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

                {/* Table Header */}

                <div className="grid grid-cols-[1.1fr_2fr_1fr_1.3fr_1fr] gap-4 px-5 py-4 bg-slate-900 text-slate-300 text-[11px] uppercase tracking-wide font-bold">

                    <div>Registration No.</div>
                    <div>Full Name</div>
                    <div>Category</div>
                    <div>Phone</div>
                    <div>Account Status</div>

                </div>


                {/* Users */}

                {savedUsers?.map((item) => (

                    <div
                        key={item.regNo}
                        className={`grid grid-cols-[1.1fr_2fr_1fr_1.3fr_1fr] gap-4 px-5 py-4 border-b border-slate-100 items-center transition hover:bg-slate-50 ${
                            item.approved
                                ? ""
                                : "bg-amber-50/30"
                        }`}
                    >

                        {/* Reg */}

                        <div>

                            <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg px-3 py-2">

                                {item.approved && (
                                    <FaCheckCircle className="text-emerald-500" />
                                )}

                                {item.regNo}

                            </span>

                        </div>


                        {/* Name */}

                        <div className="flex items-center gap-3 min-w-0">

                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                <FaUserCircle />
                            </div>

                            <p className="font-semibold text-sm text-slate-700 truncate">
                                {item.fullname}
                            </p>

                        </div>


                        {/* Category */}

                        <div>

                            <span
                                className={`inline-flex px-2.5 py-1 rounded-md text-[9px] font-bold uppercase ${
                                    item.thisUser === "chief-admin"
                                        ? "bg-red-100 text-red-700"
                                        : item.thisUser === "admin"
                                        ? "bg-purple-100 text-purple-700"
                                        : item.thisUser === "admin2"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-slate-100 text-slate-600"
                                }`}
                            >
                                {item.thisUser}
                            </span>

                        </div>


                        {/* Phone */}

                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <FaPhone className="text-slate-400" />
                            {item.phone || "Not provided"}
                        </div>


                        {/* Status */}

                        <div>

                            {item.approved ? (

                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                                    <FaCheckCircle />
                                    APPROVED
                                </span>

                            ) : (

                                <button
                                    onClick={() =>
                                        setSelection(item.regNo)
                                    }
                                    className="px-3 py-2 rounded-lg bg-amber-500 text-white text-[10px] font-bold hover:bg-amber-600 transition shadow-sm"
                                >
                                    APPROVE
                                </button>

                            )}

                        </div>

                    </div>

                ))}

            </div>


            {/* =========================
                MOBILE CARDS
            ========================== */}

            <div className="md:hidden space-y-3">

                {savedUsers?.map((item) => (

                    <motion.div
                        key={item.regNo}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-white border rounded-2xl p-4 shadow-sm ${
                            item.approved
                                ? "border-slate-200"
                                : "border-amber-200"
                        }`}
                    >

                        {/* Top */}

                        <div className="flex items-start justify-between gap-3">

                            <div className="flex items-center gap-3 min-w-0">

                                <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                    <FaUserCircle size={25} />
                                </div>

                                <div className="min-w-0">

                                    <h3 className="font-bold text-sm text-slate-800 truncate">
                                        {item.fullname}
                                    </h3>

                                    <p className="text-[11px] text-slate-400 mt-1">
                                        {item.regNo}
                                    </p>

                                </div>

                            </div>


                            {item.approved ? (

                                <span className="shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <FaCheck size={13} />
                                </span>

                            ) : (

                                <span className="shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                                    <FaClock size={13} />
                                </span>

                            )}

                        </div>


                        {/* Details */}

                        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">

                            <div>

                                <p className="text-[9px] uppercase tracking-wide text-slate-400 font-bold">
                                    Category
                                </p>

                                <span
                                    className={`inline-block mt-1 px-2 py-1 rounded-md text-[9px] font-bold uppercase ${
                                        item.thisUser === "chief-admin"
                                            ? "bg-red-100 text-red-700"
                                            : item.thisUser === "admin"
                                            ? "bg-purple-100 text-purple-700"
                                            : item.thisUser === "admin2"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-slate-100 text-slate-600"
                                    }`}
                                >
                                    {item.thisUser}
                                </span>

                            </div>


                            <div>

                                <p className="text-[9px] uppercase tracking-wide text-slate-400 font-bold">
                                    Phone
                                </p>

                                <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                                    <FaPhone size={9} />
                                    {item.phone || "Not provided"}
                                </p>

                            </div>

                        </div>


                        {/* Action */}

                        {!item.approved && (

                            <button
                                onClick={() =>
                                    setSelection(item.regNo)
                                }
                                className="w-full mt-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition"
                            >
                                REVIEW & APPROVE
                            </button>

                        )}

                        {item.approved && (

                            <div className="mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold">
                                <FaCheckCircle />
                                Account Approved
                            </div>

                        )}

                    </motion.div>

                ))}

            </div>


            {/* Empty state */}

            {savedUsers && savedUsers.length === 0 && (

                <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">

                    <FaUser
                        className="mx-auto text-slate-300"
                        size={30}
                    />

                    <h3 className="font-semibold text-slate-700 mt-3">
                        No user accounts found
                    </h3>

                    <p className="text-xs text-slate-400 mt-1">
                        Registered accounts will appear here.
                    </p>

                </div>

            )}

        </div>
    );
}

function EachPerson({}){

    <div></div>
}