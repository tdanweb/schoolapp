import axios from "axios";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ItemHolder } from "./GeneralSetting";
//import { FormSection, Input, Select } from "../StudentResgistration";
import { Input, Select, FormSection } from "./StudentRegistration";
import { FaUserCircle,  FaGraduationCap,  FaFileAlt,  FaPlusCircle,  FaTrash,  FaSave,  FaTimes, FaIdCard} from "react-icons/fa";
import { mainApi } from "../../api";
import StaffManagementForm from "./AssignStaff";
import { PopUp } from "../../components/LogInForm";
import { FiDownload } from "react-icons/fi";

const initialStaffProfile = {
//  enroller: "admin", // or "self"
  regNo: "",
  email: "",
  phone: "",
  fullname: "",
  lastname: "",
  othernames: "",
  displayName: "",
  nin: "",
  dob: "",
  gender: "",
  passportUrl: "/passport.png",
  signature: "/signature.png",
  dateEmployed: "",
  specialization: "",
  designation: "",
  education: [], // Array of { qualification, details, dateStarted, dateEnded }
  docsUploaded: [] // Array of { title, imageUrl, docType }
};


export default function EnrolStaff() {
   //first load staff reg no:
  const [openLoad, setOpenLoad] = useState(true);
  const [id, setId] = useState("");


  const [staffInfo, setStaffInfo] = useState(initialStaffProfile);
  useEffect(() => {
    const savedStaff = localStorage.getItem("staff-info");
    if(savedStaff){
      setStaffInfo(JSON.parse(savedStaff))
      setOpenLoad(false);
    }
  }, []);

  const [state, setState] = useState("form");
  const [loading, setLoading] = useState(false);
  const [lock, setLock] = useState(true);
  const [alertMsg, setAlertmsg] = useState("")

  const btn = "text-md hover:bg-amber-700 font-bold font-lato p-2 cursor-pointer rounded-md text-white bg-slate-400 hover:bg-slate-500 transition";

  // Generic input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaffInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    localStorage.setItem("staff-info", JSON.stringify(staffInfo));
   };

   async function loadStaff(){
    //const api = `${mainApi}/staff/result-checker/gen`;
   // await axios.post(api);

   if(id.length < 7) return alert("Enter a Valid Registration NUmber");

   localStorage.removeItem("staff-info");
   setStaffInfo(initialStaffProfile);
   try {
      //USE PARAMS
      const api3 = `${mainApi}/user/staff/load`
      const res = await axios.get(api3, 
         {
         params: {
            user: "admin",
            regNo: id.toUpperCase()
         }
      });
      setOpenLoad(!openLoad);
      setLock(true);
      handleChange({ target: { name: "lastname", value: res.data.lastname }})
      handleChange({ target: { name: "regNo", value: res.data.regNo }})
      handleChange({ target: { name: "fullname", value: res.data.fullname }})
      handleChange({ target: { name: "phone", value: res.data.phone }})
      handleChange({ target: { name: "email", value: res.data.email }})
      setId("");
   } catch (error) {
      if(error.response){
         setAlertmsg(error.response.data.msg)
      }else{
         setAlertmsg("Network/Server Error. Please Try Again")
      }
   }
  }
  // Staff auto-load lookup by regNo
  const handleRegNoLookup = async (e) => {
    const regNo = e.target.value;
    handleChange(e);

    if (regNo.length === 7) {
      setLock(true);
      try {
        const params = new URLSearchParams({ user: "admin", regNo });
        const res = await axios.get(`${mainApi}/user/staff/load?${params.toString()}`);
        if (res.data?.staff) {
          setStaffInfo((prev) => ({ ...prev, ...res.data.staff }));
        }
      } catch (error) {
        console.error("Failed to fetch staff info:", error);
      } finally {
        setLock(false);
      }
    }
  };

  // --- Dynamic Array Handlers for Qualifications ---
  const addEducation = () => {
    setStaffInfo((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { qualification: "", details: "", dateStarted: "", dateEnded: "" },
      ],
    }));
  };

  const removeEducation = (index) => {
    setStaffInfo((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setStaffInfo((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  // --- Dynamic Array Handlers for Documents ---
  const addDocument = () => {
    setStaffInfo((prev) => ({
      ...prev,
      docsUploaded: [
        ...prev.docsUploaded,
        { title: "", imageUrl: "", docType: "Certificate" },
      ],
    }));
  };

  const removeDocument = (index) => {
    setStaffInfo((prev) => ({
      ...prev,
      docsUploaded: prev.docsUploaded.filter((_, i) => i !== index),
    }));
  };

  const handleDocumentChange = (index, field, value) => {
    setStaffInfo((prev) => {
      const updated = [...prev.docsUploaded];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, docsUploaded: updated };
    });
  };

  // Submit enrollment form
  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    formData.append("form", JSON.stringify(staffInfo));
    try {
      /*
      const res = await axios.post(`${mainApi}/user/staff/enroll`, formData, {
         headers: {
            "Content-Type": "multipart/form-data"
         }
      });
*/

      const res = await axios.post(`${mainApi}/user/staff/enroll`, staffInfo)
      setAlertmsg(res.data?.msg || "Staff enrolled successfully!");
      setStaffInfo(initialStaffProfile);
    } catch (error) {
      setAlertmsg("Failed to submit staff record.");
      if(error.response){
        setAlertmsg(error.response.data.msg)
      } else{
        setAlertmsg("Network/Server Error, Please try Again")
      }
    } finally {
      setLoading(false);
    }
  };

  const openRegForm = () => {
    setOpenLoad(!openLoad);
    setState("form")
  }

  return (
    <div className="p-2 flex flex-col gap-3">
{alertMsg && (
  <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/50 px-4">
    <div className="relative w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
      
      {/* Close button */}
      <button
        onClick={() => setAlertmsg("")}
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

      {
         openLoad 
           &&
         <PopUp  zed={"z-60"} close={() => setOpenLoad(!openLoad)}
            message={<div className="p-5 shadow-lg rounded-md bg-white ">
               <p className="text-2xl font-poppins font-bold my-5 text-blue-900">GET STAFF BY REG NO</p>
               <hr/>
<div className="w-full">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Enter Staff Reg. No.
  </label>

  <div className="relative">
    <FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

    <input
      type="text"
      placeholder="E.g. SCH2026"
      value={id}
      onChange={(e) => setId(e.target.value)}
      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                 transition-all text-sm bg-white"
    />
  </div>
</div>
               <div className="my-5 flex flex-row justify-between items-center">
                  <div><button onClick={() => setOpenLoad(false)} className={`${btn} flex flex-row gap-5 bg-blue-800 `}>Cancel <FaTimes size={24}/> </button></div>
                  <button onClick={loadStaff} className={`${btn} flex flex-row gap-5 bg-slate-800`}>Get Staff <FiDownload size={24}/></button>
               </div>
            </div>}/>
      }
      {/* Navigation Buttons */}
      <div className="p-2 shadow-lg flex flex-row gap-5 my-5 bg-white rounded-md">
        <button
          onClick={openRegForm}
          className={`${btn} ${state === "form" ? "bg-teal-700" : ""}`}
        >
          ENROL STAFF
        </button>
        <button
          onClick={() => setState("view")}
          className={`${btn} ${state === "view" ? "bg-teal-700" : ""}`}
        >
          STAFF PROFILES
        </button>
      </div>

      <div>
        {/* TAB 1: FORM */}
        {state === "form" && (
          <motion.div
            className="p-2"
            initial={{ y: 40, opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h4 className="text-2xl font-bold mb-4 text-gray-800">STAFF ENROLLMENT</h4>

            <form onSubmit={submitForm} className="flex flex-col gap-6">
              {/* SECTION 1: Basic Bio Data */}
              <FormSection
                title="Basic Information"
                description="Basic Staff Info and Bio Data"
                icon={<FaUserCircle size={25} />}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-7">
                  <Input
                    name="regNo"
                    value={staffInfo.regNo}
                    label="Staff Registration No"
                    placeholder="e.g. STF1001"
                    onChange={handleRegNoLookup}
                    disabled={lock}
                  />

                  <Input
                    required
                    name="fullname"
                    value={staffInfo.fullname}
                    label="Full Name"
                    placeholder="Enter First Name"
                   onChange={(e) =>
                   handleChange({
                   target: {   name: "fullname", value: e.target.value     }
                     })  }
                  />

                  <Input
                    required
                    name="lastname"
                    value={staffInfo.lastname}
                    label="Last Name"
                    placeholder="Enter Last Name"
              onChange={(e) =>
                handleChange({
                  target: {   name: "lastname", value: e.target.value     }
                })  }
                  />

                  <Input
                    name="othernames"
                    value={staffInfo.othernames}
                    label="Other Names"
                    placeholder="Middle or Other Names"
                    onChange={(e) =>
                handleChange({
                  target: {   name: "othernames", value: e.target.value     }
                })  }
                  />

                  <Input
                    required
                    type="email"
                    name="email"
                    value={staffInfo.email}
                    label="Contact Email"
                    placeholder="staff@school.com"
              onChange={(e) =>
                handleChange({
                  target: {   name: "email", value: e.target.value     }
                })  }
                  />

                  <Input
                    required
                    name="phone"
                    value={staffInfo.phone}
                    label="Phone Number"
                    placeholder="08012345678"
              onChange={(e) =>
                handleChange({
                  target: {   name: "phone", value: e.target.value     }
                })  }
                  />

                  <Input
                    required
                    name="displayName"
                    value={staffInfo.displayName}
                    label="Username / Display Name"
                    placeholder="Choose a Username"
              onChange={(e) =>
                handleChange({
                  target: {   name: "displayName", value: e.target.value     }
                })  }
                  />

                  <Input
                    required
                    name="nin"
                    value={staffInfo.nin}
                    label="NIN / Government ID"
                    placeholder="Enter NIN or ID number"
              onChange={(e) =>
                handleChange({
                  target: {   name: "nin", value: e.target.value     }
                })  }
                  />

                  <Select
                    required
                    name="gender"
                    value={staffInfo.gender}
                    label="Gender"
                    title="Select Gender:"
                    options={["Male", "Female"]}
              onChange={(e) =>
                handleChange({
                  target: {   name: "gender", value: e.target.value     }
                })  }
                  />

                  <Input
                    type="date"
                    name="dob"
                    value={staffInfo.dob}
                    label="Date of Birth"
              onChange={(e) =>
                handleChange({
                  target: {   name: "dob", value: e.target.value     }
                })  }
                  />

                  <Input
                    type="date"
                    name="dateEmployed"
                    value={staffInfo.dateEmployed}
                    label="Date of Employment"
              onChange={(e) =>
                handleChange({
                  target: {   name: "dateEmployed", value: e.target.value     }
                })  }
                  />

                  <Input
                    required
                    name="specialization"
                    value={staffInfo.specialization}
                    label="Area of Specialization"
                    placeholder="e.g. Pure Mathematics, Organic Chemistry"
              onChange={(e) =>
                handleChange({
                  target: {   name: "specialization", value: e.target.value     }
                })  }
                  />

                  <Input
                    required
                    name="designation"
                    value={staffInfo.designation}
                    label="Designation / Role"
                    placeholder="e.g. Senior English Teacher"
              onChange={(e) =>
                handleChange({
                  target: {   name: "designation", value: e.target.value     }
                })  }
                  />
                </div>
              </FormSection>

              {/* SECTION 2: Academic Qualifications */}
              <FormSection
                title="Qualifications & Education"
                description="Staff degrees, certificates, and institutions attended"
                icon={<FaGraduationCap size={25} />}
              >
                <div className="flex flex-col gap-4">
                  {staffInfo.education.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-md bg-gray-50 flex flex-col gap-3 relative"
                    >
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                        title="Remove Qualification"
                      >
                        <FaTrash size={16} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          label="Qualification Title"
                          placeholder="e.g. B.Sc. Computer Science"
                          value={item.qualification}
                          onChange={(e) =>
                            handleEducationChange(index, "qualification", e.target.value)
                          }
                        />
                        <Input
                          label="Institution / Details"
                          placeholder="e.g. University of Lagos"
                          value={item.details}
                          onChange={(e) =>
                            handleEducationChange(index, "details", e.target.value)
                          }
                        />
                        <Input
                          type="date"
                          label="Start Date"
                          value={item.dateStarted}
                          onChange={(e) =>
                            handleEducationChange(index, "dateStarted", e.target.value)
                          }
                        />
                        <Input
                          type="date"
                          label="End Date / Completion"
                          value={item.dateEnded}
                          onChange={(e) =>
                            handleEducationChange(index, "dateEnded", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addEducation}
                    className="flex items-center gap-2 text-sm font-semibold text-teal-800 hover:text-teal-900 w-fit"
                  >
                    <FaPlusCircle size={18} /> Add Qualification
                  </button>
                </div>
              </FormSection>

              {/* SECTION 3: Documents Upload Links */}
              <FormSection
                title="Uploaded Documents"
                description="Links to staff credentials, ID cards, or certificates"
                icon={<FaFileAlt size={25} />}
              >
                <div className="flex flex-col gap-4">
                  {staffInfo.docsUploaded.map((doc, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-md bg-gray-50 flex flex-col gap-3 relative"
                    >
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                        title="Remove Document"
                      >
                        <FaTrash size={16} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          label="Document Title"
                          placeholder="e.g. NYSC Discharge Certificate"
                          value={doc.title}
                          onChange={(e) =>
                            handleDocumentChange(index, "title", e.target.value)
                          }
                        />
                        <Input
                          label="Document Image/File URL"
                          placeholder="https://..."
                          value={doc.imageUrl}
                          onChange={(e) =>
                            handleDocumentChange(index, "imageUrl", e.target.value)
                          }
                        />
                        <Select
                          label="Document Type"
                          value={doc.docType}
                          options={["cv", "id", "education", "passport", "signature", "letter"]}
                          onChange={(e) =>
                            handleDocumentChange(index, "docType", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addDocument}
                    className="flex items-center gap-2 text-sm font-semibold text-teal-800 hover:text-teal-900 w-fit"
                  >
                    <FaPlusCircle size={18} /> Add Document
                  </button>
                </div>
              </FormSection>

              {/* Submit Button */}
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-md shadow-md flex items-center gap-3 disabled:opacity-50"
                >
                  <FaSave size={20} />
                  {loading ? "SUBMITTING..." : "SAVE & ENROL STAFF"}
                </button>
              </div>
            </form>


                {/*  <StaffManagementForm/> */}
            
          </motion.div>
        )}

        {/* TAB 2: PROFILES VIEW */}
        {state === "view" && (
          <motion.div
            className="p-2"
            initial={{ y: 40, opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h4 className="text-2xl font-bold mb-4 text-gray-800">STAFF PROFILES</h4>
            <p className="text-gray-500 italic">
              Search and view registered staff profiles (6 per page).
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

