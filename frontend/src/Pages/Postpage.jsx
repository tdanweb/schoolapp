import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faNewspaper, faCalendarDays,  faUser,  faArrowRight, faArrowLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { mainApi } from "../api";
import axios from "axios";


export default function Posts({ }) {
    const [posts, setPosts] = useState([]);

    const [alertMsg, setAlertMsg] = useState("")
    const [search, setSearch] = useState("");
    const location = useLocation();

    // Check whether a particular post is currently being viewed
    const selectedPost = location.pathname !== "/app/blog";

    const filteredPosts = posts.filter((post) => {
        const value = search.toLowerCase();

        return (
            post.title?.toLowerCase().includes(value) ||
            post.type?.toLowerCase().includes(value) ||
            post.excerpt?.toLowerCase().includes(value)
        );
    });


    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };


    const formatType = (type) => {
        if (!type) return "Post";
        return type.charAt(0).toUpperCase() + type.slice(1);
    };



    async function getHomePosts(){
        try {
            const res = await axios.get(`${mainApi}/blog-posts?page=${1}`);
            console.log(res.data)
            setPosts(res.data.posts);
        } catch (error) {
            if(Error.response){
                alertMsg(error.response.data.msg);
                setAlertMsg(error.response.data.msg)
            } else{
                alert("Error")
                setAlertMsg("Network Error!")
            }
        }
    }


    useEffect(() => {
        getHomePosts();
    }, [])

    return (
        <div className="min-h-screen bg-slate-50">

            {/* PAGE HEADER */}
            <div className="bg-slate-800 text-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

                    <p className="text-sm text-slate-300 uppercase tracking-widest">
                        School Updates
                    </p>

                    <h1 className="text-3xl md:text-4xl font-bold mt-1">
                        Posts & News
                    </h1>

                    <p className="text-slate-300 mt-2 max-w-2xl">
                        Stay informed with the latest news, announcements,
                        events and activities from our school community.
                    </p>

                </div>
            </div>


            <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">

                {/* SEARCH */}
                <div className="relative mb-6">

                    <FontAwesomeIcon
                        icon={faSearch}
                        className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-slate-400
                        "
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search posts, news, announcements..."
                        className="
                            w-full
                            bg-white
                            border
                            border-slate-200
                            rounded-xl
                            py-4
                            pl-12
                            pr-4
                            text-slate-700
                            outline-none
                            shadow-sm
                            focus:border-slate-400
                            focus:ring-2
                            focus:ring-slate-200
                        "
                    />

                </div>


                {/* TWO COLUMN LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-[370px_1fr] gap-6">


                    {/* LEFT — POSTS LIST */}
                    <aside
                        className="
                            bg-white
                            rounded-2xl
                            border
                            border-slate-100
                            shadow-sm
                            overflow-hidden
                            h-fit
                            lg:sticky
                            lg:top-5
                        "
                    >

                        {/* LIST HEADER */}
                        <div className="px-5 py-4 border-b border-slate-100">

                            <div className="flex items-center justify-between">

                                <div>
                                    <h2 className="font-bold text-lg text-slate-800">
                                        Trending Topics
                                    </h2>

                                    <p className="text-xs text-slate-400 mt-1">
                                        Latest updates from the school
                                    </p>
                                </div>

                                <FontAwesomeIcon
                                    icon={faNewspaper}
                                    className="text-slate-300 text-xl"
                                />

                            </div>

                        </div>


                        {/* POSTS */}
                        <div className="divide-y divide-slate-100">

                            {filteredPosts.length === 0 ? (

                                <div className="p-8 text-center">

                                    <FontAwesomeIcon
                                        icon={faSearch}
                                        className="text-slate-300 text-2xl mb-3"
                                    />

                                    <p className="text-sm font-semibold text-slate-500">
                                        No posts found
                                    </p>

                                    <p className="text-xs text-slate-400 mt-1">
                                        Try another search term.
                                    </p>

                                </div>

                            ) : (

                                filteredPosts.map((post) => (

                                    <Link
                                        key={post._id}
                                        to={`/app/blog/one/${post._id}`}
                                        className="
                                            group
                                            block
                                            p-5
                                            hover:bg-slate-50
                                            transition
                                            duration-200
                                        "
                                    >

                                        {/* TYPE + DATE */}
                                        <div className="flex items-center gap-2 text-xs mb-2">

                                            <span
                                                className="
                                                    px-2
                                                    py-1
                                                    rounded-full
                                                    bg-slate-100
                                                    text-slate-600
                                                    font-semibold
                                                "
                                            >
                                                {formatType(post.type)}
                                            </span>

                                            <span className="text-slate-300">
                                                •
                                            </span>

                                            <span className="text-slate-400">
                                                {formatDate(post.createdAt)}
                                            </span>

                                        </div>


                                        {/* TITLE */}
                                        <h3
                                            className="
                                                font-bold
                                                text-slate-800
                                                leading-snug
                                                group-hover:text-slate-950
                                            "
                                        >
                                            {post.title}
                                        </h3>


                                        {/* EXCERPT */}
                                        <p
                                            className="
                                                text-sm
                                                text-slate-500
                                                leading-relaxed
                                                mt-2
                                                line-clamp-3
                                            "
                                        >
                                            {post.excerpt}
                                        </p>


                                        {/* READ */}
                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                mt-3
                                                text-xs
                                                font-semibold
                                                text-slate-400
                                                group-hover:text-slate-700
                                            "
                                        >

                                            <span>
                                                Read post
                                            </span>

                                            <FontAwesomeIcon
                                                icon={faChevronRight}
                                                className="
                                                    group-hover:translate-x-1
                                                    transition-transform
                                                "
                                            />

                                        </div>

                                    </Link>

                                ))

                            )}

                        </div>
                    </aside>


                    {/* RIGHT — POST VIEWPORT */}
                    <section
                        className="
                            bg-white
                            rounded-2xl
                            border
                            border-slate-100
                            shadow-sm
                            overflow-hidden
                            min-h-[500px]
                        "
                    >

                        {selectedPost ? (

                            /*
                             * Child route renders here.
                             *
                             * /app/posts/:postId
                             */
                            <Outlet />

                        ) : (

                            /* DEFAULT /app/posts VIEW */
                            <div
                                className="
                                    min-h-[500px]
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    text-center
                                    px-8
                                "
                            >

                                <div
                                    className="
                                        w-20
                                        h-20
                                        rounded-full
                                        bg-slate-100
                                        flex
                                        items-center
                                        justify-center
                                        mb-5
                                    "
                                >

                                    <FontAwesomeIcon
                                        icon={faNewspaper}
                                        className="
                                            text-3xl
                                            text-slate-400
                                        "
                                    />

                                </div>


                                <h2
                                    className="
                                        text-xl
                                        md:text-2xl
                                        font-bold
                                        text-slate-700
                                    "
                                >
                                    Explore Our Latest Updates
                                </h2>


                                <p
                                    className="
                                        text-slate-400
                                        max-w-md
                                        mt-2
                                        leading-relaxed
                                    "
                                >
                                    Select a post from the list to read the
                                    full story, announcement or school update.
                                </p>

                            </div>

                        )}

                    </section>

                </div>


                {/* OTHER SECTIONS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

                    <PostCategory
                        title="Latest Posts"
                        posts={posts.slice(0, 5)}
                        formatDate={formatDate}
                    />

                    <PostCategory
                        title="School Updates"
                        posts={posts.slice(5, 10)}
                        formatDate={formatDate}
                    />

                </div>

            </main>

        </div>
    );
}



function PostCategory({ title, posts, formatDate }) {

    return (
        <div
            className="
                bg-white
                rounded-2xl
                border
                border-slate-100
                shadow-sm
                overflow-hidden
            "
        >

            <div className="px-5 py-4 border-b border-slate-100">

                <h2 className="font-bold text-lg text-slate-800">
                    {title}
                </h2>

            </div>


            <div className="divide-y divide-slate-100">

                {posts.map((post) => (

                    <Link
                        key={post._id}
                        to={`/app/posts/${post._id}`}
                        className="
                            flex
                            items-center
                            justify-between
                            gap-4
                            p-4
                            hover:bg-slate-50
                            transition
                        "
                    >

                        <div className="min-w-0">

                            <h3
                                className="
                                    font-semibold
                                    text-sm
                                    text-slate-700
                                    truncate
                                "
                            >
                                {post.title}
                            </h3>

                            <p className="text-xs text-slate-400 mt-1">
                                {formatDate(post.createdAt)}
                            </p>

                        </div>


                        <FontAwesomeIcon
                            icon={faArrowRight}
                            className="text-slate-300"
                        />

                    </Link>

                ))}

            </div>

        </div>
    );
}


function SinglePost({ }) {

    const { id } = useParams();

    const [alertMsg, setAlertMsg] = useState("")
    const [post, setPost] = useState(null);
   /*
    const post = posts.find(
        (item) => item._id === postId
    ); 
    */

    async function getOnePost(){
        try {
            const res = await axios.get(`${mainApi}/blog-posts/${id}`);
            setPost(res.data.post);
            setAlertMsg(res.data.msg)
        } catch (error) {
            if(error.response){
                setAlertMsg(error.response.data.msg);
            } else {
                setAlertMsg("Network Error, Cannot Get Post Details...");
            }
            setAlertMsg("Error fetching post");
        }
    }

    useEffect(() => {
        getOnePost();
    }, [])
    if (!post) {
        return (
            <div className="min-h-[500px] flex items-center justify-center p-8">
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
                <div className="text-center">

                    <h2 className="text-xl font-bold text-slate-700">
                        Post Not Found
                    </h2>

                    <p className="text-slate-400 mt-2">
                        The post you're looking for could not be found.
                    </p>

                    <Link
                        to="/app/blog"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            mt-5
                            px-4
                            py-2
                            rounded-lg
                            bg-slate-800
                            text-white
                            text-sm
                            font-semibold
                        "
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Back to Posts
                    </Link>

                </div>

            </div>
        );
    }


    const date = new Date(post.createdAt).toLocaleDateString(
        "en-US",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    );


    return (
        <article>

            {/* IMAGE */}
            {post.images?.length > 0 && (

                <div className="w-full bg-slate-100">

                    <img
                        src={post.images[0].imgUrl}
                        alt={post.title}
                        className="
                            w-full
                            max-h-[420px]
                            object-cover
                        "
                    />

                </div>

            )}


            <div className="p-6 md:p-10">


                {/* TYPE */}
                <span
                    className="
                        inline-flex
                        px-3
                        py-1
                        rounded-full
                        bg-slate-100
                        text-slate-600
                        text-xs
                        font-bold
                        uppercase
                        tracking-wide
                    "
                >
                    {post.type}
                </span>


                {/* TITLE */}
                <h1
                    className="
                        text-2xl
                        md:text-4xl
                        font-bold
                        text-slate-800
                        leading-tight
                        mt-4
                    "
                >
                    {post.title}
                </h1>


                {/* META */}
                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        gap-4
                        mt-5
                        pb-5
                        border-b
                        border-slate-100
                        text-sm
                        text-slate-400
                    "
                >

                    <span className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendarDays} />
                        {date}
                    </span>


                    <span className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faUser} />
                        {post.posterName || "Unknown"}
                    </span>

                </div>


                {/* EXCERPT */}
                {post.excerpt && (

                    <p
                        className="
                            mt-6
                            text-lg
                            font-medium
                            text-slate-600
                            leading-relaxed
                        "
                    >
                        {post.excerpt}
                    </p>

                )}


                {/* CONTENT */}
                <div
                    className="
                        mt-6
                        text-slate-700
                        leading-8
                        text-base
                        md:text-lg
                    "
                >

                    {/* 
                        Replace this with post.body/content
                        when your backend returns the complete post.
                    */}

                    <p>
                        {post.content || post.body || post.excerpt}
                    </p>

                </div>

            </div>

        </article>
    );
}

export { SinglePost };