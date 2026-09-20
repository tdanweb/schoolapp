import React, { useEffect, useState, useRef} from "react"
import { Link, Navigate, Outlet, useNavigate, useParams } from "react-router-dom"
import { mainApi } from "../../api";
import axios from "axios";
import { motion } from "framer-motion";
import { Settings, BellRing, User, UserPlus, GraduationCap, Plus, Users, Trash2, CheckCircle2 ,
    Upload,
  FileText,
  Check,
  Image as ImageIcon, Copy,
  X,
  ExternalLink,
  CheckCircle,
  AlertCircle, ChevronLeft, ChevronRight,
  Loader2,
} from "lucide-react";
const api = `${mainApi}/setting`;

import  { AllSideBarLinks } from "../SideLinks";
import { FaBars, FaBell, FaFolder, FaInbox, FaSignOutAlt, FaUserCircle } from "react-icons/fa";



export function ProtectPortal({children}){

    const navigate = useNavigate();
    const auth = true; //replace with real auth
   
    if(auth){
        return children;
    } else{
        navigate("/sign-in")
    }
}




///ai Home Page
import {
    FaUserGraduate,
    FaUsers,
    FaMoneyBillWave,
    FaClipboardList,
} from "react-icons/fa";
import { Crest, CREST } from "../../assets/Assets";
//import { ParentDashboardHome, StudentDashboardHome } from "../DashBoardHome";
import { TermInfo } from "./GeneralSetting";
import { StaffDashboard } from "../DashBoards";
import StudentDashboard from "../Student/MyDashBoard";
import ParentDashboard from "../Parent/ParentDash";

export function DashboardHome() {
    const [info, setInfo] = useState(null);
    const [alertMsg, setAlertMsg] = useState("");

    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [user, setUser] = useState(null);
    const [termInfo, setTermInfo] = useState(null);

    //updates

    const [updates, setUpdates] = useState([]);
    //admin data
    const [adminData, setAdminData] = useState(null)

    const [userDATA, setUserDATA] = useState({})

//get settings....
 async function getSettings() {
            const api = `${mainApi}/setting`;
            try {
                const res = await axios.get(api);           
                setTermInfo(res.data.termSetting)
            } catch (err) {
              if(err.response){
                    setAlertMsg(err.response.data.msg)
              } else{
                setAlertMsg("Network Connectivity Error!!")
            }
            }
          }

//dashboard data-- we are getting settings alongside dashboard data...
async function getAdminDashboardData(){

  try {
        setInfo(JSON.parse(localStorage.getItem("site-settings") || null))
        //add token to header for auth
        const savedUser = JSON.parse(localStorage.getItem("logged-user") || null);
        if(savedUser.role !== "admin" && savedUser.role !== "chief-admin"){ return }

        const adminApi = `${mainApi}/setting/admin/dashboard-info`
        //admin
        const res = await axios.get(adminApi, {
          headers: {
            Authorization: `Bearer ${savedUser.token}`
          }
        });
        setAdminData(res.data)
  } catch (error) {
    if(error.response){
      setAlertMsg("ADMIN DASH-HOME: " + error.response.data.msg)
    } else{
      setAlertMsg("ADMIN DASH-HOME: Network Error - Unable to fetch user Data...")
    }
  }

}

//dashboard
async function getDashboardData(){

  try {
        //add token to header for auth
        const savedUser = JSON.parse(localStorage.getItem("logged-user") || null);
        setUser(savedUser);
        const api = `${mainApi}/setting/user/dashboard-info/${savedUser.id}`
        //general dashboard
        const dashData = await axios.get(api);
        setUpdates(dashData.data.updates);
        return setUserDATA(dashData.data)
  } catch (error) {
    console.log("Errorr...")
    if(error.response){
      setAlertMsg("DASH-HOME: " + error.response.data.msg)
    } else{
      setAlertMsg("Unable to fetch user Data... Server Error")
    }
  }
}

    useEffect(() => {
        getSettings();
        getDashboardData();
        getAdminDashboardData(); //strictly admin view...
    }, []);

    const cards = [
        {
            title: "Students",
            value: "1,245",
            icon: <FaUserGraduate size={28} />,
            color: "bg-blue-500",
        },
        {
            title: "Staff",
            value: "82",
            icon: <FaUsers size={28} />,
            color: "bg-green-500",
        },
        {
            title: "Revenue",
            value: "₦3.5M",
            icon: <FaMoneyBillWave size={28} />,
            color: "bg-yellow-500",
        },
        {
            title: "Attendance",
            value: "97%",
            icon: <FaClipboardList size={28} />,
            color: "bg-purple-500",
        },
    ];

    //for each dashboard add a data props, depending on data sent from backend
    //for each component set data that aligns with the component.....

    return(
      <div className="p-4 md:p-6 lg:p-8">
{alertMsg && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className="relative w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
      
      {/* Close button */}
      <button
        onClick={() => setAlertMsg("")}
        className="absolute right-4 top-3 text-2xl font-bold text-gray-500 hover:text-gray-800"
      >
        &times;
      </button>

      {/* School crest */}
      <img
        src="/crest.png"
        alt="School Crest"
        className="mx-auto mb-4 h-20 w-20 object-contain"
      />

      <p className="text-gray-700">
        {alertMsg}
      </p>

    </div>
  </div>
)}
{
  //pass in specific user data params.... admin/chief-admin together for now...
}
       {user?.role === "student" && <StudentDashboard studentData={userDATA}/>}
       {user?.role==="parent" && <ParentDashboard parentData={userDATA}/>}
       {/*user?.role === "parent" && <ParentDashboardHome/>   */}
       {(user?.role === "staff" || user?.role==="admin2" || user?.role === "admin" || user?.role === "chief-admin") && <StaffDashboard staffData={userDATA} adminData={adminData || null}/>}

        <div className="my-4 w-full p-4 bg-slate-700/60">
          
        </div>

       {
        /*settings and term info..
        <TermInfo termSetting={termInfo}/>
        */
       }


{updates && updates.length > 0 && user !=="student" && (
  <motion.section
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className="space-y-3 mb-5"
  >
    {/* HEADER */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <BellRing className="w-4 h-4" />
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-800">
            Updates from School
          </h2>

          <p className="text-[10px] text-slate-400">
            Latest school announcements and notices
          </p>
        </div>
      </div>

      <span className="text-[10px] font-medium text-slate-400">
        {updates.length} {updates.length === 1 ? "Update" : "Updates"}
      </span>
    </div>


    {/* UPDATE CARDS */}
    <div className="space-y-3">
      {updates.map((update) => (
        <motion.div
          key={update._id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">

            {/* UPDATE ICON */}
            <div className="w-9 h-9 shrink-0 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BellRing className="w-4 h-4" />
            </div>

            <div className="min-w-0 flex-1">

              {/* TITLE + DATE */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-800">
                  {update.title}
                </h3>

                <span className="shrink-0 text-[10px] text-slate-400">
                  {new Date(update.createdAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* BODY */}
              <p className="mt-1.5 text-xs sm:text-sm leading-5 text-slate-500">
                {update.body}
              </p>

              {/* POSTER + TIME */}
              <div className="mt-3 flex items-center justify-between gap-3">

                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-slate-700 truncate">
                    {update.poster?.displayName || "Unknown"}
                  </p>

                  <p className="text-[10px] text-slate-400 capitalize">
                    {update.poster?.staffType || "Staff"}
                  </p>
                </div>

                <span className="shrink-0 text-[10px] text-slate-400">
                  {new Date(update.createdAt).toLocaleTimeString("en-NG", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>

              </div>

            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.section>
)}
      </div>
    )
};




//real portals
export default function UserPortals() {
  const [form, setForm] = useState({
    fullname: "",
    occupation: "",
    address: "",
    contactMail: "",
    contactPhone: ""
  });

  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const [alertMsg, setAlertMsg] = useState("")
  const [currentUser, setCurrentUser] = useState({})


  const userApi = `${mainApi}/user/dashboard-main` //+ /userId here...
  const logOut = () => {
    localStorage.removeItem("logged-user");
    navigate("/");
  };

  const { id } = useParams();


  const [user, setUser] = useState(""); // just for testing

  const [userInfo, setUserInfo] = useState(null);
  const [roles, setRoles] = useState(null);

  const [settings, setSettings] = useState(null);
  const [terms, setTerms] = useState(null);
  const [load, setLoad] = useState(false);

  // =[============  If Parent Portal ===============]
  const [isParent, setIsParent] = useState(false)
  const [studentList, setStudentList] = useState([])
  const [parentData, setParentData] = useState(null)
  const [parentInfo, setParentInfo] = useState({})

  useEffect(() => {
    async function getUser() {
      const savedUser = JSON.parse(
        localStorage.getItem("logged-user")
      )

      setUserInfo(savedUser);
      setUser(savedUser.role);

      try {
        //get user profile
        const theUser = await axios.get(`${userApi}/${savedUser.id}`);
        const data = theUser.data
        if(!data) navigate("/app");

        if(data.staff){
          setRoles(theUser.data.staff.specialRoles)
        }
        setCurrentUser(data.staff || data.student || data.parent)
        

        if(theUser.data.isParent){
          setParentData(data.parent);
          setForm(data.parentInfo);
          setStudentList(data.students)
        }

        setSuccess(true);
      } catch (error) {
        //status code of not found for staff/parent - prompt self enrollement
        if(error.response){
          setAlertMsg(error.response.data.msg)
        const msg = error.response.data.msg;
        setAlertMsg(msg);

        if(msg==="The User Profile is unapproved or not found!"){
          navigate("/sign-in");
        }
        } else {
          setAlertMsg("Network Error, Cannot Get User Credentials...");
        }

        setSuccess(false);
      }
    }

    async function getSettings() {
      try {
        setLoad(true);

        const res = await axios.get(api);
  
        setSettings(res.data.settings);
        localStorage.setItem(
          "site-settings",
          JSON.stringify(res.data.settings.setUps)
        );
        setTerms(res.data.termSetting);
      } catch (error) {
        console.log(error);
      } finally {
        setLoad(false);
      }
    }

    getUser();
    getSettings();
  }, []);

  // top
  const [sel, setSel] = useState("");
  const [openSide, setOpenSide] = useState(false);


  // Mock students for now
  const students = [
    {
      _id: "student001",
      admissionNo: "AIS/2026/001",
      regNo: "REG/001",
      fullname: "Daniel Betiku",
    },
    {
      _id: "student002",
      admissionNo: "AIS/2026/002",
      regNo: "REG/002",
      fullname: "John Adewale",
    },
    {
      _id: "student003",
      admissionNo: "AIS/2026/003",
      regNo: "REG/003",
      fullname: "Mary Johnson",
    },
    {
      _id: "student004",
      admissionNo: "AIS/2026/004",
      regNo: "REG/004",
      fullname: "David Samuel",
    },
  ];

  const [wards, setWards] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");



  // Handle parent information
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add student
  const addStudent = () => {
    if (!selectedStudent) return;

    const student = studentList.find(
      (student) => student.admissionNo === selectedStudent
    );

    if (!student) return;

    // Prevent duplicate student
    const alreadyAdded = wards.some(
      (ward) => ward.admissionNo === student.admissionNo
    );

    if (alreadyAdded) {
      alert("This student has already been added.");
      return;
    }

    setWards((prev) => [
      ...prev,
      {
        studentId: student._id,
        fullname: student.personalInfo.surname + " " + student.personalInfo.firstName,
        admissionNo: student.admissionNo,
        regNo: student.regNo,
      },
    ]);

    setSelectedStudent("");
  };

  // Remove student
  const removeStudent = (admissionNo) => {
    setWards((prev) =>
      prev.filter((ward) => ward.admissionNo !== admissionNo)
    );
  };

  // Final submit
  const [load2, setLoad2] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad2(true)

    const finalData = {
      ...form,
      wards,
    };

    try {
      const res = await axios.post(mainApi + "/user/parent/add", finalData)
      setAlertMsg(res.data.msg)
    } catch (error) {
      if(error.response){
        setAlertMsg(error.response.data.msg)
      } else {
        setAlertMsg("Network/Server Error!...")
      }
    } finally{
      setLoad2(false)
    }
  };

  return (
    <div className="h-screen w-full bg-gray-100 flex overflow-hidden">

      {/* ALERT OVERLAY */}
      {alertMsg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">

            <button
              onClick={() => setAlertMsg("")}
              className="absolute right-4 top-3 text-2xl font-bold text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>

            <img
              src="/crest.png"
              alt="School Crest"
              className="mx-auto mb-4 h-20 w-20 object-contain"
            />

            <p className="text-gray-700">
              {alertMsg}
            </p>

          </div>
        </div>
      )}

      {/* ============================= */}
      {/* MOBILE SIDEBAR BACKDROP */}
      {/* ============================= */}

      {openSide && (
        <div
          onClick={() => setOpenSide(false)}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
        />
      )}

      {/* ============================= */}
      {/* SIDEBAR */}
      {/* ============================= */}

      <motion.aside
        initial={false}
        animate={{
          x: openSide ? 0 : undefined,
        }}
        transition={{ duration: 0.3 }}
        className={`
          fixed md:relative
          inset-y-0 left-0
          z-50 md:z-20

          flex flex-col
          w-64 md:w-60 lg:w-64

          bg-slate-800
          text-white

          shadow-xl md:shadow-none

          transform
          transition-transform duration-300

          ${openSide ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >

        {/* Logo */}
        <div className="h-16 shrink-0 text-xl text-slate-700 bg-white font-bold px-4 flex items-center gap-2 border-b border-indigo-700">

          <Crest width={"40px"} />

          <span className="text-indigo-700 text-base">
            School Portal
          </span>
        </div>

        <div>
          <span className="text-xs px-2 my-1 font-poppins block text-amber-200">
            {userInfo?.role.toUpperCase() || ""}
          </span>
        </div>
        {/* Sidebar Links */}

        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-2">

          {user && (
            <AllSideBarLinks
              userId={userInfo.user}
              user={user || "student"}
              permissions={ roles || {} }
            />
          )}

        </div>


        {/* Logout */}

        <div className="shrink-0 p-3 bg-gray-800 border-t border-slate-700">

          <button
            className="w-full flex items-center justify-between gap-4
            px-3 py-3 rounded-lg
            text-amber-200 hover:bg-slate-700
            transition"
            onClick={logOut}
          >
            <span>LOGOUT</span>

            <FaSignOutAlt size={20} />

          </button>

        </div>

      </motion.aside>


      {/* ============================= */}
      {/* MAIN AREA */}
      {/* ============================= */}

      <div className="flex-1 min-w-0 min-h-0 flex flex-col">


        {/* ============================= */}
        {/* HEADER */}
        {/* ============================= */}

        <header
          className="
            h-16 shrink-0
            bg-white shadow-sm
            px-4 md:px-6
            flex justify-between items-center
            z-30
          "
        >

          {/* Left */}

          <div className="flex items-center gap-3 min-w-0">

            {/* Mobile menu */}

            <button
              onClick={() => setOpenSide(true)}
              className="md:hidden p-2 rounded-lg
              hover:bg-slate-100 text-slate-700"
            >
              <FaBars size={20} />
            </button>


            <div className="min-w-0">

              <div className="text-lg md:text-xl font-bold text-indigo-700 truncate">
                Dashboard
              </div>

              <div className="flex gap-1 font-bold text-green-700 items-center text-[10px] md:text-xs whitespace-nowrap">

                <div>
                  WEEK {settings?.setUps?.schoolWeek}
                </div>

                <span>||</span>

                <div>
                  {settings?.setUps?.currentTerm} Term
                </div>

                <span>||</span>

                <div>
                  {settings?.setUps?.currentSession}
                </div>

              </div>

            </div>

          </div>


          {/* Right */}

          <div className="flex items-center gap-1 md:gap-4 shrink-0">

            <Link
              to="/app/user/inbox"
              onClick={() => setSel("inbox")}
              className={`
                p-2 rounded-md relative
                ${sel === "inbox"
                  ? "border-b-2 border-amber-600"
                  : ""
                }
              `}
            >
              <FaInbox
                size={20}
                className="text-slate-700"
              />
            </Link>

{
  (user==="staff" || user==="admin2" || user==="admin" || user==="chief-admin")
  &&
            <Link
              to="/app/user/document"
              onClick={() => setSel("doc")}
              className={`
                p-2 rounded-md relative
                ${sel === "doc"
                  ? "border-b-2 border-amber-600"
                  : ""
                }
              `}
            >
              <FaFolder
                size={20}
                className="text-slate-700"
              />
            </Link>
}

            <Link
              to="/app/user/updates"
              onClick={() => setSel("not")}
              className={`
                p-2 rounded-md relative
                ${sel === "not"
                  ? "border-b-2 border-amber-600"
                  : ""
                }
              `}
            >

              <FaBell size={20} />

              <span
                className="
                  absolute top-1 right-1
                  bg-red-500 rounded-full
                  h-2 w-2
                "
              />

            </Link>
            
            <Link
              to="/app/user/profile"
              onClick={() => setSel("prof")}
              className={`
                p-2 rounded-md
                ${sel === "prof"
                  ? "border-b-2 border-amber-600"
                  : ""
                }
              `}
            >
              <FaUserCircle
                size={21}
                className="text-slate-700"
              />
            </Link>

          </div>

        </header>


        {/* ============================= */}
        {/* OUTLET CONTENT */}
        {/* ============================= */}

        <main
          className="
            flex-1
            min-h-0
            min-w-0
            overflow-y-auto
            overflow-x-hidden
            p-3 md:p-5 lg:p-6
          "
        >

          {/* 
            This wrapper prevents Outlet pages
            from pushing the dashboard wider.
          */}

          <div className="w-full min-w-0 max-w-full">
             { (user === "parent" && !parentData) && 

<form
  onSubmit={handleSubmit}
  className="max-w-3xl mx-auto space-y-8 p-6 md:p-8 bg-white rounded-3xl border border-slate-200 shadow-xl my-6"
>
  {/* Header Section */}
  <div className="relative overflow-hidden bg-gradient-to-r from-[#0B192C] to-[#1E3A8A] rounded-2xl p-6 text-white shadow-md">
    <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />
    <div className="relative z-10 flex items-center gap-3">
      <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-[#D4AF37]">
        <UserPlus size={24} />
      </div>
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white">
          Setting Up Parent Account
        </h2>
        <p className="text-xs md:text-sm text-slate-300 mt-0.5">
          Enter the parent's information and add the parent's wards.
        </p>
      </div>
    </div>
  </div>

  {/* Parent Information Section */}
  <div className="space-y-4">
    <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B192C] flex items-center gap-2 border-b border-slate-100 pb-2">
      <User size={16} className="text-[#D4AF37]" />
      Parent Information
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Parent Reg No.
        </label>
        <input
          type="text"
          name="regNo"
          disabled={true}
          value={form.regNo}
          onChange={handleChange}
          placeholder="Parent Registration No."
          className="w-full bg-slate-100 text-slate-500 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium cursor-not-allowed focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Full Name <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          name="fullname"
          value={form.fullname}
          onChange={handleChange}
          placeholder="e.g. Chief John Doe"
          className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/15 outline-none transition-all placeholder:text-slate-400"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Occupation
        </label>
        <input
          type="text"
          name="occupation"
          value={form.occupation}
          onChange={handleChange}
          placeholder="e.g. Civil Engineer"
          className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/15 outline-none transition-all placeholder:text-slate-400"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Phone Number
        </label>
        <input
          type="text"
          name="contactPhone"
          value={form.contactPhone}
          onChange={handleChange}
          placeholder="+234..."
          className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/15 outline-none transition-all placeholder:text-slate-400"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Email Address
        </label>
        <input
          type="email"
          name="contactMail"
          value={form.contactMail}
          onChange={handleChange}
          placeholder="parent@example.com"
          className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/15 outline-none transition-all placeholder:text-slate-400"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Home Address
        </label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Residential address"
          className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/15 outline-none transition-all placeholder:text-slate-400"
        />
      </div>

    </div>
  </div>

  {/* Add Ward Section */}
  <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 space-y-3">
    <h3 className="font-bold text-sm text-[#0B192C] flex items-center gap-2">
      <GraduationCap size={16} className="text-[#D4AF37]" />
      Add Student / Ward
    </h3>

    <div className="flex flex-col sm:flex-row gap-2.5">
      <div className="relative flex-1">
        <input
          list="students-list"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          placeholder="Search by student admission number..."
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/15 outline-none transition-all placeholder:text-slate-400 shadow-sm"
        />

        <datalist id="students-list">
          {studentList.map((student) => (
            <option
              key={student._id}
              value={student.admissionNo}
            >
              {student.personalInfo.surname} {student.personalInfo.firstName} - {student.regNo}
            </option>
          ))}
        </datalist>
      </div>

      <button
        type="button"
        onClick={addStudent}
        className="inline-flex items-center justify-center gap-2 bg-[#0B192C] hover:bg-[#1E3A8A] text-[#D4AF37] font-semibold text-sm rounded-xl px-5 py-2.5 shadow-sm hover:shadow transition-all border border-[#D4AF37]/30 shrink-0"
      >
        <Plus size={16} />
        Add Student
      </button>
    </div>
  </div>

  {/* Wards List Section */}
  <div className="space-y-3">
    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
      <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B192C]">
        Selected Wards
      </h3>
      <span className="text-xs font-bold px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-full">
        {wards.length} Ward{wards.length === 1 ? "" : "s"}
      </span>
    </div>

    {wards.length === 0 ? (
      <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
        <Users size={28} className="mx-auto text-slate-300 mb-2" />
        <p className="text-xs font-semibold text-slate-400">
          No ward has been added yet.
        </p>
      </div>
    ) : (
      <div className="space-y-2.5">
        {wards.map((ward) => (
          <div
            key={ward.admissionNo}
            className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-[#D4AF37]/40 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-bold text-sm border border-blue-100">
                {ward.fullname ? ward.fullname.charAt(0) : "S"}
              </div>
              <div>
                <p className="font-bold text-sm text-[#0B192C]">
                  {ward.fullname}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  ADM: <span className="text-slate-700 font-semibold">{ward.admissionNo}</span> • REG: <span className="text-slate-700 font-semibold">{ward.regNo}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => removeStudent(ward.admissionNo)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 rounded-xl px-3 py-1.5 transition-all"
            >
              <Trash2 size={14} />
              Remove
            </button>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Submit Button */}
  <div className="pt-2">
    <button
      type="submit"
      className="w-full bg-gradient-to-r from-[#0B192C] via-[#1E3A8A] to-[#0B192C] hover:opacity-95 text-white font-bold text-base rounded-2xl py-3.5 shadow-lg shadow-blue-950/20 border border-[#D4AF37]/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
    >
      <CheckCircle2 size={18} className="text-[#D4AF37]" />
      Create Parent Account
    </button>
  </div>
</form>
             }
            <Outlet />
          </div>

        </main>

      </div>

    </div>
  );
}






export function AddDocuments({ staffInfo }) {
  const fileRef = useRef(null);

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });


  // =========================================================
  // FILE SELECTION
  // =========================================================

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    setMessage({
      type: "",
      text: "",
    });

    if (!selectedFile) return;


    // -----------------------------------------
    // 500 KB LIMIT
    // -----------------------------------------

    const maxSize = 500 * 1024;

    if (selectedFile.size > maxSize) {
      setFile(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }

      setMessage({
        type: "error",
        text: "File must not be more than 500 KB.",
      });

      return;
    }


    // -----------------------------------------
    // ALLOWED TYPES
    // -----------------------------------------

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setFile(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }

      setMessage({
        type: "error",
        text: "Only PDF, JPG, PNG and WEBP files are allowed.",
      });

      return;
    }


    setFile(selectedFile);
  };


  // =========================================================
  // REMOVE FILE
  // =========================================================

  const removeFile = () => {
    setFile(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };


  // =========================================================
  // UPLOAD
  // =========================================================

  const handleUpload = async (e) => {
    e.preventDefault();

    setMessage({
      type: "",
      text: "",
    });


    if (!title.trim()) {
      setMessage({
        type: "error",
        text: "Please enter a document title.",
      });

      return;
    }


    if (!type) {
      setMessage({
        type: "error",
        text: "Please select a document type.",
      });

      return;
    }


    if (!file) {
      setMessage({
        type: "error",
        text: "Please select a file.",
      });

      return;
    }


    try {
      setLoading(true);


      const formData = new FormData();

      formData.append("file", file);
      formData.append("title", title.trim());
      formData.append("type", type);


      const token = JSON.parse(localStorage.getItem("logged-user")).token;


      const response = await fetch(
        `${mainApi}/staff/documents/upload`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );


      const data = await response.json();


      if (!response.ok) {
        throw new Error(
          data.message || "Document upload failed."
        );
      }


      console.log("Uploaded document:", data);


      setMessage({
        type: "success",
        text: "Document uploaded successfully.",
      });


      // Reset
      setTitle("");
      setType("");
      setFile(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }

    } catch (error) {

      console.error(error);

      setMessage({
        type: "error",
        text:
          error.message ||
          "Something went wrong while uploading.",
      });

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="mx-auto w-full max-w-2xl">

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">

        {/* HEADER */}

        <div className="mb-6">

          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Upload size={21} />
          </div>

          <h2 className="text-lg font-bold text-gray-800">
            Add Document
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Upload a PDF or image document for your staff records.
          </p>

        </div>


        <form onSubmit={handleUpload} className="space-y-5">

          {/* TITLE */}

          <div>

            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Document Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Teaching Certificate"
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>


          {/* TYPE */}

          <div>

            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Document Type
            </label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >

              <option value="">
                Select document type
              </option>

              <option value="Certificate">
                Certificate
              </option>

              <option value="Qualification">
                Qualification
              </option>

              <option value="Identification">
                Identification
              </option>

              <option value="Appointment Letter">
                Appointment Letter
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>


          {/* FILE */}

          <div>

            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              File
            </label>

            {!file ? (

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 px-5 py-10 text-center transition hover:border-blue-300 hover:bg-blue-50/30">

                <Upload
                  size={28}
                  className="mb-3 text-gray-400"
                />

                <p className="text-sm font-semibold text-gray-700">
                  Choose a document
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  PDF, JPG, PNG or WEBP • Maximum 500 KB
                </p>

                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

              </label>

            ) : (

              <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">

                    {file.type === "application/pdf" ? (
                      <FileText size={21} />
                    ) : (
                      <ImageIcon size={21} />
                    )}

                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-gray-800">
                      {file.name}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={removeFile}
                  className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-white hover:text-red-500"
                >
                  <X size={18} />
                </button>

              </div>

            )}

          </div>


          {/* MESSAGE */}

          {message.text && (

            <div
              className={`flex items-start gap-2 rounded-xl p-3 text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >

              {message.type === "success" ? (
                <CheckCircle size={18} className="mt-0.5 shrink-0" />
              ) : (
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
              )}

              <span>{message.text}</span>

            </div>

          )}


          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload Document
              </>
            )}

          </button>

        </form>

      </div>


<StaffDocuments/>
    </div>
  );
}




export function StaffDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);

  const documentsPerPage = 10;

  // =========================
  // FETCH DOCUMENTS
  // =========================
  useEffect(() => {
    async function fetchDocuments() {
      try {
        setLoading(true);
        setError("");

        const token = JSON.parse(localStorage.getItem("logged-user")).token;

        const response = await fetch(`${mainApi}/staff/documents`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch documents");
        }

        setDocuments(data.documents || []);
      } catch (error) {
        console.error(error);
        setError(error.message || "Unable to fetch documents");
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, []);

  // =========================
  // COPY URL TO CLIPBOARD
  // =========================
  const handleCopyUrl = (id, url) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(id);

    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.ceil(documents.length / documentsPerPage);
  const startIndex = (currentPage - 1) * documentsPerPage;
  const currentDocuments = documents.slice(
    startIndex,
    startIndex + documentsPerPage
  );

  // =========================
  // FORMAT DATE
  // =========================
  function formatDate(date) {
    if (!date) return "No date";

    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 font-medium">
        Loading documents...
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <div className="p-12 text-center text-red-600 font-medium">
        {error}
      </div>
    );
  }

  // =========================
  // EMPTY
  // =========================
  if (documents.length === 0) {
    return (
      <div className="p-12 text-center">
        <FileText size={48} className="mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500 font-medium">No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full my-8">
      {/* DOCUMENT GRID (Larger Card Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentDocuments.map((doc) => {
          const isImage = doc.fileType?.startsWith("image/");
          const isPdf = doc.fileType === "application/pdf";
          const isCopied = copiedId === doc._id;

          return (
            <div
              key={doc._id}
              className="group relative bg-white border border-gray-200 hover:border-blue-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* FILE PREVIEW (Height increased to h-52) */}
                <div className="h-52 bg-slate-100 relative flex items-center justify-center overflow-hidden">
                  {isImage ? (
                    <img
                      src={doc.url}
                      alt={doc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <div
                        className={`p-4 rounded-2xl ${
                          isPdf
                            ? "bg-red-50 text-red-500 ring-8 ring-red-50/50"
                            : "bg-slate-200/60 text-slate-500 ring-8 ring-slate-100"
                        }`}
                      >
                        <FileText size={38} strokeWidth={1.75} />
                      </div>
                      <span className="mt-3 text-xs font-semibold tracking-wider uppercase text-gray-400">
                        {isPdf ? "PDF Document" : "Document"}
                      </span>
                    </div>
                  )}

                  {/* FILE TYPE BADGE */}
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm border border-white/40 flex items-center gap-1.5">
                    {isImage ? (
                      <>
                        <ImageIcon size={14} className="text-blue-500" />
                        Image
                      </>
                    ) : (
                      <>
                        <FileText
                          size={14}
                          className={isPdf ? "text-red-500" : "text-gray-500"}
                        />
                        {isPdf ? "PDF" : "Doc"}
                      </>
                    )}
                  </span>

                  {/* COPY URL BUTTON */}
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(doc._id, doc.url)}
                    title="Copy Document URL"
                    className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 backdrop-blur-md text-gray-600 shadow-sm hover:bg-white hover:text-blue-600 transition-all active:scale-95 flex items-center gap-1"
                  >
                    {isCopied ? (
                      <>
                        <Check size={16} className="text-emerald-600" />
                        <span className="text-[11px] font-semibold text-emerald-600 pr-1">
                          Copied
                        </span>
                      </>
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>

                {/* DOCUMENT INFO */}
                <div className="p-5">
                  <h3
                    className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate text-base"
                    title={doc.title}
                  >
                    {doc.title}
                  </h3>

                  <p className="text-xs font-medium text-gray-400 mt-1 capitalize">
                    {doc.type}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400 font-medium">
                    <span>Created</span>
                    <span className="text-gray-600">
                      {formatDate(doc.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTION */}
              <div className="px-5 pb-5 pt-0">
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-xl text-xs transition-all duration-200 shadow-sm hover:shadow-blue-500/25"
                >
                  View Document
                  <ExternalLink
                    size={14}
                    className="opacity-70 group-hover:translate-x-0.5 transition-transform"
                  />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-10">
          <p className="text-xs text-gray-500 font-medium">
            Showing page{" "}
            <span className="text-gray-900 font-semibold">{currentPage}</span>{" "}
            of{" "}
            <span className="text-gray-900 font-semibold">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-gray-200 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-gray-200 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}