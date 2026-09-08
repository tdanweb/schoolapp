import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

// ─── TYPEWRITER HOOK ─────────────────────────────────────────
const useTypewriter = (text = "", speed = 40) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (!text) return;

    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayed, done };
};

// ─── TYPEWRITER TEXT ─────────────────────────────────────────
const TypewriterText = ({ text, speed = 40, className = "" }) => {
  const { displayed, done } = useTypewriter(text, speed);

  return (
    <span className={className}>
      {displayed}
      {/* blinking cursor */}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block w-[2px] h-[1em] bg-current align-middle ml-0.5"
        />
      )}
    </span>
  );
};

// ─── IMAGE SLIDER ─────────────────────────────────────────────
/**
 * Props:
 *  arr  — array of { image, heading, text, url, linkName }
 *  time — auto-advance interval in ms (default 6000)
 */
const ImageSlider = ({ arr = [], time = 6000 }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const timerRef = useRef(null);

  const len = arr.length;

  // ── auto-advance ──────────────────────────────────────────
  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % len);
    }, time);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [len, time]);

  // ── manual nav ────────────────────────────────────────────
  const goTo = (index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    startTimer(); // reset timer on manual nav
  };

  const prev = () => goTo((current - 1 + len) % len);
  const next = () => goTo((current + 1) % len);

  if (!arr.length) return null;

  const slide = arr[current];

  // ── framer variants ───────────────────────────────────────
  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <div className="relative w-full overflow-hidden shadow-2xl bg-[#0d1b4b] select-none">

      {/* ── Slide ── */}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full"
        >
          {/* Image */}
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
            <img
              src={slide.image}
              alt={slide.heading || "Slide image"}
              className="w-full h-full object-cover"
            />
            {/* dark gradient overlay so text is always readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b4b]/90 via-[#0d1b4b]/40 to-transparent" />
          </div>

          {/* ── Overlay Text ── */}
          <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-10 md:pb-14 pt-8 flex flex-col gap-3">

            {/* Heading — typewriter */}
            {slide.heading && (
              <motion.h2
                key={`h-${current}`}
                custom={0}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="font-serrat text-white font-bold leading-tight"
                style={{ fontSize: "clamp(22px, 4vw, 44px)" }}
              >
                <TypewriterText text={slide.heading} speed={45} />
              </motion.h2>
            )}

            {/* Body text — typewriter (slightly faster) */}
            {slide.text && (
              <motion.p
                key={`p-${current}`}
                custom={1}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="font-lato text-white/70 text-sm md:text-base leading-relaxed max-w-xl"
              >
                <TypewriterText text={slide.text} speed={25} />
              </motion.p>
            )}

            {/* CTA */}
            {slide.url && (
              <motion.div
                key={`cta-${current}`}
                custom={2}
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  to={slide.url}
                  className="inline-block font-poppins bg-[#C9A84C] text-[#0d1b4b] font-semibold text-sm px-7 py-3 hover:bg-[#e0c060] active:scale-95 transition-all duration-200"
                  style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
                >
                  {slide.linkName || "Learn More"}
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Prev / Next Arrows ── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-black/30 hover:bg-[#C9A84C] text-white hover:text-[#0d1b4b] rounded-full transition-all duration-200 backdrop-blur-sm"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-black/30 hover:bg-[#C9A84C] text-white hover:text-[#0d1b4b] rounded-full transition-all duration-200 backdrop-blur-sm"
      >
        ›
      </button>

      {/* ── Dot Indicators ── */}
      <div className="absolute bottom-3 right-6 flex gap-2 z-10">
        {arr.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className="transition-all duration-300"
          >
            <motion.div
              animate={{
                width: index === current ? 24 : 8,
                backgroundColor: index === current ? "#C9A84C" : "rgba(255,255,255,0.35)",
              }}
              transition={{ duration: 0.3 }}
              className="h-2 rounded-full"
            />
          </button>
        ))}
      </div>

      {/* ── Progress bar ── */}
      <motion.div
        key={`bar-${current}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: time / 1000, ease: "linear" }}
        className="absolute bottom-0 left-0 h-[3px] w-full bg-[#C9A84C] origin-left z-10"
      />
    </div>
  );
};

export { ImageSlider };

// {image: "", text: "", url: "", linkName: ""}