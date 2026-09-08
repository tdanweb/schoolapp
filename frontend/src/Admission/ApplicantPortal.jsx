import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
    FaBars,
    FaBell,
    FaChevronRight,
    FaDotCircle,
    FaHome,
    FaMoneyBill,
    FaPen,
    FaQuestionCircle,
    FaSignOutAlt,
    FaUserCheck,
    FaUserCircle,
    FaWhatsapp,
    FaTimes
} from "react-icons/fa";

import { formattedDate, mainApi } from "../api";
import { naira } from "../staticFiles";


export default function ApplicantPortal() {

    const navigateTo = useNavigate();

    const [savedUser, setSavedUser] = useState(null);
    const [reg, setReg] = useState(false);
    const [img, setImg] = useState("")
    const [regPin, setRegPin] = useState("")
    const [admSetting, setAdmSetting] = useState(null);
    const [mobileMenu, setMobileMenu] = useState(false);


    async function getSavedApplicant() {
        const saved = JSON.parse(localStorage.getItem("logged-applicant"));
        console.log(saved)
        if (!saved) {
            navigateTo("/admission");
            return;
        }

        setSavedUser(saved);
        getApplicant(saved.appId);

        const params = new URLSearchParams({
            regNo: saved.appId, session: (JSON.parse(localStorage.getItem("admission-setting")).session)
        })
        try {
         const res = await axios.get(`${mainApi}/applicant/get-pay?${params.toString()}`);
     //  return  console.log(res.data)
         setReg(res.data.success);
         setRegPin(res.data.pin)
     //    alert(res.data.msg);
         localStorage.setItem("applicant-pin", JSON.stringify(res.data.pin))
        } catch (error) {
            if(error.response){
              //  alert(error.response.data.msg)
            } else{
                alert("Network/Server Error..")
            }
        }
    }


    const logOut = () => {
        localStorage.removeItem("logged-applicant");
        localStorage.removeItem("applicant-pin");
        navigateTo("/admission");
    };


    async function getApplicant(id) {
        try {
            await axios.get(`${mainApi}/applicant/${id}`);

            setReg(true);
            console.log(res.data)
            setImg(res.data.applicant.passportUrl)
        } catch (error) {
            setReg(false);
        }
    }


    async function getAdmSettings() {

        const admSettingAPI = `${mainApi}/settings/admission`;

        try {
            const settings2 = await axios.get(admSettingAPI);
            setAdmSetting(settings2.data.settings);
            localStorage.setItem("admission-setting", JSON.stringify(settings2.data.settings))
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getSavedApplicant();
        getAdmSettings();
    }, []);


    return (
        <div className="min-h-screen bg-slate-100 flex">

            {/* DESKTOP SIDEBAR */}
            <aside className="hidden md:flex w-64 lg:w-72 bg-slate-900 text-white flex-col fixed left-0 top-0 bottom-0 z-40">

                {/* Logo */}
                <div className="h-20 px-6 flex items-center border-b border-slate-700">
                    <div>
                        <h1 className="font-bold text-lg text-amber-400">
                            Applicant Portal
                        </h1>

                        <p className="text-[11px] text-slate-400">
                            Admission Management
                        </p>
                    </div>
                </div>


                {/* Navigation */}
                <div className="flex-1 py-6 overflow-y-auto">
                    <ApplicantLinks />
                </div>


                {/* User */}
                <div className="border-t border-slate-700 p-4">

                    <div className="flex items-center gap-3 mb-4">

                        <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-slate-900">
                            <FaUserCircle size={20} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">
                                {savedUser?.name}
                            </p>

                            <p className="text-[11px] text-slate-400 truncate">
                                {savedUser?.appId}
                            </p>
                        </div>

                    </div>


                    <button
                        onClick={logOut}
                        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-slate-700 text-sm text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition"
                    >
                        Logout
                        <FaSignOutAlt />
                    </button>

                </div>

            </aside>


            {/* MOBILE SIDEBAR */}
            {mobileMenu && (
                <div className="fixed inset-0 z-50 md:hidden">

                    <div
                        onClick={() => setMobileMenu(false)}
                        className="absolute inset-0 bg-black/50"
                    />

                    <aside className="relative w-72 h-full bg-slate-900 text-white flex flex-col">

                        <div className="h-20 px-5 flex items-center justify-between border-b border-slate-700">

                            <div>
                                <h1 className="font-bold text-lg text-amber-400">
                                    Applicant Portal
                                </h1>

                                <p className="text-[11px] text-slate-400">
                                    Admission Management
                                </p>
                            </div>

                            <button
                                onClick={() => setMobileMenu(false)}
                                className="text-slate-400"
                            >
                                <FaTimes />
                            </button>

                        </div>


                        <div className="flex-1 py-6">
                            <ApplicantLinks closeMenu={() => setMobileMenu(false)} />
                        </div>


                        <div className="border-t border-slate-700 p-4">

                            <div className="flex items-center gap-3 mb-4">

                                <FaUserCircle
                                    size={30}
                                    className="text-amber-400"
                                />

                                <div>
                                    <p className="text-sm font-semibold">
                                        {savedUser?.lastname}
                                    </p>

                                    <p className="text-[11px] text-slate-400">
                                        {savedUser?.appId}
                                    </p>
                                </div>

                            </div>

                            <button
                                onClick={logOut}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-slate-700 text-sm"
                            >
                                Logout
                                <FaSignOutAlt />
                            </button>

                        </div>

                    </aside>

                </div>
            )}


            {/* MAIN AREA */}
            <main className="flex-1 md:ml-64 lg:ml-72 min-w-0">


                {/* TOP BAR */}
                <header className="h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() => setMobileMenu(true)}
                            className="md:hidden w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center"
                        >
                            <FaBars />
                        </button>

                        <div>
                            <p className="text-xs text-slate-400">
                                Applicant Portal
                            </p>

                            <h2 className="font-semibold text-slate-800">
                                Dashboard 
                            </h2>
                        </div>

                    </div>


                    <div className="flex items-center gap-4">

                        <button className="relative w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                            <FaBell />
                            <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${ !reg ?  'bg-red-500' : 'bg-green-500'} `} />
                        </button>


                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-semibold text-slate-800">
                                {savedUser?.lastname}
                            </p>
                            <p className="text-[11px] text-slate-400">
                                {savedUser?.appId}
                            </p>
                        </div>
                    </div>

                </header>


                {/* CONTENT */}
                <div className="p-4 md:p-8 max-w-7xl mx-auto">


                    {/* WELCOME */}
                    <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-4 md:p-6 text-white relative overflow-hidden">
                    
                    
                    <div className="flex gap-2 items-center">
                        <div className="relative z-10">

                            <p className="text-amber-400 text-sm font-medium mb-1">
                                Welcome back 👋
                            </p>

                            <h1 className="text-xl md:text-2xl font-bold mb-2">
                                {savedUser?.lastname}
                            </h1>

                            <p className="text-slate-300 text- max-w-xl">
                                Stay updated with important admission information,
                                announcements and instructions from the school.
                            </p>

                        </div>
                    </div>



                        <div className="absolute -right-12 -bottom-20 w-64 h-64 rounded-full bg-amber-500/10" />
                        <div className="absolute right-20 -top-20 w-40 h-40 rounded-full bg-blue-500/10" />

                    </section>


                    {/* APPLICATION NOTICE */}
                    {!regPin && (
                        <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">

                            <div>

                                <p className="font-semibold text-amber-900">
                                    Application Fee Required
                                </p>

                                <p className="text-sm text-amber-800 mt-1">
                                    Kindly pay the non-refundable application fee of{" "}
                                    <strong>
                                        {naira}
                                        {admSetting?.applicationFee?.toLocaleString()}
                                    </strong>{" "}
                                    and complete your registration before the deadline.
                                </p>

                                {admSetting?.deadline && (
                                    <p className="text-xs text-amber-700 mt-2">
                                        Registration closes on{" "}
                                        <strong>
                                            {formattedDate(admSetting.deadline)}
                                        </strong>
                                    </p>
                                )}

                            </div>

                            <Link
                                to="/applicant/payment"
                                className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                            >
                                Make Payment
                                <FaChevronRight size={12} />
                            </Link>

                        </div>
                    )}


                    {/* PAGE */}
                    <div className="mt-6">
                        <Outlet />
                    </div>

                </div>

            </main>

        </div>
    );
}



function ApplicantLinks({ closeMenu }) {

    const allLinks = [

        {
            title: "Home",
            icon: <FaHome />,
            url: "/applicant/home"
        },

        {
            title: "BioData",
            icon: <FaUserCheck />,
            url: "/applicant/data"
        },

        {
            title: "Entrance Exam",
            icon: <FaPen />,
            url: "/applicant/exam"
        },

        {
            title: "Status",
            icon: <FaDotCircle />,
            url: "/applicant/status"
        },

        {
            title: "Payment",
            icon: <FaMoneyBill />,
            url: "/applicant/payment"
        },

        {
            title: "FAQs",
            icon: <FaQuestionCircle />,
            url: "/applicant/faqs"
        },

        {
            title: "Contacts",
            icon: <FaWhatsapp />,
            url: "/applicant/contact"
        }

    ];


    return (
        <nav className="px-3 space-y-1">

            {allLinks.map((link) => (

                <Link
                    key={link.title}
                    to={link.url}
                    onClick={closeMenu}
                    className="group flex items-center justify-between px-4 py-3 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                >

                    <span className="flex items-center gap-3">
                        <span className="text-slate-400 group-hover:text-amber-400">
                            {link.icon}
                        </span>

                        {link.title}
                    </span>

                    <FaChevronRight
                        size={10}
                        className="opacity-0 group-hover:opacity-100 transition"
                    />

                </Link>

            ))}

        </nav>
    );
}
//applicant Home ---- Just update, news and guide...