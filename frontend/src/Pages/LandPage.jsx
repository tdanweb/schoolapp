import { faEnvelope, faGraduationCap,
  faUserCircle, faCar, faPaperPlane, faLocationArrow,
  faEnvelopeCircleCheck, faEye, faEyeSlash, faKey, faMessage, faPhone, faUserCheck } from "@fortawesome/free-solid-svg-icons";
  import { 
  FaDotCircle,
  FaGraduationCap, 
  FaUserCircle, 
  FaCar, 
  FaPaperPlane, 
  FaLocationArrow,
  FaChild,
  FaShapes,
  FaBookReader,
  FaTimes,
  FaUserGraduate, 
  FaCheckCircle,
  FaArrowRight,
  FaFile,
  FaFileAlt,
  FaCalendarAlt,
  FaToolbox
} from "react-icons/fa";
import { Input, PopUp } from "../components/LogInForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { mainApi } from "../api";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion"


import heroImage from "../assets/school-photo-3.jpg";
let crest = "/CREST.jpg";
import { ImageSlider } from "../components/Media";
import { CREST, Crest } from "../assets/Assets";
import StudentRegForm from "../Users/StudentRegForm";
import SchoolFooter from "../components/Footer";
import DeveloperNotice from "../DevMemo";

//image slides for HomePage
const infoSlide = [
  {
    image: "/school-gate-hd.jpg",
    heading: "Raising Tomorrow's Champions",
    text: "A premier school offering world-class education in Lagos. Pre-Schooler, Basic Classes, Junior and Senior High School. Offering a Blend of British/Nigerian Curriculum.",
    url: "/admissions",
    linkName: "Apply Now",    
  },
  {
    image: "/classroom1.jpg",
    heading: "Raising Tomorrow's Champions",
    text: "A Premier school offering world-class education in Lagos. Academics Cover Pre-Schooler, Basic Classes, Junior and Senior High School. Offering a Blend of British/Nigerian Curriculum.",
    url: "/academics",
    linkName: "More on Academics",    
  },
    {
    image: "/school-hall.jpg",
    heading: "A Community of visionaries and vision-driven Students",
    text: "Events: Students are the Achievers take part in events, not for present achievement but even future fitting into the societies they might find themselves",
    url: "/events",
    linkName: "More on Academics",    
  },
  {
    image: "/sport.jpg",
    heading: "Committed to Total Child Development",
    text: "AIA offers a vast of Extra-curricular activitiees for every child's need beyond the academics aspect...",
    url: "/academics",
    linkName: "More on Academics",    
  },
  {
    image: "/school-drone-view.jpg",
    heading: "Located in a serene Environment",
    text: "A premier school offering world-class education in Lagos. Pre-Schooler, Basic Classes, Junior and Senior High School. Offering a Blend of British/Nigerian Curriculum.",
    url: "/admission",
    linkName: "Apply for Admission",    
  },
  {
    image: "/school-photo-3.jpg",
    heading: "Remote research Center for Educators",
    text: "A premier school offering world-class education in Lagos. Pre-Schooler, Basic Classes, Junior and Senior High School. Offering a Blend of British/Nigerian Curriculum.",
    url: "/about",
    linkName: "About AIA",    
  } 
]
// Sample academic levels data structure (replace image paths with your actual assets)
const academicLevels = [
  {
    title: "Preschool",
    age: "Ages 1.5 - 3 Years",
    description: "A nurturing environment designed to foster curiosity, sensory development, and foundational social skills through play-based learning.",
    image: "/nursery.jpg", 
    icon: FaChild,
    color: "from-pink-500 to-rose-500"
  },
  {
    title: "Nursery",
    age: "Ages 3 - 5 Years",
    description: "Building early literacy, numeracy, and cognitive development through structured activities and interactive learning tools.",
    image: "/playground.jpg",
    icon: FaShapes,
    color: "from-amber-400 to-orange-500"
  },
  {
    title: "Basic Grade",
    age: "Ages 5 - 11 Years",
    description: "A robust primary curriculum emphasizing core subjects, critical thinking, digital literacy, and holistic character building.",
    image: "/computer-lab.jpg",
    icon: FaBookReader,
    color: "from-emerald-400 to-[#0F4C81]"
  },
  {
    title: "High School",
    age: "Ages 11 - 17 Years",
    description: "Comprehensive secondary education preparing students for global competitive examinations, leadership, and tertiary education.",
    image: "/assembly.jpg",
    icon: FaUserGraduate,
    color: "from-indigo-600 to-[#0F4C81]"
  }
];

export default function LandingPage() {
  const [showDevMemo, setShowDevMemo] = useState(true);
  const navigate = useNavigate();
  const [settings, setSettings] = useState({});
  const [email, setEmail] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const user = JSON.parse(localStorage.getItem("logged-user"));
      if (user) {
        const date = new Date().getTime();
        const diff = user.date - date;
        if (diff < user.duration) {
          setAlertMsg("Your session has expired. Please log in again. Kindly re-enter your password");
          setEmail(user.user.email);
        } else {
          navigate("/app");
        }
      }
    }
    async function getSettings() {
      try {
        const res = await axios.get(`${mainApi}/setting`);
        setSettings(res.data.settings.setUps);
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    }
      const user = JSON.parse(localStorage.getItem("logged-user"));
      if(user) {
        const date = new Date().getTime();
        const diff = user.date - date;
        if(diff < user.duration) {
          setAlertMsg("Your session has expired. Please log in again. Kindly re-enter your password");
          setEmail(user.user.email);
        } else {
        setloggedIn(true); 
        navigate("/app");
        }
      }

    getUser();
    getSettings();
  }, [navigate]);

  return (
    <div className="bg-slate-50 text-gray-800">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[#0F4C81]/70 shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src={crest}
              alt="School Crest"
              className="w-12 h-12 rounded-full bg-white p-1"
            />
            <div>
              <h2 className="text-white font-bold">
                Achievers' International High School
              </h2>
              <p className="text-yellow-300 text-xs">
                Excellence • Discipline • Leadership
              </p>
            </div>
          </div>

          <div className="hidden md:flex gap-8 text-white font-medium">
            <a className="hover:text-yellow-300 transition" href="#academics">Academics</a>
            <a className="hover:text-yellow-300 transition" href="#about">About</a>
            <a className="hover:text-yellow-300 transition" href="#why">Why Us</a>
            <a className="hover:text-yellow-300 transition" href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <img
          src={"/school-gate-hd.jpg"}
          alt="School Gate"
          className="absolute w-full h-full object-cover blur-[3pt] scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#0F4C81]/30"></div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-6"
        >
          <img
            src={CREST}
            className="w-32 mx-auto mb-6 rounded-lg shadow-lg"
            alt="Crest"
          />

          <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow">
            Achievers
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-yellow-400 mt-3 drop-shadow">
            International Schools
          </h2>

          <p className="text-gray-200 mt-6 max-w-2xl mx-auto text-lg">
            Raising tomorrow's leaders through quality education,
            innovation, discipline and global excellence.
          </p>

          <div className="mt-10 flex justify-center text-[10pt] gap-5 flex-wrap font-poppins">
            <Link
              to="/admission"
              className="bg-yellow-300 flex items-center gap-2 hover:bg-yellow-500 transition p-3 px-4 rounded-full font-semibold text-slate-900"
            >
              Apply Now <FaGraduationCap size={18} />
            </Link>
            <button
              onClick={() => setShowDevMemo(true)}
              className="bg-pink-300 flex items-center gap-2 hover:bg-yellow-500 transition p-3 px-4 rounded-full font-semibold text-slate-900"
            >
              Site Guide <FaToolbox size={18} />
            </button>
            <Link
              to="/sign-in"
              className="bg-teal-600 flex items-center gap-2 hover:bg-teal-700 text-white transition p-3 px-4 rounded-full font-semibold"
            >
              Sign In <FaUserCircle size={18} />
            </Link>

            <Link
              to="/tour"
              className="flex items-center gap-2 border border-white bg-indigo-800 text-white hover:bg-white hover:text-[#0F4C81] font-semibold transition p-3 px-4 rounded-full"
            >
              Virtual Tour <FaCar size={18} />
            </Link>
            <Link
              to="/result"
              className="flex items-center gap-2 border border-white bg-slate-800 text-pink-200 hover:bg-white hover:text-[#0F4C81] font-semibold transition p-3 px-4 rounded-full"
            >
              Results Portal <FaFileAlt size={18} />
            </Link>

            <Link
              to="/calendar"
              className="flex items-center gap-2 border border-white bg-pink-800 text-white hover:bg-white hover:text-[#0F4C81] font-semibold transition p-3 px-4 rounded-full"
            >
              Current <FaCalendarAlt size={18} />
            </Link>
            <a
              href="#about"
              className="border font-semibold flex items-center gap-2 border-white text-amber-200 hover:bg-white hover:text-[#0F4C81] transition p-3 px-4 rounded-full"
            >
              Learn More <FaPaperPlane size={18} />
            </a>
          </div>
        </motion.div>
      </section>
{showDevMemo && (
  <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/60 p-4">
    <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">

      {/* Close */}
      <button
        onClick={() => setShowDevMemo(false)}
        className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
      >
        ×
      </button>

      {/* Your notice component */}
      <DeveloperNotice/>

    </div>
  </div>
)}
      {/* ================= ACADEMICS ================= */}
      <section id="academics" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#0F4C81]">
              Academic Programs
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mt-4 mb-4"></div>
            <p className="max-w-2xl mx-auto text-gray-600 text-lg">
              We offer a progressive learning pathway designed to nurture academic brilliance and character from early childhood through high school graduation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {academicLevels.map((level, index) => {
              const Icon = level.icon;
              return (
                <motion.div
                  key={level.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col"
                >
                  {/* Card Image Container */}
                  <div className="relative h-48 overflow-hidden group">
                    <img
                      src={level.image}
                      alt={level.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <span className="absolute bottom-3 left-4 text-xs font-semibold uppercase tracking-wider text-yellow-300 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
                      {level.age}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2.5 rounded-lg text-white bg-gradient-to-r ${level.color}`}>
                          <Icon size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-[#0F4C81]">
                          {level.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {level.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to="/admission"
                        className="text-xs font-bold text-[#0F4C81] hover:text-yellow-600 flex items-center gap-1 group"
                      >
                        Enroll Now 
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* [============== Photo SLides ===========] */}
      <section id="slide" className="my-2">
        <motion.div 
          initial={{ y: 60, opacity: 0.4 }} 
          whileInView={{ y: 0, opacity: 1 }} 
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <ImageSlider time={8000} arr={infoSlide} />
        </motion.div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-[#0F4C81] text-center">
              About Us
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mt-4 mb-8"></div>
            <p className="text-center max-w-3xl mx-auto text-lg text-gray-600 leading-8">
              Achievers' International High School is committed to
              nurturing students into responsible leaders equipped
              with academic excellence, sound morals, innovation,
              creativity and global competitiveness.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= WHY US ================= */}
      <section id="why" className="py-24 bg-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-4xl font-bold text-[#0F4C81] mb-16">
            Why Choose Us?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Experienced Teachers",
                icon: "fa-user-graduate"
              },
              {
                title: "Modern ICT Labs",
                icon: "fa-laptop-code"
              },
              {
                title: "Quality Education",
                icon: "fa-book-open"
              }
            ].map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-lg p-8 text-center"
              >
                <i className={`fas ${item.icon} text-5xl text-[#F4B400] mb-6`}></i>
                <h3 className="text-2xl font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  We provide an environment where every child can thrive
                  academically and morally.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-[#0F4C81] py-20">
        <div className="text-center px-6">
          <h2 className="text-white text-4xl font-bold">
            Admissions Application Here!
          </h2>
          <p className="text-gray-200 mt-5">
            Join a community where excellence is a lifestyle.
          </p>
          <Link
            to="/admission"
            className="inline-block mt-8 bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-8 py-3 rounded-full font-semibold transition"
          >
            Start Application
          </Link>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-[#0F4C81]">
            Contact Us
          </h2>

          <div className="mt-8 space-y-3 text-lg">
            <p className="px-4 flex flex-row items-center gap-6 justify-center">
              <i className="fas fa-map-marker-alt text-[#F4B400] mr-2"></i>
              <FaLocationArrow size={22} /> GRA, Maitama, Abuja F.C.T, Nigeria
            </p>

            <p>
              <i className="fas fa-phone text-[#F4B400] mr-2"></i>
              +234-7053489210 +234-8112373527
            </p>

            <p>
              <i className="fas fa-envelope text-[#F4B400] mr-2"></i>
              info@achievershighschool.edu.ng
            </p>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <SchoolFooter />
      <footer className="bg-[#0B1F3A] text-gray-300 py-8">
        <div className="text-center">
          © {new Date().getFullYear()} Achievers' International High School
          <p className="mt-2 text-sm">
            Excellence • Discipline • Leadership
          </p>
        </div>
      </footer>
    </div>
  );
}


export function UserForm({ user }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [state, setState] = useState("login");
  
  // API endpoints
  const logInApi = `${mainApi}/user/login`;
  const registerApi = `${mainApi}/user`;

  // Common fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  // User registration fields
  const [newUserObj, setNewUserObj] = useState(null);
  const [lastname, setLastname] = useState("");
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [password2, setPassword2] = useState("");
  const [thisUser, setThisUser] = useState("staff");
  const [passport, setPassport] = useState("");

  // Alert & Navigation States
  const [alerter, setAlerter] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [loggedIn, setloggedIn] = useState(false);


  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("logged-user"));

    if (storedUser) {
      const now = new Date().getTime();
      const diff = now - storedUser.date; // Corrected elapsed time calculation

      if (diff > storedUser.duration) {
        setAlertMsg(
          `Welcome Back, ${storedUser.fullname}! Your session has expired. Please log in again.`
        );
        setEmail(storedUser.user || "");
      } else {
        setloggedIn(true);
        navigate("/app");
        return;
      }

      // Verify user token if available
      if (storedUser.token) {
        async function confirmUser() {
          try {
            const res = await axios.get(`${mainApi}/user/auth?token=${storedUser.token}`);
            if (res.data) {
              navigate("/app");
            }
          } catch (error) {
            localStorage.removeItem("logged-user");
          }
        }

        confirmUser();
      }
    }
  }, [navigate]);

  const clearForm = () => {
    setLastname("");
    setFullname("");
    setPhone("");
    setPassword2("");
    setThisUser("staff");
    setPassport("");
    setPassword("");
  };

  async function logUserIn(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(logInApi, { email, password });
      let data = res.data;


      setErrorMsg("")
      setSuccessMsg("You are now Logged in. Click 'PROCEED' to access your portal");
      clearForm();
      setloggedIn(true);

      localStorage.setItem(
        "logged-user",
        JSON.stringify({
          user: data.user,
          thisUser: data.thisUser,
          date: new Date().getTime(),
          token: data.token,
          role: data.role,
          id: data.id,
          fullname: data.name,
          duration: 1000 * 60 * 60 * 24, // 1 day expiration
        })
      );
    } catch (error) {
      setSuccessMsg("")
      if (error.response) {
        setErrorMsg(error.response.data.msg || "Invalid Credentials");
      } else {
        setErrorMsg("Oops! An Error occurred on the Server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function registerUser(e) {
    e.preventDefault();
    if (password !== password2) {
      return alert("Passwords do not match, Please Check Again!");
    }

    setLoading(true);
    try {
      const newUser = await axios.post(registerApi, {
        email,
        password,
        lastname,
        fullname,
        phone,
        thisUser,
        passport,
      });

      if (newUser.data.success) {
        setNewUserObj(newUser.data);
        setErrorMsg("")
        setSuccessMsg(
          "You have successfully registered with unique ID/REG NO: " +
            newUser.data.user.regNo +
            ". Click PROCEED to access your account."
        );

        clearForm();

setTimeout(() => {
  navigate("/sign-in");
}, 2000);

      }
    } catch (error) {
      setSuccessMsg("")
      if (error.response) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Network Error.. Please Try Again");
      }
    } finally {
      setLoading(false);
    }
  }

  const toLogIn = () => {
    if (loggedIn) {
      navigate("/app");
    } else {
      setToLogin();
    }
  };

  function setToLogin() {
    setSuccessMsg("");
    setErrorMsg("");
    setPassword("");
    setState("login");
  }

  const closeIt = () => {
    setSuccessMsg("")
    setErrorMsg("")
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative"
      style={{ backgroundImage: `url('/school-hall.jpg')` }}
    >
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />
      <div className="w-full relative z-10">
        
        {/* PopUp Modal */}
        {(successMsg || errorMsg) && (
          <PopUp
            close={closeIt}
            message={
              <div className="w-full">
                {/* Status Header */}
                <div
                  className={`relative px-6 pt-7 pb-6 ${
                    successMsg
                      ? "bg-emerald-50 dark:bg-emerald-950/30"
                      : "bg-rose-50 dark:bg-rose-950/30"
                  }`}
                >
                  <div className="flex justify-center mb-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.1,
                        duration: 0.3,
                        type: "spring",
                        stiffness: 180,
                      }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        successMsg
                          ? "bg-emerald-100 dark:bg-emerald-900/60"
                          : "bg-rose-100 dark:bg-rose-900/60"
                      }`}
                    >
                      {successMsg ? (
                        <FaCheckCircle className="text-emerald-500" size={34} />
                      ) : (
                        <FaTimes className="text-rose-500" size={30} />
                      )}
                    </motion.div>
                  </div>

                  <div className="text-center">
                    <h2
                      className={`text-xl font-bold ${
                        successMsg
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-rose-700 dark:text-rose-400"
                      }`}
                    >
                      {successMsg ? "Operation Successful" : "Operation Failed"}
                    </h2>

                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                      {successMsg
                        ? "Your request was completed successfully"
                        : "Something went wrong"}
                    </p>
                  </div>
                </div>

                {/* Body Message */}
                <div className="px-6 py-5">
                  <p className="text-center text-sm md:text-base leading-6 text-slate-600 dark:text-slate-300">
                    {successMsg ? successMsg : errorMsg}
                  </p>
                </div>

                {/* Action Footer */}
                <div className="px-6 pb-6">
                  {successMsg ? (
                    <button
                      type="button"
                      onClick={state === "login" ? toLogIn : setToLogin}
                      className="w-full px-5 py-3 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      PROCEED
                      <FaArrowRight size={15} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={closeIt} // Fixed infinite loop bug here
                      className="w-full px-5 py-3 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      CLOSE
                      <FaTimes size={14} />
                    </button>
                  )}
                </div>
              </div>
            }
          />
        )}

        {/* Main Form Container */}
        <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-slate-100/50 overflow-hidden">
          <div className="flex items-center gap-4 px-6 py-5 bg-slate-50/80 border-b border-slate-200">
            <Crest />
            <h4 className="font-bold text-lg md:text-xl text-slate-800">
              Achievers International Schools
            </h4>
          </div>

          <div className="p-6 md:p-10">
            <form
              onSubmit={state === "login" ? logUserIn : registerUser}
              className="space-y-6"
            >
              {/* Register Controls */}
              {state === "register" && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">
                      Create an Account
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Register as Staff or Parent
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="email"
                      title="Email"
                      icon={faEnvelopeCircleCheck}
                      required
                      val={email}
                      click={(e) => setEmail(e.target.value)}
                    />

                    <Input
                      type="text"
                      title="Full Name"
                      icon={faUserCheck}
                      required
                      val={fullname}
                      click={(e) => setFullname(e.target.value)}
                    />

                    <Input
                      type="text"
                      title="Last Name"
                      icon={faUserCheck}
                      required
                      val={lastname}
                      click={(e) => setLastname(e.target.value)}
                    />

                    <Input
                      type="tel"
                      title="Phone Number"
                      icon={faPhone}
                      required
                      val={phone}
                      click={(e) => setPhone(e.target.value)}
                    />

                    <Input
                      type={!show ? "password" : "text"}
                      title="Create Password"
                      icon={faKey}
                      required
                      val={password}
                      click={(e) => setPassword(e.target.value)}
                    />

                    <Input
                      type={!show ? "password" : "text"}
                      title="Confirm Password"
                      icon={faKey}
                      required
                      val={password2}
                      click={(e) => setPassword2(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">
                      Select Category
                    </label>
                    <select
                      value={thisUser}
                      onChange={(e) => setThisUser(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                    >
                      <option value="staff">Staff</option>
                      <option value="parent">Parent</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {/* Login Controls */}
              {state === "login" && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">Sign In</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Access portal for Staff, Parents, and Students
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Input
                      type="text"
                      title="Email or Reg No"
                      icon={faEnvelopeCircleCheck}
                      required
                      val={email}
                      click={(e) => setEmail(e.target.value)}
                    />

                    <Input
                      type={!show ? "password" : "text"}
                      title="Password"
                      icon={faKey}
                      required
                      val={password}
                      click={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </motion.div>
              )}

              {/* Password Visibility Toggle */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                >
                  <FontAwesomeIcon icon={show ? faEye : faEyeSlash} />
                  <span>{show ? "Hide Password" : "Show Password"}</span>
                </button>
              </div>

              {/* Mode Toggle Banner */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 text-sm text-slate-600 text-center">
                {state === "login" ? (
                  <span>
                    New User?{" "}
                    <button
                      type="button"
                      onClick={() => setState("register")}
                      disabled={loading}
                      className="text-sky-700 font-semibold hover:underline ml-1 cursor-pointer"
                    >
                      Create Account
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{" "}
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => setState("login")}
                      className="text-sky-700 font-semibold hover:underline ml-1 cursor-pointer"
                    >
                      Sign In
                    </button>
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-lg bg-sky-700 hover:bg-sky-800 disabled:opacity-50 text-white font-medium text-base shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  {loading
                    ? "Processing..."
                    : state === "login"
                    ? "Sign In"
                    : "Create Account"}
                </button>

                {state !== "login" && (
                  <p className="text-xs text-center text-slate-500 font-medium">
                    Note: New accounts require administrative approval before activation.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}