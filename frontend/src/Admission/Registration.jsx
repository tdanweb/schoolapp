//also bio data page...
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaUser,
  FaIdCard,
  FaCalendarAlt,
  FaVenusMars,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaSchool,
  FaGraduationCap,
  FaHeartbeat,
  FaTint,
  FaUsers,
  FaBriefcase,
  FaMoneyBillWave,
  FaCamera,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaBullseye,
} from "react-icons/fa";
import { mainApi } from "../api";
import axios from "axios";


// ================================
// REUSABLE INPUT
// ================================


// ================================
// MAIN COMPONENT
// ================================

export default function RegistrationPage() {
  








  

 

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
       {
        alertMsg && "Alert Elm here with message rendered in <p>"
       }
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}

        <div className="mb-7">
          <p className="text-sm text-blue-700 font-medium">
            {!viewMode && "Admission Registration"}
          </p>

          <h1 className="text-2xl md:text-3xl font-bold text-blue-950">
            Applicant Biodata
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            { viewMode ? "Your Application had been Submitted. Editing Bio-Data is not available at the moment." :  "Complete your registration carefully. Your progress is saved automatically." }
          </p>

          {applicant && <ApplicantCard user={applicant} show={viewMode}/> }
        </div>


        {/* REG PIN */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5">

          <Input
            label="Registration PIN"
            value={regPin.pin}
            disabled
            icon={FaIdCard}
          />

          <p className="text-xs text-slate-400 mt-2">
            This PIN was generated after your application fee payment.
          </p>

        </div>


        {/* STEPPER */}

        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5">

          <div className="flex items-center">

            {steps.map((name, index) => {

              const number = index + 1;
              const active = step === number;
              const completed = step > number;

              return (
                <div
                  key={name}
                  className="flex items-center flex-1 last:flex-none"
                >

                  <div className="flex flex-col items-center">

                    <div
                      className={`w-9 h-9 rounded-full flex items-center
                      justify-center text-sm font-bold
                      ${
                        completed || active
                          ? "bg-blue-950 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {completed ? <FaCheck /> : number}
                    </div>

                    <span
                      className={`text-xs mt-2 hidden sm:block
                      ${
                        active
                          ? "text-blue-950 font-semibold"
                          : "text-slate-400"
                      }`}
                    >
                      {name}
                    </span>

                  </div>


                  {number !== steps.length && (
                    <div
                      className={`h-0.5 flex-1 mx-2
                      ${
                        completed
                          ? "bg-blue-950"
                          : "bg-slate-200"
                      }`}
                    />
                  )}

                </div>
              );
            })}

          </div>

        </div>


        {/* FORM CARD */}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <AnimatePresence mode="wait">

            {/* ===================== */}
            {/* STEP 1 PERSONAL */}
            {/* ===================== */}

            {step === 1 && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="p-5 md:p-7"
              >

                <SectionTitle
                  title="Personal Information"
                  text="Enter the applicant's basic biodata."
                />

                <div className="grid md:grid-cols-2 gap-5">

                  <Input
                    label="Surname"
                    value={form.surname}
                    onChange={(e) =>
                      updateField("surname", e.target.value)
                    }
                    icon={FaUser}
                    disabled={viewMode}
                    placeholder="Surname"
                  />

                  <Input
                    label="Other Name"
                    value={form.otherName}
                    disabled={viewMode}
                    onChange={(e) =>
                      updateField("otherName", e.target.value)
                    }
                    icon={FaUser}
                    placeholder="Other name"
                  />

                  <Input
                    label="Full Name"
                    value={form.fullName}
                    disabled={viewMode}
                    onChange={(e) =>
                      updateField("fullName", e.target.value)
                    }
                    icon={FaUser}
                    placeholder="Full name"
                  />

                  <Input
                    label="Date of Birth"
                    type="date"
                    value={form.dob}
                    onChange={(e) =>
                      updateField("dob", e.target.value)
                    }
                    disabled={viewMode}
                    icon={FaCalendarAlt}
                  />

                  <Select
                    label="Gender"
                    value={form.gender}
                    onChange={(e) =>
                      updateField("gender", e.target.value)
                    }
                    options={["Male", "Female"]}
                    icon={FaVenusMars}
                    disabled={viewMode}
                  />

                  <Input
                    label="Nationality"
                    value={form.nationality}
                    onChange={(e) =>
                      updateField("nationality", e.target.value)
                    }
                    icon={FaMapMarkerAlt}
                    disabled={viewMode}
                  />

                  <Input
                    label="State of Origin"
                    value={form.stateOfOrigin}
                    onChange={(e) =>
                      updateField("stateOfOrigin", e.target.value)
                    }
                    disabled={viewMode}
                    icon={FaMapMarkerAlt}
                    placeholder="State"
                  />

                  <Input
                    label="LGA"
                    value={form.lga}
                    onChange={(e) =>
                      updateField("lga", e.target.value)
                    }
                    disabled={viewMode}
                    icon={FaMapMarkerAlt}
                    placeholder="Local Government Area"
                  />

                  <Input
                    label="Phone Number"
                    value={form.contact.phone}
                    onChange={(e) =>
                      updateNested(
                        "contact",
                        "phone",
                        e.target.value
                      )
                    }
                    disabled={viewMode}
                    icon={FaPhone}
                    placeholder="080..."
                  />

                  <Input
                    label="Email"
                    type="email"
                    value={form.contact.email}
                    onChange={(e) =>
                      updateNested(
                        "contact",
                        "email",
                        e.target.value
                      )
                    }
                    disabled={viewMode}
                    icon={FaEnvelope}
                    placeholder="example@email.com"
                  />

                </div>


                <div className="mt-5">
                  <TextArea
                    label="Residential Address"
                    value={form.contact.address}
                    onChange={(e) =>
                      updateNested(
                        "contact",
                        "address",
                        e.target.value
                      )
                    }
                    disabled={viewMode}
                    placeholder="Enter residential address"
                  />
                </div>

              </motion.div>
            )}


            {/* ===================== */}
            {/* STEP 2 ACADEMIC */}
            {/* ===================== */}

            {step === 2 && (
              <motion.div
                key="academic"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="p-5 md:p-7"
              >

                <SectionTitle
                  title="Academic Information"
                  text="Provide the class and previous school information."
                />

                <div className="grid md:grid-cols-2 gap-5">

                  <Select
                    label="Class Applying For"
                    value={form.academic.classOnAdmission}
                    onChange={(e) =>
                      updateNested(
                        "academic",
                        "classOnAdmission",
                        e.target.value
                      )
                    }
                    disabled={viewMode}
                    icon={FaGraduationCap}
                    options={[
                      "Creche",
                      "Nursery 1",
                      "Nursery 2",
                      "Primary 1",
                      "Primary 2",
                      "Primary 3",
                      "Primary 4",
                      "Primary 5",
                      "JSS1",
                      "JSS2",
                      "JSS3",
                      "SS1",
                    ]}
                  />

                  <Select
                    label="Arm"
                    value={form.academic.arm}
                    onChange={(e) =>
                      updateNested(
                        "academic",
                        "arm",
                        e.target.value
                      )
                    }
                    icon={FaUsers}
                    disabled={viewMode}
                    options={["A", "B", "C"]}
                  />

                  <Select
                    label="Department"
                    value={form.academic.department}
                    onChange={(e) =>
                      updateNested(
                        "academic",
                        "department",
                        e.target.value
                      )
                    }
                    icon={FaGraduationCap}
                    options={[
                      "Science",
                      "Arts",
                      "Commercial",
                    ]}
                    disabled={viewMode}
                  />

                  <Input
                    label="Academic Session"
                    value={form.academic.session}
                    disabled
                    icon={FaCalendarAlt}
                    disabled={viewMode}
                  />

                  <Select
                    label="Term"
                    value={form.academic.term}
                    onChange={(e) =>
                      updateNested(
                        "academic",
                        "term",
                        e.target.value
                      )
                    }
                    disabled={viewMode}
                    options={[
                      "First",
                      "Second",
                      "Third",
                    ]}
                  />
                </div>


                <div className="border-t border-slate-100 mt-8 pt-6">

                  <h3 className="font-semibold text-blue-950 mb-4">
                    Previous School
                  </h3>

                  <div className="grid md:grid-cols-3 gap-5">

                    <Input
                      label="School Name"
                      value={
                        form.previousSchools.schoolName
                      }
                      disabled={viewMode}
                      onChange={(e) =>
                        updateNested(
                          "previousSchools",
                          "schoolName",
                          e.target.value
                        )
                      }
                      icon={FaSchool}
                      placeholder="Previous school"
                    />

                    <Input
                      label="From"
                      value={
                        form.previousSchools.from
                      }
                      disabled={viewMode}
                      onChange={(e) =>
                        updateNested(
                          "previousSchools",
                          "from",
                          e.target.value
                        )
                      }
                      placeholder="2019"
                    />

                    <Input
                      label="Till"
                      value={
                        form.previousSchools.till
                      }
                      onChange={(e) =>
                        updateNested(
                          "previousSchools",
                          "till",
                          e.target.value
                        )
                      }
                      disabled={viewMode}
                      placeholder="2025"
                    />

                  </div>

                </div>

              </motion.div>
            )}


            {/* ===================== */}
            {/* STEP 3 MEDICAL */}
            {/* ===================== */}

            {step === 3 && (
              <motion.div
                key="medical"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="p-5 md:p-7"
              >

                <SectionTitle
                  title="Medical Information"
                  text="This information helps us provide appropriate care."
                />

                <div className="grid md:grid-cols-2 gap-5">

                  <Select
                    label="Blood Group"
                    value={form.medical.bloodGroup} disabled={viewMode}
                    onChange={(e) =>
                      updateNested(
                        "medical",
                        "bloodGroup",
                        e.target.value
                      )
                    }
                    icon={FaTint}
                    options={[
                      "A+",
                      "A-",
                      "B+",
                      "B-",
                      "AB+",
                      "AB-",
                      "O+",
                      "O-",
                    ]}
                  />

                  <Select
                    label="Genotype"
                    value={form.medical.genotype}  disabled={viewMode}
                    onChange={(e) =>
                      updateNested(
                        "medical",
                        "genotype",
                        e.target.value
                      )
                    }
                    icon={FaHeartbeat}
                    options={[
                      "AA",
                      "AS",
                      "SS",
                      "AC",
                      "SC",
                    ]}
                  />

                  <Input
                    label="Allergies"
                    value={form.medical.allergies}  disabled={viewMode}
                    onChange={(e) =>
                      updateNested(
                        "medical",
                        "allergies",
                        e.target.value
                      )
                    }
                    icon={FaHeartbeat}
                    placeholder="None if applicable"
                  />

                  <Input
                    label="Disability"
                    value={form.medical.disability}  disabled={viewMode}
                    onChange={(e) =>
                      updateNested(
                        "medical",
                        "disability",
                        e.target.value
                      )
                    }
                    icon={FaHeartbeat}
                    placeholder="None if applicable"
                  />

                </div>


                <div className="mt-5">

                  <TextArea
                    label="Other Medical Issues"
                    value={form.medical.otherIssues}  disabled={viewMode}
                    onChange={(e) =>
                      updateNested(
                        "medical",
                        "otherIssues",
                        e.target.value
                      )
                    }
                    placeholder="Any other medical information we should know..."
                  />

                </div>

              </motion.div>
            )}


            {/* ===================== */}
            {/* STEP 4 SPONSOR */}
            {/* ===================== */}

            {step === 4 && (
              <motion.div
                key="sponsor"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="p-5 md:p-7"
              >

                <SectionTitle
                  title="Sponsor / Parent Information"
                  text="Provide the details of the person responsible for the applicant."
                />

                <div className="grid md:grid-cols-2 gap-5">

                  <Input
                    label="Full Name"
                    value={form.sponsor.name}  disabled={viewMode}
                    onChange={(e) =>
                      updateNested(
                        "sponsor",
                        "name",
                        e.target.value
                      )
                    }
                    icon={FaUser}
                    placeholder="Sponsor's full name"
                  />

                  <Select
                    label="Relationship"
                    value={form.sponsor.relationship}  disabled={viewMode}
                    onChange={(e) =>
                      updateNested(
                        "sponsor",
                        "relationship",
                        e.target.value
                      )
                    }
                    icon={FaUsers}
                    options={[
                      "Father",
                      "Mother",
                      "Guardian",
                      "Brother",
                      "Sister",
                      "Other",
                    ]}
                  />

                  <Input
                    label="Workplace"
                    value={form.sponsor.workplace}  disabled={viewMode}
                    onChange={(e) =>
                      updateNested(
                        "sponsor",
                        "workplace",
                        e.target.value
                      )
                    }
                    icon={FaBriefcase}
                    placeholder="Company / Organisation"
                  />

                  <Input
                    label="Monthly Salary"
                    value={form.sponsor.salary}  disabled={viewMode}
                    onChange={(e) =>
                      updateNested(
                        "sponsor",
                        "salary",
                        e.target.value
                      )
                    }
                    icon={FaMoneyBillWave}
                    placeholder="e.g. ₦250,000"
                  />

                  <Input
                    label="Phone Number"
                    value={form.sponsor.phone} disabled={viewMode}
                    onChange={(e) =>
                      updateNested(
                        "sponsor",
                        "phone",
                        e.target.value
                      )
                    }
                    icon={FaPhone}
                  />

                  <Input
                    label="Email"
                    type="email"
                    value={form.sponsor.email}
                    onChange={(e) =>
                      updateNested(
                        "sponsor",
                        "email",
                        e.target.value
                      )
                    }
                    icon={FaEnvelope}  disabled={viewMode}
                  />

                </div>


                <div className="mt-5">

                  <TextArea
                    label="Sponsor Address"
                    value={form.sponsor.address}  disabled={viewMode}
                    onChange={(e) =>
                      updateNested(
                        "sponsor",
                        "address",
                        e.target.value
                      )
                    }
                    placeholder="Sponsor's residential or office address"
                  />

                </div>


                {/* PASSPORT */}

                {!applicant ? <p className="text-lg font-poppins text-sky-700 italic"> You will be able to upload passport after successful application</p>  :
                
                <>
                <div className="border-t border-slate-100 mt-8 pt-6">

                  <h3 className="font-semibold text-blue-950 mb-1">
                    Applicant Passport Photograph
                  </h3>

                  <p className="text-sm text-slate-500 mb-4">
                    Upload a clear passport photograph.
                  </p>

                  <label
                    className="border-2 border-dashed border-slate-200
                    rounded-2xl p-7 flex flex-col items-center
                    justify-center cursor-pointer hover:border-blue-900
                    transition"
                  >

                    {passport ? (
                      <>
                        <img
                          src={URL.createObjectURL(passport)}
                          className="w-28 h-28 object-cover rounded-xl mb-3"
                        />

                        <p className="text-sm font-medium text-green-600">
                          Passport selected
                        </p>
                      </>
                    ) : (
                      <>
                        <FaCamera
                          size={30}
                          className="text-slate-400 mb-3"
                        />

                        <p className="font-medium text-slate-700">
                          Click to upload passport
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          JPG, PNG or WEBP
                        </p>
                      </>
                    )}

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handlePassport}
                      className="hidden"
                    />

                  </label>

                </div>
                <button disabled={loadP} onClick={UploadPassport} className={"p-2 rounded-md cursor-pointer font-lato text-center text-white bg-slate-700 my-2 w-full" + loadP && " opacity-1/2"}>UPLOAD PASSPORT</button>
                </>
             }

              </motion.div>
            )}

          </AnimatePresence>


          {/* ===================== */}
          {/* NAVIGATION */}
          {/* ===================== */}

          <div className="border-t border-slate-100 p-5 flex justify-between">

            <button
              onClick={previousStep}
              disabled={step === 1 }
              className="flex items-center gap-2 px-5 py-3 rounded-xl
              border border-slate-200 text-slate-600
              disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaArrowLeft />
              Back
            </button>


            {step < 4 ? (

              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3
                rounded-xl bg-blue-950 text-white font-semibold
                hover:bg-blue-900"
              >
                Save & Continue
                <FaArrowRight />
              </button>

            ) : (

              <button
                onClick={submitRegistration}
                disabled={viewMode}
                className={`flex items-center gap-2 px-6 py-3
                rounded-xl ${!viewMode && 'bg-yellow-500'} ${viewMode && 'bg-sky-700 text-white'} text-blue-950
                font-bold hover:bg-yellow-400`}
              >
                {!viewMode && <span className="flex gap-2 items-center">Submit Registration <FaCheck /> </span>}
                {viewMode && <span className="flex gap-2 items-center">APPLICATION SUBMITTED <FaCheck/> </span>}
              </button>

            )}

          </div>

        </div>

      </div>

    </div>
  )
}


