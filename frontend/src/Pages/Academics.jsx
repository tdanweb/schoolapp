
import {
    GraduationCap,
    BookOpen,
    School,
    Award,
    Globe2,
    Languages,
    FlaskConical,
    Trophy,
    Palette,
    Laptop,
    Users,
    Target,
} from "lucide-react";


export default function Academics() {
    const schoolSections = [
        {
            title: "Early Years",
            subtitle: "Preschool",
            description:
                "A nurturing foundation where children develop confidence, communication, creativity, social skills and a love for learning.",
            classes: [
                "Creche",
                "Pre-Nursery",
                "Nursery 1",
                "Nursery 2",
            ],
            icon: <School />,
        },

        {
            title: "Primary School",
            subtitle: "Basic Education",
            description:
                "A strong academic foundation combining literacy, numeracy, critical thinking, character development and practical learning.",
            classes: [
                "Primary 1",
                "Primary 2",
                "Primary 3",
                "Primary 4",
                "Primary 5",
                "Primary 6",
            ],
            icon: <BookOpen />,
        },

        {
            title: "Junior Secondary",
            subtitle: "JSS",
            description:
                "Students build deeper knowledge across the sciences, humanities, technology and creative disciplines while developing independent learning skills.",
            classes: [
                "JSS 1",
                "JSS 2",
                "JSS 3",
            ],
            icon: <GraduationCap />,
        },

        {
            title: "Senior Secondary",
            subtitle: "SSS",
            description:
                "A comprehensive senior secondary programme preparing students for higher education, professional pathways and internationally recognised examinations.",
            classes: [
                "SS 1",
                "SS 2",
                "SS 3",
            ],
            icon: <Award />,
        },

        {
            title: "Cambridge Pathway",
            subtitle: "International Programme",
            description:
                "An internationally focused pathway designed for students pursuing Cambridge qualifications and broader global educational opportunities.",
            classes: [
                "Cambridge Lower Secondary",
                "IGCSE",
                "Cambridge AS Level",
                "Cambridge A Level",
            ],
            icon: <Globe2 />,
        },

        {
            title: "Advanced Levels",
            subtitle: "Post-Secondary Preparation",
            description:
                "Advanced academic preparation for students seeking stronger preparation for university admission and specialised fields of study.",
            classes: [
                "A Level Programmes",
                "Advanced Subject Studies",
                "University Preparation",
            ],
            icon: <Target />,
        },
    ];


    const curricula = [
        {
            title: "Montessori",
            description:
                "Child-centred learning that encourages independence, practical skills, exploration and self-directed development.",
            icon: <School />,
        },
        {
            title: "Nigerian Curriculum",
            description:
                "A structured curriculum aligned with national educational standards and requirements.",
            icon: <BookOpen />,
        },
        {
            title: "WAEC",
            description:
                "Preparation for the West African Senior School Certificate Examination and related academic requirements.",
            icon: <Award />,
        },
        {
            title: "NECO",
            description:
                "Preparation for the National Examinations Council senior secondary examination pathway.",
            icon: <GraduationCap />,
        },
        {
            title: "Cambridge",
            description:
                "International Cambridge programmes including IGCSE, AS and A Level pathways.",
            icon: <Globe2 />,
        },
        {
            title: "Combined Pathway",
            description:
                "A carefully integrated academic approach allowing students to benefit from both Nigerian and international examination pathways.",
            icon: <Languages />,
        },
    ];


    const enrichment = [
        {
            title: "STEM & Innovation",
            text: "Science, technology, engineering, mathematics and practical innovation activities.",
            icon: <FlaskConical />,
        },
        {
            title: "ICT & Digital Skills",
            text: "Technology literacy, computing and practical digital skills for the modern world.",
            icon: <Laptop />,
        },
        {
            title: "Arts & Creativity",
            text: "Creative expression through visual arts, music, drama and related activities.",
            icon: <Palette />,
        },
        {
            title: "Clubs & Competitions",
            text: "Academic clubs, debates, quizzes, competitions and collaborative activities.",
            icon: <Trophy />,
        },
        {
            title: "Leadership Development",
            text: "Opportunities that develop responsibility, communication, teamwork and leadership.",
            icon: <Users />,
        },
    ];


    return (
        <main className="w-full bg-slate-50">

            {/* HERO */}
            <section className="relative overflow-hidden">

                <img
                    src="/students.jpg"
                    alt="Students"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-slate-950/75" />

                <div className="relative mx-auto flex min-h-[420px] max-w-7xl items-center px-5 py-16 sm:px-8">

                    <div className="max-w-3xl text-white">

                        {/* Crest */}
                        <div className="mb-7 flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2 shadow-lg">
                                <img
                                    src="/crest.png"
                                    alt="School Crest"
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-300">
                                    Academic Excellence
                                </p>
                                <p className="mt-1 text-sm text-slate-200">
                                    Learning • Character • Excellence
                                </p>
                            </div>
                        </div>


                        <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                            Academics
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                            We provide a broad and purposeful academic experience
                            designed to guide every learner from the early years
                            through secondary education and advanced international
                            pathways.
                        </p>

                    </div>

                </div>
            </section>


            {/* INTRO */}
            <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">

                <div className="max-w-3xl">
                    <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
                        Our Academic Structure
                    </p>

                    <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                        A pathway for every stage of learning
                    </h2>

                    <p className="mt-4 text-base leading-7 text-slate-600">
                        From preschool to advanced levels, our academic structure
                        combines strong foundational education with opportunities
                        for specialisation, international qualifications and
                        preparation for higher education.
                    </p>
                </div>


                {/* SCHOOL SECTIONS */}
                <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                    {schoolSections.map((section) => (
                        <div
                            key={section.title}
                            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >

                            <div className="flex items-start justify-between">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-yellow-400">
                                    {section.icon}
                                </div>

                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                                    {section.subtitle}
                                </span>

                            </div>

                            <h3 className="mt-5 text-xl font-bold text-slate-900">
                                {section.title}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                {section.description}
                            </p>


                            <div className="mt-5 flex flex-wrap gap-2">

                                {section.classes.map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700"
                                    >
                                        {item}
                                    </span>
                                ))}

                            </div>

                        </div>
                    ))}

                </div>

            </section>


            {/* CURRICULUM */}
            <section className="bg-white">

                <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">

                    <div className="max-w-3xl">
                        <p className="text-sm font-bold uppercase tracking-widest text-yellow-600">
                            Curriculum & Examination
                        </p>

                        <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
                            Multiple pathways, one standard of excellence
                        </h2>

                        <p className="mt-4 text-base leading-7 text-slate-600">
                            Our academic programmes incorporate different
                            curriculum approaches and examination pathways to
                            provide students with flexible opportunities for
                            local and international progression.
                        </p>
                    </div>


                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                        {curricula.map((item) => (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-slate-200 p-6"
                            >

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
                                    {item.icon}
                                </div>

                                <h3 className="mt-5 font-bold text-slate-900">
                                    {item.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {item.description}
                                </p>

                            </div>
                        ))}

                    </div>

                </div>

            </section>


            {/* ENRICHMENT */}
            <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">

                <div className="rounded-3xl bg-slate-900 p-7 text-white sm:p-10">

                    <div className="max-w-2xl">
                        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
                            Beyond the Classroom
                        </p>

                        <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                            Developing the whole learner
                        </h2>

                        <p className="mt-4 text-sm leading-6 text-slate-300">
                            Academic success is strengthened by creativity,
                            practical skills, collaboration, leadership and
                            opportunities to discover individual talents.
                        </p>
                    </div>


                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                        {enrichment.map((item) => (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-white/10 bg-white/5 p-5"
                            >

                                <div className="text-yellow-400">
                                    {item.icon}
                                </div>

                                <h3 className="mt-4 text-sm font-bold">
                                    {item.title}
                                </h3>

                                <p className="mt-2 text-xs leading-5 text-slate-300">
                                    {item.text}
                                </p>

                            </div>
                        ))}

                    </div>

                </div>

            </section>

        </main>
    );
}