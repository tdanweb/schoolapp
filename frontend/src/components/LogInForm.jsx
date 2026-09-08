import React, { useState } from "react";
import {motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
 FaEye,
 FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaPhone, FaTimes,
  FaLock,
  FaIdCard,
} from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";




const Input = ({title, icon, type, click, val, ...props}) => {

    return <div className="my-1 w-full">
        <div className="font-bold text-sm text-slate-600 my-1 md:text-md font-lato">{title}</div>
        <div className="relative py-2">
            <FontAwesomeIcon className="absolute top-1/3 left-1 font-bold text-lg text-sky-900" icon={icon}/>
            <input type={type} placeholder={title} onChange={click} value={val} {...props}
             className="p-2 pl-7 w-full border border-slate-200 rounded-md focus:outline-none "
            />
        </div>
    </div>
}

export {Input}


function PopUp({ message, close, zed = 60, showClose = false }) {
  return (
    <AnimatePresence>
      <div
        className={`fixed inset-0 z-${ '50' || zed} min-h-screen bg-slate-950/40 backdrop-blur-[3px] flex items-center justify-center p-4`}
        onClick={close}
      >
        <motion.div
          initial={{ y: 45, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.96 }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800"
        >
          {showClose && close && (
            <button
              type="button"
              onClick={close}
              className="absolute top-3 right-3 z-60 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 transition"
              aria-label="Close popup"
            >
              <FaTimes size={16} />
            </button>
          )}

          {message}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


export function AlertMessage({msg, click, zed = 60}){

  return (
        <div className={`fixed inset-0 z-[${ zed || 60 }] flex items-center justify-center bg-black/50 px-4`}>
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">

            <button
              onClick={click}
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
              {msg}
            </p>

          </div>
        </div>
      )
}
export { PopUp };