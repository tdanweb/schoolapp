import { useEffect, useState } from "react"
import { Link, Navigate, Outlet, useNavigate, useParams } from "react-router-dom"
import { mainApi } from "../../api";
import axios from "axios";
import { motion } from "framer-motion";
import { Settings, BellRing } from "lucide-react";
const api = `${mainApi}/setting`;

import  { AllSideBarLinks } from "../SideLinks";
import { FaBars, FaBell, FaInbox, FaSignOutAlt, FaUserCircle } from "react-icons/fa";



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
    const [adminData, setAdminData] = useState(null);
    const [staffData, setStaffData] = useState(null);
    const [studentData, setStudentData] = useState(null);
    const [parentData, setParentData] = useState(null);

//get settings....
 async function getSettings() {
            const api = `${mainApi}/setting`;
            try {
                const res = await axios.get(api);
           //     if (res?.data) setSetting(res.data.settings.setUps);
                console.log(res.data)
                 
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
        console.log("USER DATA DASHBOARD: ", dashData.data);
        setUpdates(dashData.data.updates);
       
        //data fetching...
        if(dashData.data.staff){
          setStaffData(dashData.data)
          return;
        }

        if(dashData.data.student){
          setStudentData(dashData.data);
          return;
        }
       // setUserData(dashData.data.dashboard);

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
        getAdminDashboardData();
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


       {user?.role === "student" && <StudentDashboard studentData={studentData}/>}
       {/*user?.role === "parent" && <ParentDashboardHome/>   */}
       {(user?.role === "staff" || user?.role === "admin" || user?.role === "chief-admin") && <StaffDashboard staffData={staffData} adminData={adminData || null}/>}

        <div className="my-4"></div>

       {
        /*settings and term info..
        <TermInfo termSetting={termInfo}/>
        */
       }


{updates && updates.length > 0 && (
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

  // now fetch the user
  const users = ["student", "parent", "staff", "admin", "chief-admin"];

  const [user, setUser] = useState(""); // just for testing

  const [userInfo, setUserInfo] = useState(null);
  const [roles, setRoles] = useState(null);

  const [settings, setSettings] = useState(null);
  const [terms, setTerms] = useState(null);
  const [load, setLoad] = useState(false);

  // =[============  If Parent Portal ===============]
  const [parentData, setParentData] = useState(null)

  useEffect(() => {
    async function getUser() {
      const savedUser = JSON.parse(
        localStorage.getItem("logged-user")
      )
  //    console.log("SAVED USER: ", savedUser)
      setUserInfo(savedUser);
      setUser(savedUser.role);
     // return;
      try {
        //get user profile
        const theUser = await axios.get(`${userApi}/${savedUser.id}`);

        const data = theUser.data
       // console.log("Data from User Portal: ", data);
        setAlertMsg("DASH-MAIN: " + data.msg)
        if(data.staff){
          setRoles(theUser.data.staff.specialRoles)
        }
   //     return;

        setCurrentUser(data.staff || data.student || data.parent)

        if(theUser.data.parent){
          setParentData(data.parent);
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
            {(user === "parent" && !parentData) && <ParentSetUpForm />}
            <Outlet />
          </div>

        </main>

      </div>

    </div>
  );
}



function  ParentSetUpForm({data, students}){

}