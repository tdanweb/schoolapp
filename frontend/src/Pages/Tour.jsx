import React from "react";
import { motion } from "framer-motion";
import {
  FaFlask,
  FaBookOpen,
  FaChalkboardTeacher,
  FaFutbol,
  FaSchool,
  FaLaptop,
  FaMusic,
  FaUtensils,
  FaArrowDown,
  FaMapMarkedAlt,
} from "react-icons/fa";

export default function TourSchool() {
  const tourLinks = [
    {
      id: "classrooms",
      title: "Classrooms",
      icon: <FaChalkboardTeacher />,
    },
    {
      id: "laboratory",
      title: "Laboratory",
      icon: <FaFlask />,
    },
    {
      id: "library",
      title: "Library",
      icon: <FaBookOpen />,
    },
    {
      id: "ict",
      title: "ICT Centre",
      icon: <FaLaptop />,
    },
    {
      id: "sports",
      title: "Sports",
      icon: <FaFutbol />,
    },
    {
      id: "auditorium",
      title: "Auditorium",
      icon: <FaMusic />,
    },
    {
      id: "cafeteria",
      title: "Cafeteria",
      icon: <FaUtensils />,
    },
    {
      id: "campus",
      title: "Campus",
      icon: <FaSchool />,
    },
  ];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sections = [
    {
      id: "classrooms",
      title: "Modern Classrooms",
      description:
        "Our classrooms provide a welcoming and stimulating environment where students can learn, collaborate and develop their academic potential.",
      image: "/classroom1.jpg",
    },
    {
      id: "laboratory",
      title: "Science Laboratory",
      description:
        "Our well-equipped laboratory provides students with practical experiences that complement classroom learning and encourage scientific curiosity.",
      image: "/science-lab.jpg",
    },
    {
      id: "library",
      title: "School Library",
      description:
        "A quiet and resourceful space where students can read, research, study and develop a lasting love for learning.",
      image: "/images/tour/library.jpg",
    },
    {
      id: "ict",
      title: "ICT Centre",
      description:
        "Students have access to modern computing facilities designed to develop digital literacy, creativity and technological competence.",
      image: "/computer-lab.jpg",
    },
    {
      id: "sports",
      title: "Sports & Recreation",
      description:
        "Our sporting facilities provide opportunities for students to stay active, develop teamwork and discover their talents beyond the classroom.",
      image: "/sport.jpg",
    },
    {
      id: "auditorium",
      title: "School Auditorium",
      description:
        "A multipurpose space for assemblies, presentations, cultural activities, competitions and other important school events.",
      image: "/school-hall.jpg",
    },
    {
      id: "cafeteria",
      title: "Cafeteria",
      description:
        "Our cafeteria provides a comfortable environment where students can enjoy meals and interact with one another.",
      image: "/images/tour/cafeteria.jpg",
    },
    {
      id: "campus",
      title: "Our Campus",
      description:
        "Explore our beautiful campus designed to provide a safe, inspiring and supportive environment for every learner.",
      image: "/school-drone-view.jpg",
    },
  ];

  return (
    <main className="bg-white text-slate-900">

      {/* =====================================================
          HERO / VIDEO
      ====================================================== */}

      <section className="relative h-[75vh] min-h-[520px] w-full overflow-hidden">

        {/* Background Video */}

        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          {/* Replace this with your actual video */}
          <source
            src="/videos/school-tour.mp4"
            type="video/mp4"
          />

          Your browser does not support video playback.
        </video>

        {/* Gradient Overlay */}

        <div className="absolute inset-0 bg-gradient-to-b from-[#061936]/80 via-[#071b41]/55 to-[#061936]" />

        {/* Additional subtle gradient */}

        <div className="absolute inset-0 bg-gradient-to-r from-[#061936]/80 via-transparent to-[#061936]/40" />

        {/* Hero Content */}

        <div className="relative z-10 flex h-full items-center justify-center px-5 text-center">

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="max-w-3xl"
          >

            {/* Small label */}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15,
                duration: 0.6,
              }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md"
            >
              <FaMapMarkedAlt className="text-[#e2b52b]" />

              Explore Our Campus
            </motion.div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Tour Our Campus
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base md:text-lg">
              Take a virtual journey through our learning spaces,
              facilities and vibrant school environment.
            </p>

            {/* CTA */}

            <motion.button
              type="button"
              onClick={() =>
                scrollToSection("tour-navigation")
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#d6a928] px-6 py-3 text-sm font-bold text-[#071b41] shadow-lg shadow-black/20 transition hover:bg-[#edc44d]"
            >
              Start Exploring

              <FaArrowDown />
            </motion.button>

          </motion.div>
        </div>

      </section>


      {/* =====================================================
          TOUR NAVIGATION
      ====================================================== */}

      <section
        id="tour-navigation"
        className="relative z-20 -mt-10 px-4"
      >

        <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">

          <div className="flex flex-wrap justify-center gap-2">

            {tourLinks.map((link, index) => (
              <motion.button
                key={link.id}
                type="button"
                onClick={() =>
                  scrollToSection(link.id)
                }
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.05,
                }}
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                className="group inline-flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold text-slate-600 transition hover:bg-[#071b41] hover:text-white sm:text-sm"
              >
                <span className="text-[#d6a928] transition group-hover:text-[#f0ca55]">
                  {link.icon}
                </span>

                {link.title}
              </motion.button>
            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          INTRODUCTION
      ====================================================== */}

      <section className="px-5 py-20 sm:py-24">

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.7,
          }}
          className="mx-auto max-w-3xl text-center"
        >

          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#d6a928]">
            Discover Achievers
          </span>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#071b41] sm:text-4xl">
            More Than Just a School
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
            At Achiever's International Academy, every space
            is intentionally designed to inspire learning,
            creativity, discipline and excellence.
          </p>

        </motion.div>

      </section>


      {/* =====================================================
          TOUR SECTIONS
      ====================================================== */}

      <div className="space-y-0">

        {sections.map((section, index) => {

          const reverse = index % 2 !== 0;

          return (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: 0.7,
              }}
              className="scroll-mt-24 border-t border-slate-100"
            >

              <div
                className={`mx-auto grid max-w-7xl items-center lg:grid-cols-2 ${
                  reverse
                    ? "lg:[&>*:first-child]:order-2"
                    : ""
                }`}
              >

                {/* IMAGE */}

                <div className="relative h-[320px] overflow-hidden sm:h-[420px] lg:h-[520px]">

                  <motion.img
                    src={section.image}
                    alt={section.title}
                    loading="lazy"
                    whileHover={{
                      scale: 1.04,
                    }}
                    transition={{
                      duration: 0.6,
                    }}
                    className="h-full w-full object-cover"
                  />

                  {/* Image overlay */}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#071b41]/50 via-transparent to-transparent" />

                  {/* Section number */}

                  <div className="absolute bottom-6 left-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-sm font-black text-[#071b41] shadow-lg backdrop-blur-sm">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                </div>


                {/* CONTENT */}

                <div className="px-6 py-14 sm:px-10 lg:px-16 lg:py-20">

                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#d6a928]">
                    Campus Facility
                  </span>

                  <h2 className="mt-3 text-3xl font-black tracking-tight text-[#071b41] sm:text-4xl">
                    {section.title}
                  </h2>

                  <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                    {section.description}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      scrollToSection("tour-navigation")
                    }
                    className="mt-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#071b41] transition hover:text-[#d6a928]"
                  >
                    Explore another area

                    <FaArrowDown className="rotate-[-90deg]" />
                  </button>

                </div>

              </div>

            </motion.section>
          );
        })}

      </div>


      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#071b41] px-5 py-20 text-center sm:py-24">

        <div className="absolute inset-0 bg-gradient-to-br from-[#123b7a] via-[#071b41] to-[#06132e]" />

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
          className="relative z-10 mx-auto max-w-2xl"
        >

          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#f0ca55]">
            Come Experience It
          </span>

          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            We'd Love to Welcome You
          </h2>

          <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
            A virtual tour is just the beginning. Come visit
            our campus and experience the Achiever's
            difference for yourself.
          </p>

          <button
            type="button"
            className="mt-7 rounded-full bg-[#d6a928] px-7 py-3 text-sm font-bold text-[#071b41] transition hover:bg-[#f0ca55]"
          >
            Contact the School
          </button>

        </motion.div>

      </section>

    </main>
  );
}