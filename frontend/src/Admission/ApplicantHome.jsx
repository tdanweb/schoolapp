import {
    FaBullhorn,
    FaCalendarAlt,
    FaChevronRight,
    FaInfoCircle
} from "react-icons/fa";


export default function ApplicantHome() {

    // Replace this with posts coming from your backend later
    const posts = [
        {
            id: 1,
            title: "Welcome to the Admission Portal",
            content:
                "Welcome to our admission portal. Applicants are advised to carefully complete their registration and regularly check this portal for important updates.",
            date: "24 Aug 2026",
            type: "General Notice"
        },

        {
            id: 2,
            title: "Entrance Examination Update",
            content:
                "Applicants who have completed their registration should regularly check the portal for information concerning the entrance examination.",
            date: "23 Aug 2026",
            type: "Examination"
        },

        {
            id: 3,
            title: "Application Registration",
            content:
                "Please ensure that all information supplied during registration is accurate before submitting your application.",
            date: "21 Aug 2026",
            type: "Admission"
        }
    ];


    return (
        <div className="space-y-6">


            {/* PAGE TITLE */}
            <div>


                <h2 className="text-2xl font-bold text-slate-800 mt-1">
                    What you need to know.
                </h2>

            </div>


            {/* IMPORTANT NOTICE */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4">

                <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <FaInfoCircle />
                </div>

                <div>

                    <p className="font-semibold text-blue-900">
                        Important
                    </p>

                    <p className="text-sm text-blue-800 mt-1">
                        Applicants are encouraged to check this page regularly
                        for new announcements and admission information.
                    </p>

                </div>

            </div>


            {/* POSTS */}
            <div className="space-y-4">

                {posts.map((post, index) => (

                    <article
                        key={post.id}
                        className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition"
                    >

                        {/* POST HEADER */}
                        <div className="p-5 md:p-6">

                            <div className="flex items-start justify-between gap-4">

                                <div className="flex gap-4">

                                    <div className="w-11 h-11 shrink-0 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                                        <FaBullhorn />
                                    </div>

                                    <div>

                                        <span className="inline-block text-[10px] uppercase tracking-wide font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded mb-2">
                                            {post.type}
                                        </span>

                                        <h3 className="font-bold text-lg text-slate-800">
                                            {post.title}
                                        </h3>

                                    </div>

                                </div>

                            </div>


                            <p className="text-sm leading-6 text-slate-600 mt-4">
                                {post.content}
                            </p>


                            {/* DATE */}
                            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">

                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <FaCalendarAlt />
                                    {post.date}
                                </div>

                                <button className="text-xs font-semibold text-sky-700 flex items-center gap-2 hover:text-sky-900">
                                    Read more
                                    <FaChevronRight size={9} />
                                </button>

                            </div>

                        </div>

                    </article>

                ))}

            </div>


            {/* EMPTY STATE */}
            {posts.length === 0 && (

                <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">

                    <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <FaBullhorn size={20} />
                    </div>

                    <h3 className="font-semibold text-slate-700 mt-4">
                        No updates yet
                    </h3>

                    <p className="text-sm text-slate-400 mt-1">
                        New announcements from the school will appear here.
                    </p>

                </div>

            )}

        </div>
    );
}