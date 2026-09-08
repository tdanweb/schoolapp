import axios from "axios";
import { useState, useEffect } from "react";
import { mainApi } from "../../api";
import { motion } from "framer-motion";
import { FaToggleOn, FaToggleOff, FaSave, FaUpload, FaPlusCircle } from "react-icons/fa";
import { session, terms } from "../../staticFiles";
import { Input, Select } from "../StudentResgistration";
import { Link } from "react-router-dom";
const par = "text-md font-bold font-lato text-slate-800"
const inp = "p-2 shadow-lg rounded-md focus:outline-none border border-slate-400"
import HomePagePoster from "../Poster";

const term_api = `${mainApi}/setting-term`;
const initialAdmissionSettings = {
    admissionStatus: "closed", // ongoing, closed, awaiting-result, awaiting-exam
    examinationDate: "", //string
    applicationFee: 10000, //number
    notes: "",
    deadline: "", // date
    session: "" //this session
}

const basicSettings = {
    registrationIsOpened: false,
    resultsUploading: false,
    resultsViewing: false,
    admissionPortal: false,
    feeManaging: false,
    termResultsPublished: false,
    attendanceMarking: false,
    schoolIsOn: false,
    currentTerm: "",
    schoolWeek: "NIL",
    currentSession: "",
// {text, poster, attachedPhoto: []}
};

export default function ChiefSettingUI() {
    const userAdmin = true;

    if(!userAdmin){
        return <div>Only Admin can Access this Link</div>
    }

    const api = `${mainApi}/setting`;
    const api4Admission = `${mainApi}/setting/admission`

    const pages = ["Page 1", "Page 2"];
    const [page, setPage] = useState("Page 1");

    const [setting, setSetting] = useState(basicSettings);
    const [alertMsg, setAlertMsg] = useState("")
    const [allTerms,setAllTerms] = useState(null)
    const [thisTerm, setThisTerm] = useState(null);
    const [admissionSetting, setAdmissionSetting] = useState(initialAdmissionSettings);

    const [loading, setLoading] = useState(false);

    // POST inputs


    useEffect(() => {
        async function getSettings() {
            const api = `${mainApi}/setting`;
            try {
                const res = await axios.get(api);
                if (res?.data) {
                  const st = res.data.settings.setUps || basicSettings;

                  st.termResultsPublished = res.data.termSetting?.resultsPublished || false;
                  setSetting(st);
                //  setSetting({...setting, resultsPublished: res.data.termSetting?.resultsPublished});
                 
                setThisTerm(res.data.termSetting)
              //  setSetting({...setting, termResultsPublished: res.data.termSetting.resultsPublished}); 
                setAllTerms(res.data.terms);
                }

                const admSettings = await axios.get(`${mainApi}/settings/admission`);
                setAlertMsg(admSettings.data.msg)
                if(admSettings?.data) setAdmissionSetting(admSettings.data.settings);
            } catch (err) {
                if(err.response){
                    setAlertMsg(err.response.data.msg)
              } else{
                setAlertMsg("Network Connectivity Error!!")
            }

            }
        }
        getSettings();
    }, []);

    const toggleField = (field) => {
        setSetting((prev) => ({
            ...prev,
            [field]: !prev[field]
        }));
    };


    const [adminToken, setAdminToken] = useState("");
    const handleSubmit = async () => {
        setLoading(true);
      //  console.log(setting);

        try {
            const res = await axios.put(`${mainApi}/setting`, 
                { setting,
                  currentTerm: setting.currentTerm,
                  currentSession: setting.currentSession,
                  adminToken // request admin token while changing term and session
                } );

            
            setAlertMsg("Settings updated successfully!");
            setAlertMsg(res.data.msg);
        } catch (err) {
            if(err.response){
                setAlertMsg(err.response.msg)
            } else {
            setAlertMsg("Update failed || Network Error..");
            }
        } finally {
            setLoading(false);
        }
    };



    const Toggle = ({ value, onClick }) => (
        <motion.div
            
            onClick={onClick}
            whileTap={{ scale: 0.9 }}
            style={{ cursor: "pointer", fontSize: "2rem" }}
        >
            {value ? (
                <FaToggleOn color="green" />
            ) : (
                <FaToggleOff color="gray" />
            )}
        </motion.div>
    );

    const [open, setOpen] = useState(false);
    const [newTerm, setNewTerm] = useState({
        termName: "",
        session: "",
        termlyBreak: "",
        notes: "",
        noOfWeeks: 11,
        holidays: [], //name: "",   date: ""//date
        calendar: [], //title, date, order: 1, 2 ,3 ...
        nextTerm: "",
        startDate: "", endDate: "" //dates
    })
 
    const [hol, setHol] = useState({name: "", date:""});

    const addHoliday = () => {
        if(!hol.name.trim()) return;
        setNewTerm(prev => ({...prev, 
            holidays: [...prev.holidays, hol ]}))
    }
    //calendar
    const [cal, setCal] = useState({title: "", date:"", order: 0})
    const addCalendar = () => {
        if(!cal.title.trim()) return;
        setNewTerm(prev => ({...prev, 
            calendar: [...prev.calendar, cal ]}))
    };

    async function AddTerm(){
        try {
           // return console.log(newTerm);

            const res = await axios.post(term_api, newTerm);
            console.log(res.data);
            setAlertMsg(res.data.msg)
            setAllTerms(prev => [...prev, res.data.term])
        } catch (err) {
            console.log(err);
            if(err.response){
              setAlertMsg(err.response.data.msg)
            } else{
              setAlertMsg("Network Error")
            }
        }
    };


    //admission settings
    async function submitAdmSetting(){
        try {
            const res = await axios.put(api4Admission, {
                setting: admissionSetting
            });

            setAlertMsg(res.data.msg);
        } catch (error) {
            if(error.response){
                setAlertMsg(error.response.data.msg)
            } else{
                setAlertMsg("Network Connectivity Error!!")
            }
        }
    }

    //to switch term and session is a big deal
    const [holdTerm, setHoldTerm] = useState(true);
    const fixTerm = (e) => {
        const val = e.target.value;
        const i = allTerms.findIndex(k => k._id === val);
        if(i < 0) return alert("Do pick avalid Term/Session")
        
        setSetting({...setting, currentSession: allTerms[i].session});
        setSetting({...setting, currentTerm: allTerms[i].termName});
    }

    const aStyle = "p-1 text-[9pt] font-poppins bg-gray-700 text-amber-200 rounded-md"
// Define common input styling for consistency across form controls
    const inputClass = "w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition";
    const selectClass = "w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition";


    // [========= Home Update Posting ====================]
    
        return (
        <div className="p-4">

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
            {!open && 
                <div>   
                    {/*Overlay Here! */}
                    <div className="p-4 bg-slate-100 rounded-lg shadow-lg mb-6">
                      <p className="text-[9pt] font-poppins text-teal-700 p-1 bg-teal-100 rounded-md font-bold w-fit">Complete all settings on this page to keep site smoothly running</p>
                        <nav className="flex flex-row gap-5 items-center mt-2"> 
                            <a className={aStyle} href="#term-setup">Add Term</a>
                            <a className={aStyle} href="#general-setup">General Settings</a>
                            <a className={aStyle} href="#admission-setup">Admission</a>
                        </nav>
                    </div>


  <motion.div
    id="term-setup"
    className="max-w-4xl mx-auto p-6 md:p-8 bg-white border border-slate-200 rounded-2xl shadow-xl space-y-6"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    {/* Section Header */}
    <div className="pb-3 border-b border-slate-200">
      <h3 className="font-bold text-xl text-slate-800 tracking-tight">
        ADD NEW TERM
      </h3>
      <p className="text-xs text-slate-500 mt-1">
        Configure academic sessions, term dates, and calendar events
      </p>
    </div>

    <div className="space-y-6">
      {/* Session & Term Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ItemHolder
          label="Session"
          value={
            <select
              className={inputClass}
              value={newTerm.session}
              onChange={(e) =>
                setNewTerm({ ...newTerm, session: e.target.value })
              }
            >
              <option value="">-- Select Session --</option>
              {session.map((sess, idx) => (
                <option key={idx} value={sess}>
                  {sess}
                </option>
              ))}
            </select>
          }
        />

        <ItemHolder
          label="Select Term"
          value={
            <select
              className={inputClass}
              value={newTerm.termName}
              onChange={(e) =>
                setNewTerm({ ...newTerm, termName: e.target.value })
              }
            >
              <option value="">-- Select Term --</option>
              {terms.map((t, idx) => (
                <option key={idx} value={t}>
                  {t}
                </option>
              ))}
            </select>
          }
        />
      </div>

      {/* Date Setup Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ItemHolder
          label="Term Starts"
          value={
            <input
              type="date"
              onChange={(e) =>
                setNewTerm({ ...newTerm, startDate: e.target.value })
              }
              className={inputClass}
            />
          }
        />
        <ItemHolder
          label="Term Ends"
          value={
            <input
              type="date"
              onChange={(e) =>
                setNewTerm({ ...newTerm, endDate: e.target.value })
              }
              className={inputClass}
            />
          }
        />
        <ItemHolder
          label="Next Term Starts"
          value={
            <input
              type="date"
              onChange={(e) =>
                setNewTerm({ ...newTerm, nextTerm: e.target.value })
              }
              className={inputClass}
            />
          }
        />
      </div>

      {/* Break & Weeks Config */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ItemHolder
          label="Set Mid-Term Break"
          value={
            <input
              type="text"
              placeholder="e.g. Oct 24 - Oct 28"
              className={inputClass}
              value={newTerm.termlyBreak}
              onChange={(e) =>
                setNewTerm({ ...newTerm, termlyBreak: e.target.value })
              }
            />
          }
        />

        <ItemHolder
          label="Set No. Of Weeks"
          value={
            <input
              type="number"
              min="1"
              value={newTerm.noOfWeeks}
              className={inputClass}
              onChange={(e) =>
                setNewTerm({
                  ...newTerm,
                  noOfWeeks:
                    parseInt(e.target.value) >= 1
                      ? parseInt(e.target.value)
                      : 1,
                })
              }
            />
          }
        />
      </div>

      {/* Notes Area */}
      <ItemHolder
        label="Term Notes & Details"
        value={
          <textarea
            rows="3"
            placeholder="Add specific instructions or notes for this term..."
            className={inputClass}
            value={newTerm.notes}
            onChange={(e) =>
              setNewTerm({ ...newTerm, notes: e.target.value })
            }
          />
        }
      />

      <hr className="border-slate-200" />

      {/* Holidays Management */}
      <div className="space-y-3">
        {newTerm.holidays.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Added Holidays
            </span>
            {newTerm.holidays.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm font-medium"
              >
                <span className="text-amber-900 font-semibold">{h.name}</span>
                <span className="text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md text-xs">
                  {h.date}
                </span>
              </div>
            ))}
          </div>
        )}

        <ItemHolder
          label="Add Holiday Dates Within The Term"
          value={
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <input
                type="text"
                placeholder="Holiday Name"
                value={hol.name}
                onChange={(e) => setHol({ ...hol, name: e.target.value })}
                className={inputClass}
              />
              <input
                type="date"
                value={hol.date}
                onChange={(e) => setHol({ ...hol, date: e.target.value })}
                className={inputClass}
              />
              <button
                type="button"
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium transition cursor-pointer"
                onClick={addHoliday}
              >
                Add Holiday
              </button>
            </div>
          }
        />
      </div>

      <hr className="border-slate-200" />

      {/* Calendar Events Management */}
      <div className="space-y-3">
        {newTerm.calendar.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Scheduled Calendar Events
            </span>
            {newTerm.calendar.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-sky-50 border border-sky-200 text-sm font-medium"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center bg-sky-200 text-sky-800 rounded-full text-xs font-bold">
                    {c.order}
                  </span>
                  <span className="text-sky-900 font-semibold">{c.title}</span>
                </div>
                <span className="text-sky-700 text-xs">{c.date}</span>
              </div>
            ))}
          </div>
        )}

        <ItemHolder
          label="Add Calendar / Event Dates"
          value={
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              <input
                type="text"
                placeholder="Event Title"
                value={cal.title}
                onChange={(e) => setCal({ ...cal, title: e.target.value })}
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Event Date (e.g. Nov 12)"
                value={cal.date}
                onChange={(e) => setCal({ ...cal, date: e.target.value })}
                className={inputClass}
              />
              <input
                type="number"
                placeholder="Order No."
                value={cal.order || ""}
                onChange={(e) =>
                  setCal({ ...cal, order: parseInt(e.target.value) || 1 })
                }
                className={inputClass}
              />
              <button
                type="button"
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium transition cursor-pointer"
                onClick={addCalendar}
              >
                Add Event
              </button>
            </div>
          }
        />
      </div>

      {/* Final Submit CTA */}
      <div className="pt-4">
        <button
          className="w-full py-3.5 px-6 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-semibold text-base shadow-md hover:shadow-lg transition cursor-pointer"
          onClick={AddTerm}
        >
          SAVE NEW TERM CONFIGURATION
        </button>
      </div>
    </div>
  </motion.div>

                </div>}
            <div >
            </div>

            {/*<ProtectedRoute/>*/}

            <hr/>

            <h2 className="font-bold text-teal-700 text-xl mt-10">ADMIN APP SET UP PANEL</h2>

            {/* SETTINGS TOGGLES */}
  <div
    id="general-setup"
    className="max-w-4xl mx-auto p-6 md:p-8 bg-white border border-slate-200 rounded-2xl shadow-xl space-y-6"
  >
    {/* Section Banner Notice */}
    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
      <p className="text-xs md:text-sm font-medium text-amber-800">
        System activities and portal availability across this platform are controlled directly by these settings.
      </p>
    </div>

    {/* Main Grid Section */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Left Column: Feature Controls */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Feature Controls
        </h4>

        <div className="space-y-2">
          {[
            ["registrationIsOpened", "Registration"],
            ["resultsUploading", "Results Uploading"],
            ["resultsViewing", "Results Viewing Portal"],
            ["admissionPortal", "Admission Portal"],
            ["schoolIsOn", "School in Session"],
            ["feeManaging", "Fee Management"],
            ["attendanceMarking", "Attendance Marking"],
            ["termResultsPublished", "Publish Term Results"]
          ].map(([key, label]) => {
            const isActive = setting[key];
            return (
              <div
                key={key}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isActive ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  />
                  <span className="font-semibold text-sm text-slate-800">
                    {label}
                  </span>
                </div>
                <Toggle
                  value={isActive}
                  onClick={() => toggleField(key)}
                />
              </div>
            );
          })}
        </div>

      </div>

      {/* Right Column: Term & Session Management */}
      <div className="space-y-6">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Academic Timeline
        </h4>

        {/* Change Term Lock Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setHoldTerm(!holdTerm)}
            className={`w-full py-3 px-4 rounded-xl text-white font-medium text-sm transition flex items-center justify-between shadow-sm cursor-pointer ${
              holdTerm
                ? "bg-slate-800 hover:bg-slate-900"
                : "bg-sky-700 hover:bg-sky-800"
            }`}
          >
            <span className="flex items-center gap-2">
              CHANGE TERM / SESSION
              <span className="text-xs px-2 py-0.5 rounded bg-white/20">
                {!holdTerm ? "UNLOCKED" : "LOCKED"}
              </span>
            </span>
            {!holdTerm ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
          </button>

          {!holdTerm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="pt-1"
            >
              <Input
                label="Admin Security Token"
                value={adminToken}
                placeholder="Enter Admin Token"
                onChange={(e) => setAdminToken(e.target.value)}
              />
            </motion.div>
          )}

          <p className="text-xs text-amber-700 bg-amber-50/80 border border-amber-200/60 p-2.5 rounded-lg">
            Changing term or session is a sensitive action that modifies core system variables. Use only when initiating a new term.
          </p>
        </div>

        {/* Available Terms Chips */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <p className="text-xs font-semibold text-slate-600">
            AVAILABLE TERMS & SESSIONS ({allTerms ? allTerms.length : 0}):
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pt-1">
            {allTerms && allTerms.length > 0 &&
              allTerms.map((term, index) => (
                <span
                  key={index}
                  className="text-[11px] px-2 py-1 rounded-md bg-amber-100 text-amber-900 font-medium border border-amber-200"
                >
                  {term.termName} ({term.session})
                </span>
              ))}
          </div>
        </div>

        {/* Term/Session Selector Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border transition ${
            holdTerm
              ? "bg-slate-50 border-slate-200"
              : "bg-sky-50/60 border-sky-200"
          }`}
        >
          <ItemHolder
            label="Select Current Term"
            value={
              <select
                value={setting.currentTerm}
                className={selectClass}
                disabled={holdTerm}
                onChange={(e) =>
                  setSetting({ ...setting, currentTerm: e.target.value })
                }
              >
                <option value="">-- Select Term --</option>
                {terms.map((term) => (
                  <option key={term} value={term}>
                    {term} Term
                  </option>
                ))}
              </select>
            }
          />

          <ItemHolder
            label="Current Session"
            value={
              <select
                className={selectClass}
                value={setting.currentSession}
                disabled={holdTerm}
                onChange={(e) =>
                  setSetting({ ...setting, currentSession: e.target.value })
                }
              >
                <option value="">-- Session --</option>
                {session.map((sess) => (
                  <option key={sess} value={sess}>
                    {sess}
                  </option>
                ))}
              </select>
            }
          />
        </div>
      </div>
    </div>

    <hr className="border-slate-200" />

    {/* School Week Picker */}
    <ItemHolder
      label={`SET CURRENT SCHOOL WEEK (CURRENT: WEEK ${setting.schoolWeek})`}
      value={
        <div className="flex flex-wrap gap-2 pt-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((item) => {
            const isSelected = parseInt(setting.schoolWeek) === item;
            return (
              <button
                key={item}
                type="button"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? "bg-sky-700 text-white shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                }`}
                onClick={() =>
                  setSetting({ ...setting, schoolWeek: item.toString() })
                }
              >
                WK {item}
              </button>
            );
          })}
        </div>
      }
    />

    {/* Save Action Area */}
    <div className="pt-2">
      <motion.button
        type="button"
        onClick={handleSubmit}
        whileTap={{ scale: 0.97 }}
        className="w-full py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-base shadow-md hover:shadow-lg transition flex items-center justify-center gap-2.5 cursor-pointer"
      >
        <FaSave size={18} />
        <span>{loading ? "Saving Settings..." : "Save System Settings"}</span>
      </motion.button>
    </div>
  </div>

  {
  //  <TermInfo termSetting={thisTerm}/>
  }

          {/* Admission Settings */}
          <motion.div className="border-2 my-10 border-amber-700 rounded-lg" id="admission-setup" initial={{y: 20, opacity: .5}} whileInView={{y: 0, opacity: 1}} transition={{ duration: .6 }}>
            <ItemHolder label="Set Status Of Admission Portal"
                style={"my-3 "}
             value={<div className="p-4 grid grid-cols-3 md:grid-cols-4 gap-5">
                {
                [{title: "Application is Closed", val: "closed"}, {title: "Registration Ongoing", val: "ongoing"},
                 {title: "Awaiting Examination", val: "awaiting-exam"}, {title: "Awaiting Exam Results", val: "awaiting-result"},
                 {title: "Admission in Progress", val: "admission-ongoing"}
                ].map((item) => (
                    <div className={`p-2 rounded-md border-1 border-gray-500 w-fit cursor-pointer font-bold text-[9px] md:text-sm ${admissionSetting.admissionStatus === item.val && 'bg-green-700 text-white'}`} onClick={() => setAdmissionSetting({...admissionSetting, admissionStatus: item.val})}>{item.title}</div>
                ))
                }
             </div>}/>

             <div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <Input type={"number"} label={"Set Application Fee (NAIRA)"}
                 value={admissionSetting.applicationFee}
                 onChange={(e) => setAdmissionSetting({...admissionSetting, applicationFee: parseInt(e.target.value)})}
                 placeholder={"Enter Amount (N)"}
                 />
                <Input type={"text"} label={"Write Examination Date: "}
                 value={admissionSetting.examinationDate}
                 onChange={(e) => setAdmissionSetting({...admissionSetting, examinationDate: e.target.value})}
                 placeholder={"Exam Date in Details"}
                 />
                <Input type={"date"} label={"Application Deadlline Date: "}
                 value={admissionSetting.deadline}
                 onChange={(e) => setAdmissionSetting({...admissionSetting, deadline: e.target.value})}
                 />

                 <Select options={["2025/2026", "2026/2027", "2027/2028"]}
                  label={"Session"}
                  value={admissionSetting.session}
                  onChange={(e) => setAdmissionSetting({...admissionSetting, session: e.target.value})}
                  />

                  <textarea rows={"3"} cols={"20"} value={admissionSetting.notes} placeholder="Type Headline Notes"
                  className="focus:outline-none shadow-lg rounded-md bg-gray-200 font-lato border-1 border-slate-400 py-1 px-2"
                   onChange={(e) => setAdmissionSetting({...admissionSetting, notes: e.target.value})}/>
                   <div>
                   <button className="p-2 rounded-md bg-amber-800 text-white w-fit flex flex-row gap-3 cursor-pointer" type="button" onClick={submitAdmSetting} label="Submit Settings" value="Save Settings">Save Settings <FaSave size={22}/></button>
                   </div>
              </div>
                      
          </motion.div>


        </div>
    );
}

//test protected route
function ProtectedRoute() {
 const [token, setToken] = useState(null);

 useEffect(() => {
   const storedToken = localStorage.getItem("active-user");
   if (storedToken) {
     setToken(storedToken);
   };

   const checkRouteAccess = async () => {
     try {
       const res = await axios.get(`${mainApi}/user/protected`) //, { headers: { Authorization: `Bearer ${storedToken}` } });
       console.log(res.data);
     } catch (err) {
       console.log(err);
       setToken(null); // Clear token if access denied
     }; 
    };

    checkRouteAccess();
 }, []);    

 return token ? <div>Protected Content</div> : <div>Loading...</div>;
}


function ItemHolder({ label, value, style = "" }) {
  return (
    <div
      className={`flex flex-col gap-1 p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg shadow-sm ${style}`}
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <div className="text-base font-semibold text-slate-800 break-words">
        {value}
      </div>
    </div>
  );
}

export {ItemHolder}


import {
    CalendarDays,
    Clock3,
    BookOpen,
    CalendarRange,
    CheckCircle2,
    CircleAlert,
    Flag,
    PartyPopper,
    ArrowRight,
} from "lucide-react";


function TermInfo({ termSetting = null }) {

  const [termInfo, setTermInfo] = useState(termSetting);
  
//get settings....
        async function getSettings() {
            const api = `${mainApi}/setting`;
            if(termInfo) return;
            
            try {
                const res = await axios.get(api);
           //     if (res?.data) setSetting(res.data.settings.setUps);
           //     console.log(res.data)
                 
                setTermInfo(res.data.termSetting)
            } catch (err) {
              if(err.response){
                    setAlertMsg(err.response.data.msg)
              } else{
                setAlertMsg("Network Connectivity Error!!")
            }
            }
          }

          useEffect(() => {
            getSettings();
          }   , []);
    

    const {
        session,
        termName,
        startDate,
        endDate,
        nextTerm,
        noOfWeeks,
        termlyBreak,
        notes,
        resultsPublished,
        holidays = [],
        calendar = [],
    } = termInfo || {};


    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };


    return (
      <>
      {
        !termInfo ? (
          <div className="p-4 bg-slate-100 rounded-lg shadow-md text-center text-slate-700">
            Loading term information... 
          </div>
        ) : (
          <div>
        <section className="w-full space-y-5">

            {/* Header */}
            <div className="overflow-hidden rounded-[2px] bg-slate-900 text-white shadow-sm">

                <div className="relative p-5 sm:p-7">

                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5" />
                    <div className="absolute -bottom-16 right-20 h-32 w-32 rounded-full bg-white/5" />

                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-300">
                                <CalendarRange className="h-4 w-4" />
                                Present Term
                            </div>

                            <h2 className="text-2xl font-bold sm:text-3xl">
                                {termName} Term
                            </h2>

                            <p className="mt-1 text-sm text-slate-300">
                                {session} Academic Session
                            </p>
                        </div>


                        {/* Result status */}
                        <div
                            className={`flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                                resultsPublished
                                    ? "bg-emerald-400/15 text-emerald-300"
                                    : "bg-amber-400/15 text-amber-300"
                            }`}
                        >
                            {resultsPublished ? (
                                <CheckCircle2 className="h-4 w-4" />
                            ) : (
                                <Clock3 className="h-4 w-4" />
                            )}

                            {resultsPublished
                                ? "Term Results have being Published"
                                : "Results Not Published"}
                        </div>

                    </div>
                </div>
            </div>


            {/* Key information */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <InfoCard
                    icon={<CalendarDays />}
                    label="Term Starts"
                    value={formatDate(startDate)}
                />

                <InfoCard
                    icon={<Flag />}
                    label="Term Ends"
                    value={formatDate(endDate)}
                />

                <InfoCard
                    icon={<BookOpen />}
                    label="Academic Weeks"
                    value={`${noOfWeeks || 0} Weeks`}
                />

                <InfoCard
                    icon={<ArrowRight />}
                    label="Next Term"
                    value={formatDate(nextTerm)}
                />

            </div>


            {/* Notes + Break */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                {/* Term note */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <BookOpen className="h-5 w-5" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-900">
                                Term Note
                            </h3>
                            <p className="text-xs text-slate-500">
                                Important information
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm leading-6 text-slate-600">
                            {notes || "No notes have been added for this term."}
                        </p>
                    </div>

                </div>


                {/* Term break */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <PartyPopper className="h-5 w-5" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-900">
                                Termly Break
                            </h3>
                            <p className="text-xs text-slate-500">
                                Scheduled school break
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                        <span className="text-sm font-medium text-slate-600">
                            Break Period
                        </span>

                        <span className="text-sm font-bold text-slate-900">
                            {termlyBreak || "Not specified"}
                        </span>
                    </div>

                </div>

            </div>


            {/* Holidays */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="mb-5 flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                            <CalendarDays className="h-5 w-5" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-900">
                                Holidays
                            </h3>
                            <p className="text-xs text-slate-500">
                                Non-school days within the academic calendar
                            </p>
                        </div>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {holidays.length}
                    </span>

                </div>


                {holidays.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                        {holidays.map((holiday, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {holiday.name}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {formatDate(holiday.date)}
                                    </p>
                                </div>

                                <CalendarDays className="h-4 w-4 text-slate-400" />
                            </div>
                        ))}

                    </div>
                ) : (
                    <p className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
                        No holidays have been scheduled.
                    </p>
                )}

            </div>


            {/* Calendar events */}
            {calendar.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="mb-5">
                        <h3 className="font-semibold text-slate-900">
                            Academic Calendar
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                            Scheduled activities for the term
                        </p>
                    </div>

                    <div className="space-y-3">

                        {calendar.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 rounded-xl border border-slate-100 p-4"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                                    {item.order ?? index + 1}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-800">
                                        {item.title}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {item.date}
                                    </p>
                                </div>
                            </div>
                        ))}

                    </div>

                </div>
            )}

        </section>
          </div>
          )
      }
      
      </>

    )
}


function InfoCard({ icon, label, value }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <span className="h-5 w-5">
                    {icon}
                </span>
            </div>

            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-base font-bold text-slate-800">
                {value}
            </p>

        </div>
    );
}

export {TermInfo}