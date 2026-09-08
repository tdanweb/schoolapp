import { mainApi } from "../api";
import React, { useEffect, useState } from "react";
import { Crest } from "../assets/Assets";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ImageSlider } from "../components/Media";
import { formatNumber, naira } from "../staticFiles";
import SchoolFooter from "../components/Footer";

export default function AdmissionPage() {
  const settingAPI = `${mainApi}/setting`;
  const admSettingAPI = `${mainApi}/settings/admission`
  const [setUps, setSetUps] = useState(null);
  const [admissionSetting, setAdmissionSetting] = useState(null)

  //images slides


    const Slides = [
  {
    image: "/school-arial.png",
    heading: "Welcome to Achievers Admission Portal",
    text: "A Serene and Condusive Place where Achievers are groomed. Rich in Sound Training, Vast in Knowledge. Sound Moral in Moral Upbringing..",
    url: "/about-us",
    linkName: "About AIA"
  },
  {
    image: "/school-gate.png",
    heading: "Raising Tomorrow's Champions is our Mission",
    text: "You can apply for Admission by following the guidelines on this Portal.",
    url: "/admission#guide",
    linkName: "Application Guide",
  },
    {
    image: "/exam-hall.jpg",
    heading: "The School Entrance Exam is on the way..",
    text: "Applicants are encouraged to prepare for the Entrance Examination deligently",
    url: "/admission#guide",
    linkName: "Application Guide",
  },
    {
    image: "/cbt.png",
    heading: "Entrance Exams: 2026/2027 CBT Entrance Examination is around the Corner!",
    text: "We are pleased to inform Parents, Prospective Candidates, Staff and Students that AIA's CBT Entrance Examinations is starting on Thursday 17th of March, 2027 to end on Tuesday 28th of March, 2027. Endeavor to print your Exam slips and check the admission Portal regularly for latest updates",
    url: "/admission#guide", //attach postID here
    linkName: "Access Portal",
  }
]

  // Form Switcher State
  const [activeTab, setActiveTab] = useState("signup"); // 'signup' | 'signin'

  // Form Field States
  const initData = {
    //regNo at the backend
    fullName: "",
    lastname: "",
    email: "",
    phone: "",
    appId: "",
    thisUser: "applicant",
    password: "",
    confirmPassword: "",
  }
  const [formData, setFormData] = useState(initData);
  const navigateTo = useNavigate()

  const [notice, setNotice] = useState("");
  const [alertMe, setAlertMe] = useState("")

  useEffect(() => {
    async function getSetup() {
      try {
        const settings = await axios.get(settingAPI);
        setSetUps(settings.data.settings.setUps);

        const settings2 = await axios.get(admSettingAPI);
        setAdmissionSetting(settings2.data.settings); 

        localStorage.setItem("admission-setting", JSON.stringify(settings2.data.settings))
      } catch (error) {
        if (error.response) {
          setAlertMe(error.response.data.msg);
        } else {
          setAlertMe("Network/Server Error");
        }
      }
    }

    getSetup();
    const user = JSON.parse(localStorage.getItem("logged-applicant"))
    if(user) navigateTo("/applicant")
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const [alertMsg, setAlertMsg] = useState("");
  const [success, setSuccess] = useState(false)

  const [loading1, setLoading1] = useState(false)

  const handleAuthSubmit = async (e) => {
    setLoading1(true);

    e.preventDefault();
    if(formData.password !== formData.confirmPassword){
      return alert("Passwords do not match...")
    }
    // Handled by your auth handler logic
    try {
      const res = await axios.post(`${mainApi}/user`, formData);

      setAlertMe("Registration Successful. You may Log in Now!")
      setAlertMsg(res.data.message + ". You may now log in");
      setSuccess(true);
    } catch (error) {
      if(error.response){
        setAlertMsg(error.response.data.message)
      } else{
        setAlertMsg("Network/Connection Error!")
      }
      setSuccess(false)
    } finally{
      setLoading1(false)
    }
  };

  // Steps definition for the Application Guide
  const applicationSteps = [
    {
      step: "01",
      title: "Account Creation",
      description: "Create your applicant profile with a valid email address and active phone number to generate your application ID.",
      badge: "Start Here",
    },
    {
      step: "02",
      title: "Application Fee Payment",
      description: `Log into your portal dashboard and make a secure payment for the non-refundable application processing fee. A sum of: ₦${admissionSetting && admissionSetting.applicationFee.toLocaleString('en-US')}`,
      badge: "Payment",
    },
    {
      step: "03",
      title: "Complete Bio-Data & Uploads",
      description: "Fill in personal, academic details, and upload clear passports and required academic credentials.",
      badge: "Forms",
    },
    {
      step: "04",
      title: "Entrance Exam Schedule",
      description: "Check your portal dashboard periodically for your assigned screening/examination date, venue, and slip printing.",
      badge: "Screening",
    },
    {
      step: "05",
      title: "Await Admission List",
      description: "Monitor your portal for the official admission list release, acceptance fee payment, and provisional admission letter.",
      badge: "Final Stage",
    },
  ];


  const [loadII, setLoadII] = useState(false)
  const logApplicantIn = async (e) => {
    const api = `${mainApi}/user/applicant/login`
    e.preventDefault()
    setLoadII(true);
    try {
      console.log(formData)
      const res = await axios.post(api, {
        id: formData.appId, password: formData.password
      });
      //(res.data);
      setAlertMsg("LOG IN SUCCESSFUL.... " + res.data.msg); setSuccess(true)
      localStorage.setItem("logged-applicant", JSON.stringify(res.data.user));
      setTimeout(() => {
        navigateTo("/applicant");
      }, 2000)
    } catch (error) {
      if(error.response){
        setAlertMsg(error.response.data.msg); setSuccess(false)
      }
    } finally{
      setLoadII(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-poppins">

{alertMsg && (
  <div className="fixed inset-0 z-[60] min-h-screen bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">

    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 20 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800"
    >

      {/* Top Status Area */}
      <div
        className={`flex flex-col items-center justify-center px-6 pt-7 pb-5 ${
          success
            ? "bg-sky-50 dark:bg-sky-950/30"
            : "bg-red-50 dark:bg-red-950/30"
        }`}
      >

        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center ${
            success
              ? "bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400"
              : "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400"
          }`}
        >
          <i
            className={`fa-solid ${
              success ? "fa-check" : "fa-xmark"
            } text-2xl`}
          ></i>
        </div>

        {/* Title */}
        <h3
          className={`mt-4 text-lg font-semibold font-poppins ${
            success
              ? "text-sky-700 dark:text-sky-400"
              : "text-red-700 dark:text-red-400"
          }`}
        >
          {success ? "Success" : "Something went wrong"}
        </h3>

      </div>

      {/* Message */}
      <div className="px-6 py-5 text-center">

        <p className="text-sm leading-6 font-poppins text-slate-600 dark:text-slate-300">
          {alertMsg}
        </p>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setAlertMsg("")}
          className={`w-full mt-6 px-4 py-3 rounded-xl text-white font-poppins font-medium cursor-pointer transition-all duration-200 ${
            success
              ? "bg-sky-600 hover:bg-sky-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          CLOSE
        </button>

      </div>

    </motion.div>
  </div>
)}


      {/* --- Top Navbar --- */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 py-3 px-4 md:px-8 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-3">
          <Crest />
          <div className="w-[2px] h-10 bg-slate-300 hidden sm:block"></div>
          <div>
            <h1 className="text-lg md:tex-xl font-lato font-extrabold text-teal-800 tracking-tight leading-tight">
              Admission Portal
            </h1>
            <p className="font-poppins text-xs text-amber-700 italic font-medium">
              Achiever's International Schools <span className="font-bold not-italic">({ admissionSetting && admissionSetting.session + " SESSION"})</span>
            </p>
          </div>
        </div>

        <a
          className="py-2 px-4 text-xs md:text-sm shadow-md text-white bg-sky-800 hover:bg-sky-900 transition-all rounded-md font-semibold font-poppins flex items-center gap-1"
          href="#guide"
        >
          <span>Application Guide</span>
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M9.293 12.95l0.707 0.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </a>
      </header>

      {/* --- Main Content Area --- */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        <p className="p-2 text-sm font-poppins bg-slate-100 text-slate-800 rounded-md shadow-lg my-5">
            {admissionSetting && admissionSetting.notes}
            <span className=" my-2 block">APPLICATION FEE: <b>{admissionSetting &&  `${naira}${ formatNumber(admissionSetting.applicationFee)}`}</b></span>
        </p>

        <ImageSlider arr={Slides} time={10000}/>

        {!setUps && !admissionSetting && (
          <div className="px-6 py-2 italic bg-slate-100 rounded-md my-4 text-center font-bold font-lato text-2xl text-pink-700">
            ADMISSION APPLICATION IS NOT AVAILABLE AT THE MOMENT!
          </div>
        )}
        {setUps && admissionSetting && (
          <>
            {setUps.admissionPortal ? (
              <div className="space-y-6">
                {/* Announcement Ticker */}
                <div className="bg-amber-50 border-l-4 border-amber-600 p-3 rounded-r-md shadow-sm overflow-hidden flex items-center gap-3">
                  <span className="bg-amber-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded shrink-0">
                    Notice
                  </span>
                  <div className="text-xs md:text-sm text-amber-900 font-medium overflow-x-auto whitespace-nowrap scrollbar-none">
                    {admissionSetting.admissionStatus === "closed" && "Admission Application is currently closed for this session.  You can still create an Account if you want."}
                    {admissionSetting.admissionStatus === "ongoing" && "Admission Application is ongoing! Follow the Guidelines below to complete your registration"}. {" "}
                    <span className="font-bold underline">
                      Deadline:  { new Date(admissionSetting.deadline).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit", year: "numeric" }) }
                    </span>
                  </div>
                </div>

                {/* Grid Container for Form & Updates */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* --- Left Column: Switchable Form --- */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100"
                  >
                    {/* Form Toggle Header */}
                    <div className="flex bg-slate-100 p-1.5 rounded-xl mb-6 relative">
                      <button
                        type="button"
                        onClick={() => setActiveTab("signup")}
                        className={`flex-1 py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all relative z-10 ${
                          activeTab === "signup"
                            ? "text-teal-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Create an Account
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("signin")}
                        className={`flex-1 py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all relative z-10 ${
                          activeTab === "signin"
                            ? "text-teal-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Sign In
                      </button>

                      {/* Animated Active Tab Pill */}
                      <motion.div
                        className="absolute top-1.5 bottom-1.5 bg-white rounded-lg shadow-sm"
                        initial={false}
                        animate={{
                          left: activeTab === "signup" ? "0.375rem" : "50%",
                          width: "calc(50% - 0.375rem)",
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    </div>

                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-teal-900">
                        {activeTab === "signup"
                          ? "Begin Your Application"
                          : "Welcome Back"}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        {activeTab === "signup"
                          ? "Fill in your personal details to generate your applicant profile."
                          : "Enter your credentials to access your admission portal dashboard."}
                      </p>
                    </div>

                    {/* Animated Form Fields */}
                    <AnimatePresence mode="wait">
                      <motion.form
                        key={activeTab}
                        initial={{ opacity: 0, x: activeTab === "signup" ? -15 : 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: activeTab === "signup" ? 15 : -15 }}
                        transition={{ duration: 0.25 }}
                        onSubmit={activeTab === "signup" ? handleAuthSubmit : logApplicantIn}
                        className="space-y-4"
                      >
                        {activeTab === "signup" ? (
                          <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Full Name (Surname First)
                              </label>
                              <input
                                type="text"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="e.g. Adewale Chukwuma Musa"
                                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700 transition"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Last Name (Surname)
                              </label>
                              <input
                                type="text"
                                name="lastname"
                                required
                                value={formData.lastname}
                                onChange={handleInputChange}
                                placeholder="e.g. Adewale"
                                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700 transition"
                              />
                            </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                  Email Address
                                </label>
                                <input
                                  type="email"
                                  name="email"
                                  required
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  placeholder="applicant@example.com"
                                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700 transition"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                  Phone Number
                                </label>
                                <input
                                  type="tel"
                                  name="phone"
                                  required
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  placeholder="08012345678"
                                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700 transition"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                  Create Password
                                </label>
                                <input
                                  type="password"
                                  name="password"
                                  required
                                  value={formData.password}
                                  onChange={handleInputChange}
                                  placeholder="••••••••"
                                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700 transition"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                  Confirm Password
                                </label>
                                <input
                                  type="password"
                                  name="confirmPassword"
                                  required
                                  value={formData.confirmPassword}
                                  onChange={handleInputChange}
                                  placeholder="••••••••"
                                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700 transition"
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="w-full mt-2 py-3 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-lg shadow-md transition-all text-sm"
                            >
                              Register & Continue
                            </button>
                          </>
                        ) : (
                          <>
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Application ID / Email
                              </label>
                              <input
                                type="text"
                                name="appId"
                                required
                                value={formData.appId}
                                onChange={handleInputChange}
                                placeholder="APP-2026-XXXX or Email"
                                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700 transition"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-semibold text-slate-700">
                                  Password
                                </label>
                                <a
                                  href="#forgot"
                                  className="text-[11px] text-teal-800 hover:underline font-medium"
                                >
                                  Forgot Password?
                                </a>
                              </div>
                              <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/30 focus:border-teal-700 transition"
                              />
                            </div>
                            <button
                              type="submit"
                              className="w-full mt-2 py-3 bg-sky-800 hover:bg-sky-900 text-white font-bold rounded-lg shadow-md transition-all text-sm"
                            >
                              Access Portal
                            </button>
                          </>
                        )}
                            <div className={`my-3 p-2 text-sm font-bold rounded-md text-center bg-slate-100 shadow-lg w-full ${alertMsg && (success ? 'text-green-600' : 'text-pink-600')}`}>
                              {alertMsg}
                            </div>
                      </motion.form>
                    </AnimatePresence>
                  </motion.div>

                  {/* --- Right Column: Announcements & Portal Updates Space --- */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm md:text-base">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                          Important Portal Updates
                        </h3>
                        <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                          Live Feed
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 transition hover:bg-slate-100/70">
                          <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                            Requirement
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 mt-1">
                            Passport Photo Specifications
                          </h4>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                            Ensure uploaded passport photographs have a plain white background and do not exceed 200KB in file size.
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 transition hover:bg-slate-100/70">
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                            Payment Alert
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 mt-1">
                            Instant PIN Generation
                          </h4>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                            After successful online payment, your registration PIN will be automatically validated on your dashboard.
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 transition hover:bg-slate-100/70">
                          <span className="text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                            Helpdesk
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 mt-1">
                            Technical Support
                          </h4>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                            Experiencing issues during registration? Reach admissions at{" "}
                            <span className="font-semibold text-slate-700">
                              support@achievers.edu
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              /* --- Closed Admission Portal State --- */
              <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-lg border border-slate-100 max-w-2xl mx-auto my-12">
                <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  !
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Admission Portal Closed
                </h2>
                <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                  Admission applications are currently closed for the current academic session. Please check back later or contact the school administrative office for further inquiries.
                </p>
              </div>
            )}
          </>
        )}

        {/* --- Application Guide Section --- */}
        <motion.section
          id="guide"
          className="mt-16 pt-8 border-t border-slate-200"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
              Step-by-Step Walkthrough
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-teal-900 mt-3">
              Application Process Guide
            </h2>
            <p className="text-slate-600 text-xs md:text-sm mt-2">
              Follow these simple steps from registration to securing your admission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applicationSteps.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -z-0 opacity-60"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-black text-teal-800/20 font-lato">
                      {item.step}
                    </span>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <SchoolFooter/>
    </div>
  );
}