import { faCar, faChildren, faGraduationCap, faHome, faBullhorn, faUserCheck, faUserCircle, faStar, faSchoolCircleCheck, faBookAtlas, faTools, faSchool, faChildReaching, faNewspaper, faCarSide, faFileAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { animate, motion } from "framer-motion"
import { ImageSlider } from "../components/Media"
import { useEffect, useState } from "react"
import SchoolFooter from "../components/Footer"
import { FaBlog, FaEdit, FaMicrophone, FaPen, FaPlusCircle, FaSpeakerDeck, FaTimes, FaTrash, FaUser, FaUserCircle } from "react-icons/fa"
import { naira } from "../staticFiles"
import { mainApi } from "../api"
import axios from "axios"
import HomePagePoster from "../Users/Poster"

export default function HomePage() {
    const [selc, setSelc] = useState("Home");
    const [user, setUser] = useState(null);

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


function Headlinks({sel, click, user}){

    const [selc, setSelc] = useState("");

    const Links = [
        {link: "/app", name: "Home", icon: faHome},
        {link: "/app/blog", name: "Posts", icon: faNewspaper},
        {link: "/app/tour", name: "Virtual Tour", icon: faCar},
        {link: "/app/academics", name: "Academics", icon: faChildren},
        {link: "/app/user", name: "Portal", icon: faUserCircle}
    ]

    return <div className="px-2 py-2 bg-slate-600">
        <nav className="flex flex-row items-center gap-1 md:gap-4 md:justify-center justify-between">
        {Links.map((item) => (
            <Link onClick={() => setSelc(item.name)}
             className={`p-1 ${item.name === selc ? "border-b-2 border-sky-500" : ""} font-poppins rounded-sm text-gray-700 rounded-sm shadow-lg font-bold gap-1 font-poppins flex md:flex-row flex-col md:gap-2 items-center text-white `} 
                to={item.link}>
                <FontAwesomeIcon className="font-bold text-[12px] md:text-xl" icon={item.icon}/>
                <span className=" md:text-md text-[9px]">{item.name}</span>
            </Link>
        ))}
        </nav>

        <h4 className="p-1 text-sm font-lato text-amber-200 font-semibold">Welcome Back, {user?.fullname || ""}</h4>
    </div>
}

export {Headlinks}

function HomeView(){
    //arrays
    //getUser
    const [user, setUser] = useState(null);

   // let user = { thisUser: "admin", regNo: "SCH0001"}
   function getUser(){
    const user = JSON.parse(localStorage.getItem("logged-user"));   
    if(user){
        console.log(user)
        setUser(user)
    } else {
        //
    }
    }

    const getPost = `${mainApi}/setting/home-posts`

    const [homePosts, setHomePosts] = useState([])

    const [showPoster, setShowPoster] = useState(false);

    async function getHomePosts(){
        try {
            const res = await axios.get(`${mainApi}/blog-posts?page=${1}&limit=${3}`);
          //  console.log(res.data.posts)
            setHomePosts(res.data.posts);
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

        <div className="p-4 rounded-sm grid grid-cols-1 text-2xl text-orange-800 font-bold">

            <div  className="my-2 shadow-lg py-1 center items-center flex flex-row text-center gap-3 px-4 font-bold text-orange-600">
                <FaBlog size={28}/>
                TOP TOPICS/UPDATES 
               {  (user?.role === "admin" || user?.role === "chief-admin") 
                    && <button onClick={() =>
                setShowPoster(true)} className="ml-12 p-2 text-sm w-fit rounded-md text-amber-200 bg-slate-700 gap-4 shadow-lg flex items-center">Create <FaPlusCircle size={16}/></button>
               }
            </div>
            
            <hr/>
            {/* Array of post -- Just 3 */}
        <div className="grid grid-cols-1 gap-7 md:gap-x-10 md:grid-cols-2">
{
  homePosts?.map((item) => (
    <motion.div
      key={item._id}
      className="p-2 rounded-md shadow-lg bg-white"
      initial={{ y: 30, opacity: 0.4 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >

      {/* =========================
          HEADER
      ========================== */}
      <div className="flex justify-between items-start gap-3">

        <h4 className="p-1 text-[12pt] text-gray-800 font-lato font-semibold">
          {item.title || "---"}
        </h4>

        {/* Admin Controls */  
        user?.role === "admin" || user?.role === "chief-admin" &&
        <div className="flex flex-row gap-2 items-center p-1 bg-gray-100 rounded-md shrink-0">

          <button
            onClick={() => setSelectedPost(item)}
            className="bg-gray-100 p-1 rounded-md cursor-pointer hover:bg-gray-200"
          >
            <FaEdit size={15} />
          </button>

          <button
            onClick={() => setSelectedPost(item)}
            className="bg-gray-100 cursor-pointer p-1 rounded-md hover:bg-gray-200"
          >
            <FaTrash size={15} color="red" />
          </button>

        </div>
         }

      </div>

      <hr />

      {/* =========================
          AUTHOR + DATE
      ========================== */}
      <div className="mt-2 flex flex-row items-center justify-between gap-4 text-[9px]">

        {/* Author */}
        <div className="py-1 text-[10px] font-lato font-bold flex flex-row items-center gap-2 bg-gray-100 rounded-lg w-fit px-2">

          <FaUserCircle size={16} />

          <div className="grid grid-cols-1 items-center">

            <span>
              {item.posterId?.fullname || "Achiever"}
            </span>

            <span
              className={
                (item.thisUser === "admin" ||
                  item.thisUser === "chief-admin")
                  ? "text-[8px] text-teal-600 italic"
                  : "text-[8px] text-gray-500 italic"
              }
            >
              {item.thisUser
                ? item.thisUser.toUpperCase()
                : "AUTHOR"}
            </span>

          </div>
        </div>

        {/* Date */}
        <div className="text-[8px] text-gray-500 text-right">
          {item.createdAt &&
            new Date(item.createdAt).toLocaleString("en-NG", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true
            })
          }
        </div>

      </div>


      {/* =========================
          IMAGES
      ========================== */}

      {item.images?.length > 0 && (
        <div
          className={`mt-3 grid gap-2 ${
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
              className="overflow-hidden rounded-md"
            >
              <img
                src={image.imgUrl}
                alt={`${item.title || "Post"} - ${index + 1}`}
                className="w-full h-auto max-h-[400px] object-cover shadow-md"
                loading="lazy"
              />
            </div>
          ))}

        </div>
      )}


      {/* =========================
          CONTENT
      ========================== */}

      <p className="text-base md:text-lg mt-5 font-poppins font-normal text-slate-900 leading-relaxed whitespace-pre-line">
        {item.excerpt || "No content available."}
      </p>


      {/* =========================
          READ MORE
      ========================== */}

      <div className="mt-4 flex justify-end">


        <Link to={`/app/blog/one/${item._id}`}>
        <button
          onClick={() => setSelectedPost(item)}
          className="text-sm font-poppins font-semibold text-blue-700 hover:underline"
        >
          Read more
        </button>  
        </Link>

      </div>

    </motion.div>
  ))
}
        </div>
        </div>

        <div className="p-4 rounded-sm shadow-md text-2xl text-orange-700 font-bold">
            <p>Announcements For Everyone</p>
            {/*Arrays of ANnouncements --- last 5*/}
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