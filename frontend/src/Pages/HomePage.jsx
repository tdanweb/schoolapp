import { faCar, faChildren, faGraduationCap, faHome, faBullhorn, faUserCheck, faUserCircle, faStar, faSchoolCircleCheck, faBookAtlas, faTools, faSchool, faChildReaching, faNewspaper, faCarSide, faFileAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom"
import { animate, motion } from "framer-motion"
import { ImageSlider } from "../components/Media"
import { useEffect, useState } from "react"
import SchoolFooter from "../components/Footer"
import { FaBlog, FaEdit, FaMicrophone, FaPen, FaPlusCircle, FaSpeakerDeck, FaTimes, FaTrash, FaUser, FaUserCheck, FaUserCircle } from "react-icons/fa"
import { naira } from "../staticFiles"
import { mainApi } from "../api"
import axios from "axios"
import HomePagePoster from "../Users/Poster"

export default function HomePage() {
    const [selc, setSelc] = useState("Home");
    const [user, setUser] = useState(null);
    const api = `${mainApi}/user/auth`
    const navigate = useNavigate();

    useEffect(() => {
     const user = JSON.parse(localStorage.getItem("logged-user"));
     if(!user){
        navigate("/")
     } else {
        //check if user is online
        const time = new Date().getTime();
        if(time - user.date > user.duration){
            alert("Session Expired! Please Sign In Again")
            localStorage.removeItem("logged-user");
            navigate("/sign-in")
        } else{ 
            //update the date
            localStorage.setItem("logged-user", JSON.stringify({
                ...user,
                date: time
            }));
            setUser(user)
        }
     }

     async function confirmUser(){

      try {
        const res = await axios.get(`${api}?token=${user.token}`);
        //success
      } catch (error) {
        localStorage.removeItem("logged-user")
        navigate("/sign-in")
      }
     }

     confirmUser()
    }, [])
    //check for online, if not true, redirect to signing in...
    return <>
        <div>
            <Headlinks sel="Feeds" user={user}/>
        </div>

        <div className="flex flex-col gap-2">
            <Outlet/>
        </div>

        <SchoolFooter/>
    </>
}


function Headlinks({ user }) {
  const links = [
    {
      link: "/app",
      name: "Home",
      icon: faHome,
      end: true,
    },
    {
      link: "/app/blog",
      name: "Posts",
      icon: faNewspaper,
    },
    {
      link: "/app/tour",
      name: "Virtual Tour",
      icon: faCar,
    },
    {
      link: "/app/academics",
      name: "Academics",
      icon: faChildren,
    },

    /*
    {
      link: "/app/user",
      name: "Portal",
      icon: faUserCircle,
    },
    */
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-800/95 shadow-lg backdrop-blur">
      <div className="mx-auto max-w-7xl">
        
        {/* Navigation */}
        <nav
          className="
            flex items-center gap-1 overflow-x-auto px-2 py-2
            scrollbar-hide
            md:justify-center md:gap-2 md:px-4
          "
        >
          {links.map((item) => (
            <NavLink
              key={item.name}
              to={item.link}
              end={item.end}
              className={({ isActive }) =>
                `
                group relative flex shrink-0 items-center justify-center gap-2
                rounded-lg px-3 py-2 text-sm font-semibold
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-sky-400

                md:min-w-[100px]

                ${
                  isActive
                    ? "bg-sky-500 text-white shadow-md shadow-sky-900/30"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }
                `
              }
            >
              <FontAwesomeIcon
                icon={item.icon}
                className="text-sm transition-transform duration-200 group-hover:scale-110 md:text-base"
              />

              <span className="whitespace-nowrap text-xs sm:text-sm">
                {item.name}
              </span>

              {/* Desktop active indicator */}
              <span className="absolute bottom-0 left-1/2 hidden h-[2px] w-0 -translate-x-1/2 bg-sky-300 transition-all group-hover:w-1/2 md:block" />
            </NavLink>
          ))}
        </nav>

        {/* Welcome section */}
        <div className="flex items-center justify-between border-t border-white/10 px-3 py-2 md:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400 text-slate-800">
              <FontAwesomeIcon icon={faUserCircle} />
            </div>

            <h4 className="truncate font-lato text-xs font-semibold text-amber-200 sm:text-sm">
              Welcome back,{" "}
              <span className="text-white">
                {user?.fullname || "User"}
              </span>
            </h4>
          </div>

          <span className="hidden text-xs text-slate-400 sm:block">
            School Portal
          </span>
        </div>
      </div>
    </header>
  );
}


export {Headlinks}

function HomeView(){
  const navigate = useNavigate()
    //arrays
    //getUser
    const [user, setUser] = useState(null);

   // let user = { thisUser: "admin", regNo: "SCH0001"}
   function getUser(){
    const user = JSON.parse(localStorage.getItem("logged-user"));   
    if(user){
        setUser(user)
    } else {
        //
        navigate("/sign-in")
    }
    }

    const getPost = `${mainApi}/setting/home-posts`
    const [homePosts, setHomePosts] = useState([]);
    const [updates, setUpdates] = useState([]);

    const api2 = `${mainApi}/updates`

    const [showPoster, setShowPoster] = useState(false);

    async function getHomePosts(){
        try {
            const res = await axios.get(`${mainApi}/blog-posts?page=${1}&limit=${3}`);
          //  console.log(res.data.posts)
            setHomePosts(res.data.posts);


            const update = await axios.get(`${api2}/${JSON.parse(localStorage.getItem("logged-user")).user}`)
            setUpdates(update.data.updates)

          } catch (error) {
            if(Error.response){
                alert(error.response.data.msg)
            } else{
                alert("Network Error!")
            }
        }
    }

    useEffect(() => { 
        getHomePosts() 
        getUser()
    }, [])



    const slides = [
  {
    image: "/school-photo-3.jpg",
    heading: "Welcome to Achievers International Academy",
    text: "A PLace where Achievers are groomed. Rich in Sound Training, Vast in Knowledge. Sound Moral Training",
    url: "/about-us",
    linkName: "About AIA"
  },
  {
    image: "/photo1.png",
    heading: "Raising Tomorrow's Champions",
    text: "A premier school offering world-class education in Lagos.",
    url: "/admissions",
    linkName: "Apply Now",
  },
    {
    image: "/cbt.png",
    heading: "First Term, 2026/2027 CBT Examination is around the Corner!",
    text: "We are pleased to inform Parents, Staff and Students that our End of Term CBT Test is starting on Thursday 17th of March, 2027 to end on Tuesday 28th of March, 2027.",
    url: "/posts", //attach postID here
    linkName: "View Post",
  },
  {
    image: "/school-photo-3.jpg",
    heading: "Excellence in Every Classroom",
    text: "NERDC-aligned curriculum, WAEC-certified results.",
    url: "/about",
    linkName: "Learn More",
  }, 
    {
    image: "/school-hall.jpg",
    heading: "AIHS End of the Year Party",
    text: "The School would be having her annual End of Session Celebration this Auggust. Stay Turned!",
    url: "/events", // + "/idofeventsadded"
    linkName: "Learn More",
  }, 
]

    const [selectedPost, setSelectedPost] = useState(null)
    const editPost = async () => {
        const auth = user.thisUser; 
        let auths = ["admin", "chief-admin"];
        const elm = auths.find(a => a === auth)

        if(selectedPost.title.length > 200 || selectedPost.content.length > 1000) return alert("Text in Post is too long")
        if(!elm){
            return alert("You cannot edit this post. Authorization Denied!");
        }

        try {
            const res = await axios.put(`${mainApi}/setting/home-post/edit/${selectedPost._id}`, 
                {
                    post: selectedPost, user
                }
            );
            alert(res.data.msg);
            setHomePosts(prev => prev.map(post => post._id === res.data.post._id ? {...post, ...res.data.post} : post))
            setSelectedPost(null)
        } catch (error) {
            if(error.response){
                alert(error.response.data.msg)
            } else{
                alert("Network Error, Try again!")
            }
        }
    }

    const deletePost = async () => {
        const auth = user.thisUser; 
        let auths = ["admin", "chief-admin"];
        const elm = auths.find(a => a === auth)

        if(!elm){
            return alert("You cannot edit this post. Authorization Denied!");
        }

        try {
            
            const res = await axios.delete(`${mainApi}/setting/home-post/delete`, {
                params: {
                    id: selectedPost._id,
                    user: "admin"
                }
            });

            if(res.data.success){
                alert(res.data.msg);
                setHomePosts(prev => prev.filter(post => post._id === selectedPost._id));
                setSelectedPost(null);
            }
        } catch (error) {
            if(error.response){
                alert(error.response.data.msg)
            } else{
                alert("Network Error, Try again!")
            }          
        }
    }
    const heads = "text-2xl md:text-4xl font-roboto shadow-md self-center font-bold text-slate-700 p-1"


    return <>
    {/*Update and CTA*/}
    <div className="">
{
  (user?.role === "admin" || user?.role === "chief-admin") && showPoster && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      {/* Overlay Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl">

        {/* Close Button */}
        <button
          onClick={() => setShowPoster(false)}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-xl font-bold text-white shadow-md hover:bg-red-600"
          aria-label="Close poster"
        >
          ×
        </button>

        {/* Poster */}
        <HomePagePoster user={user}/>

      </div>
    </div>
  )
}
       {/* <h4 className={heads}>Quick Updates <FontAwesomeIcon icon={faBullhorn} className="text-teal-700"/></h4> */}
        <ImageSlider arr={slides} time={8000}/>
    </div>


    {/* PortAL lOGIN CARD */}

<div className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
  
  {/* Header */}
  <div className="flex items-center gap-4">
    <div className="w-16 h-16 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center overflow-hidden">
      <img
        src="/crest.png"
        alt="School Crest"
        className="w-12 h-12 object-contain"
      />
    </div>

    <div className="flex-1">
      <h2 className="text-lg font-bold text-gray-800">
        Access My Portal
      </h2>

      <p className="text-sm text-gray-500">
        Welcome back, {user?.fullname}
      </p>
    </div>

    <FaUserCheck className="text-blue-600 text-2xl" />
  </div>

  {/* User Information */}
  <div className="mt-5 bg-gray-50 rounded-xl p-4 space-y-3">
    
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">Name</span>
      <span className="text-sm font-semibold text-gray-800">
        {user?.fullname}
      </span>
    </div>

    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">Role</span>
      <span className="text-sm font-semibold text-blue-600 capitalize">
        {user?.role}
      </span>
    </div>

    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">Reg. No.</span>
      <span className="text-sm font-semibold text-gray-800">
        {user?.user}
      </span>
    </div>

  </div>

  {/* Access Button */}
  <Link
    to="/app/user"
    className="mt-5 w-full flex items-center justify-center gap-2
               bg-blue-600 hover:bg-blue-700 text-white
               py-3 rounded-xl font-semibold text-sm
               transition-all duration-200 shadow-sm hover:shadow-md"
  >
    <FaUserCheck />
    Access My Portal
  </Link>

</div>


    {/*Posted Blogs & News & Topics*/}
    <div className="grid grid-cols-1 gap-x-3 gap-y-6 my-10">
      {
        //overlay for passport upload
        selectedPost &&
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="relative bg-white p-5 max-w-full max-h-[95vh] rounded-md shadow-xl overflow-auto">
                {/*Component Here!!*/}
                <div>
                    <p className="font-poppins text-pink-700 text=[10px] my-4">Please Confirm your actions as it cannot be reversed...</p>
                    <input type="text" value={selectedPost.title} className="p-2 my-4 bg-white w-full" onChange={(e) => setSelectedPost({...selectedPost, title: e.target.value})} placeholder="Title Here..."/>
                     <textarea minLength={50} rows={"6"} cols={"50"} value={selectedPost.content} onChange={(e) => setSelectedPost({...selectedPost, content: e.target.value})} className="p-4 bg-gray-200 shadow-lg focus:outline-none" placeholder="Post Content"/>
                        <div className="flex flex-row gap-6 mt-4 items-center p-1 bg-gray-100 rounded-md">
                            <div onClick={editPost} className="bg-indigo-800 text-white p-2  rounded-md flex items-center gap-4  cursor-pointer">SAVE EDIT <FaEdit size={15}/></div>
                            <div onClick={deletePost} className="bg-red-800 text-white cursor-pointer p-2 flex items-center gap-4 rounded-md">DELETE <FaTrash size={15}/></div>
                        </div>
                </div>  
    <button type="button" onClick={() => setSelectedPost(null)} className="absolute cursor-pointer right-5 top-5 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg hover:bg-slate-100">
      <FaTimes size={22}/>
    </button>
  </div>
</div>
      }

        <div className="p-4 rounded-sm grid grid-cols-1 text-lg md:text-2xl text-orange-800 font-bold">

            <div  className="my-2 shadow-lg py-1 center items-center flex flex-row text-center gap-3 px-4 font-bold text-orange-700">
                <FaBlog size={22}/>
                TOP TOPICS/UPDATES 
               {  (user?.role === "admin" || user?.role === "chief-admin") 
                    && <button onClick={() =>
                setShowPoster(true)} className="ml-12 p-2 text-sm w-fit rounded-md text-amber-200 bg-slate-700 gap-4 shadow-lg flex items-center">Create <FaPlusCircle size={16}/></button>
               }
            </div>
            
            <hr/>
{/* =========================
    POSTS SECTION
========================== */}
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
  {homePosts?.map((item) => (
    <motion.div
      key={item._id}
      className="flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
      initial={{ y: 30, opacity: 0.4 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div>
        {/* Header: Title & Controls */}
        <div className="flex items-start justify-between gap-3 pb-3">
          <h4 className="font-lato text-base font-semibold text-slate-800 md:text-lg">
            {item.title || "---"}
          </h4>

          {/* Admin Controls */}
          {(user?.role === "admin" || user?.role === "chief-admin") && (
            <div className="flex shrink-0 items-center gap-1 rounded-lg bg-slate-100 p-1">
              <button
                onClick={() => setSelectedPost(item)}
                className="rounded-md p-1.5 text-slate-600 transition-colors hover:bg-white hover:text-slate-900"
                title="Edit Post"
              >
                <FaEdit size={14} />
              </button>

              <button
                onClick={() => setSelectedPost(item)}
                className="rounded-md p-1.5 text-red-500 transition-colors hover:bg-white hover:text-red-600"
                title="Delete Post"
              >
                <FaTrash size={14} />
              </button>
            </div>
          )}
        </div>

        <hr className="border-slate-100" />

        {/* Author & Date */}
        <div className="mt-3 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-lato font-bold text-slate-700">
            <FaUserCircle size={16} className="text-slate-500" />
            <div className="flex items-center gap-1.5">
              <span>{item.posterId?.fullname || "Achiever"}</span>
              <span
                className={`text-[10px] font-normal italic ${
                  item.thisUser === "admin" || item.thisUser === "chief-admin"
                    ? "text-teal-600 font-semibold"
                    : "text-slate-500"
                }`}
              >
                • {item.thisUser ? item.thisUser.toUpperCase() : "AUTHOR"}
              </span>
            </div>
          </div>

          <div className="text-right text-[11px] font-medium text-slate-400">
            {item.createdAt &&
              new Date(item.createdAt).toLocaleString("en-NG", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
          </div>
        </div>

        {/* Images Grid */}
        {item.images?.length > 0 && (
          <div
            className={`mt-4 grid gap-2 ${
              item.images.length === 1
                ? "grid-cols-1"
                : item.images.length === 2
                ? "grid-cols-2"
                : "grid-cols-2 md:grid-cols-3"
            }`}
          >
            {item.images.map((image, index) => (
              <div
                key={image._id || image.imgId || index}
                className="overflow-hidden rounded-lg bg-slate-100"
              >
                <img
                  src={image.imgUrl}
                  alt={`${item.title || "Post"} - ${index + 1}`}
                  className="aspect-video w-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        {/* Content Excerpt */}
        <p className="mt-4 font-poppins text-sm leading-relaxed text-slate-700 whitespace-pre-line md:text-base">
          {item.excerpt || "No content available."}
        </p>
      </div>

      {/* Read More */}
      <div className="mt-5 flex justify-end border-t border-slate-50 pt-3">
        <Link to={`/app/blog/one/${item._id}`}>
          <button
            onClick={() => setSelectedPost(item)}
            className="font-poppins text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800 hover:underline"
          >
            Read more &rarr;
          </button>
        </Link>
      </div>
    </motion.div>
  ))}
</div>

{/* =========================
    ANNOUNCEMENTS SECTION
========================== */}
<div className="mt-10 rounded-xl border border-orange-100 bg-orange-50/30 p-5 shadow-sm">
  <h2 className="mb-4 font-poppins text-xl font-bold text-orange-800 md:text-2xl">
    Announcements From School..
  </h2>

  {updates && updates.length > 0 && (
    <div className="space-y-3">
      {updates.map((update) => (
        <div
          key={update._id}
          className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow"
        >
          <div className="flex gap-4">
            {/* Update indicator */}
            <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                <h3 className="font-poppins font-semibold text-slate-900">
                  {update.title}
                </h3>

                <span className="text-xs font-medium text-slate-400">
                  {new Date(update.createdAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <p className="mt-2 font-poppins text-sm leading-6 text-slate-600">
                {update.body}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-medium text-slate-800">
                  {update.poster?.displayName}
                </span>

                <span className="text-slate-300">•</span>

                <span className="capitalize text-slate-500">
                  {update.poster?.staffType}
                </span>

                <span className="text-slate-300">•</span>

                <span className="text-slate-400">
                  {new Date(update.createdAt).toLocaleTimeString("en-NG", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

        </div>


    </div>

    <UsefulLinks/>
    

    {/*Photo speaks and Achiements, next up*/}

    {/*Upcoming Events*/}

    {/*Footer*/}
    </>
}

export {HomeView}

function UsefulLinks() {
    const usefulLinks = [
        {
            name: "Mission/Vision",
            url: "/mission-vision",
            icon: faStar,
            style: "text-sky-700",
        },
        {
            name: "Facilities",
            url: "/facilities",
            icon: faSchool,
            style: "text-emerald-700",
        },
        {
            name: "Academics",
            url: "/academics",
            icon: faSchoolCircleCheck,
            style: "text-teal-700",
        },
        {
            name: "Curriculum",
            url: "/curriculum",
            icon: faBookAtlas,
            style: "text-gray-700",
        },
        {
            name: "Club & Society",
            url: "/extra-curricular",
            icon: faChildren,
            style: "text-indigo-800",
        },
        {
            name: "Admission Portal",
            url: "/admission",
            icon: faGraduationCap,
            style: "text-amber-700",
        },
        {
            name: "Result Portal",
            url: "/result",
            icon: faFileAlt,
            style: "text-amber-700",
        },
        {
            name: "Events",
            url: "/events",
            icon: faChildReaching,
            style: "text-blue-800",
        },
        {
            name: "STEM",
            url: "/stem",
            icon: faTools,
            style: "text-orange-800",
        },
        {
            name: "Virtual Tour",
            url: "/app/tour",
            icon: faCarSide,
            style: "text-purple-700",
        },
    ];

    return (
        <div className="my-6 p-2 md:p-4">
            {/* Section Header */}
            <div className="mb-6">
                <p className="bg-slate-800 text-white font-bold text-xl md:text-2xl px-4 py-3 rounded-lg shadow">
                    Useful Links
                </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                {usefulLinks.map((item) => (
                    <Link
                        key={item.url}
                        to={item.url}
                        className="
                            group
                            relative
                            flex flex-col
                            items-center
                            justify-center
                            min-h-[140px]
                            p-4
                            bg-white
                            rounded-xl
                            border border-slate-100
                            shadow-md
                            hover:shadow-xl
                            hover:-translate-y-1
                            transition-all
                            duration-300
                        "
                    >
                        {/* Icon */}
                        <div
                            className={`
                                w-16 h-16
                                md:w-20 md:h-20
                                flex items-center justify-center
                                rounded-full
                                bg-slate-50
                                group-hover:bg-slate-100
                                transition-colors
                                duration-300
                                mb-3
                            `}
                        >
                            <FontAwesomeIcon
                                icon={item.icon}
                                className={`${item.style} text-3xl md:text-4xl`}
                            />
                        </div>

                        {/* Name */}
                        <span className="text-sm md:text-base font-bold text-slate-700 text-center group-hover:text-slate-900">
                            {item.name}
                        </span>

                        {/* Small arrow */}
                        <span className="absolute bottom-3 right-3 text-slate-300 group-hover:text-slate-600 transition-colors">
                            →
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}


export {UsefulLinks}