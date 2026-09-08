import UnderDevelopmentCard from '../../components/UnderDev'
import { mainApi } from '../../api';
// Initialize Cloudinary instance
const cld = new Cloudinary({
  cloud: {
    cloudName: 'dqfmedorr' // Replace with your actual Cloudinary cloud name
  }
});

// Mock Data matching the provided schema
const MOCK_STAFF_DATA = [
  {
    _id: "6a9151499ae1f0482bd387f7",
    staffId: "STA0002",
    regNo: "SCH0001",
    email: "betikutdan@gmail.com",
    phone: "07053489210",
    fullname: "T. Daniel Betiku",
    lastname: "Betiku",
    othernames: "Daniel",
    displayName: "Temi_Dan",
    gender: "Male",
    dob: "2026-07-31",
    passportUrl: "app_uploads/i6bzb4lwtmuohacl0xxx", // Replace with your Cloudinary public ID
    signature: "/signature.png",
    dateEmployed: "2026-09-01",
    nin: "4003578932",
    staffType: "regular",
    staffCategory: "teaching",
    education: [
      { degree: "B.Sc", field: "Mathematics", institution: "University of Lagos" }
    ],
    specialization: "Mathematics Science",
    designation: "Snr. Mathematician",
    docsUploaded: ["degree_cert.pdf"],
    assignedSubjects: [
      { id: "SUB1", name: "Further Mathematics", code: "MTH201" },
      { id: "SUB2", name: "General Mathematics", code: "MTH101" }
    ],
    assignedClass: "SS 3 Gold",
    roles: ["Head of Science Dept", "Class Teacher"]
  },
  {
    _id: "7b9252500be2f1493ce498f8",
    staffId: "STA0003",
    regNo: "SCH0001",
    email: "a.johnson@achievers.edu",
    phone: "08012345678",
    fullname: "Alice Johnson",
    lastname: "Johnson",
    othernames: "Alice",
    displayName: "Alice_J",
    gender: "Female",
    dob: "1992-04-12",
    passportUrl: "app_uploads/ik2kekjk7ogik5oilnyd", 
    signature: "/signature.png",
    dateEmployed: "2024-01-15",
    nin: "5004689012",
    staffType: "contract",
    staffCategory: "teaching",
    education: [
      { degree: "B.Ed", field: "English Literature", institution: "Ibadan University" }
    ],
    specialization: "English Language",
    designation: "Lead Educator",
    docsUploaded: ["cv.pdf"],
    assignedSubjects: [
      { id: "SUB3", name: "English Language", code: "ENG101" }
    ],
    assignedClass: "JSS 2 Blue",
    roles: ["Literary Club Coordinator"]
  }
];


import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  MoreVertical,
  X,
  ShieldCheck,
  BookOpen,
  UserX,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Users,
} from "lucide-react";

import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";


/*
|--------------------------------------------------------------------------
| STAFF LIST
|--------------------------------------------------------------------------
*/

export default function StaffList() {

  const [staffList, setStaffList] = useState([]);

  const [selectedStaff, setSelectedStaff] = useState(null);

  const [page, setPage] = useState(1);

  /*
  |--------------------------------------------------------------------------
  | ADMIN STATE
  |--------------------------------------------------------------------------
  |
  | false = normal staff/user
  | true  = admin/chief-admin
  |
  */

  const [isAdminState, setIsAdminState] = useState(true); // Default to true for testing; replace with actual auth logic


  /*
  |--------------------------------------------------------------------------
  | GET STAFF LIST
  |--------------------------------------------------------------------------
  */

  async function getStaffList() {

    try {

      const loggedUser =
        JSON.parse(
          localStorage.getItem("logged-user")
        ) || {};

      /*
      |--------------------------------------------------------------
      | Determine admin state
      |--------------------------------------------------------------
      |
      | You can later replace this with your preferred auth logic.
      |
      */

      const specialRoles =
        loggedUser?.user?.specialRoles ||
        loggedUser?.specialRoles ||
        {};

      const staffType =
        loggedUser?.user?.staffType ||
        loggedUser?.staffType ||
        "";


        /*
      const admin =
        specialRoles?.chiefAdmin === true ||
        specialRoles?.isAdmin === true ||
        staffType === "chief-admin" ||
        staffType === "admin";

      setIsAdminState(admin);
*/

      const res = await axios.get(
        `${mainApi}/user/staff?page=${page}&limit=15`,
        {
          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${loggedUser?.token || ""}`,
          },
        }
      );


      console.log(
        "Fetched Staff List:",
        res.data
      );


      setStaffList(
        res.data?.staff || []
      );

    } catch (error) {

      console.error(
        "Error fetching staff list:",
        error
      );

      if (error.response) {
        console.error(
          "Response data:",
          error.response.data
        );
      }

    }

  }


  /*
  |--------------------------------------------------------------------------
  | CLOUDINARY IMAGE
  |--------------------------------------------------------------------------
  */

  const renderCloudinaryImage = (
    publicId,
    altText
  ) => {

    try {

      if (!publicId) {
        throw new Error("No image");
      }

      const myImage =
        cld.image(publicId);

      /*
      |--------------------------------------------------------------
      | Small optimized thumbnail
      |--------------------------------------------------------------
      */

      myImage.resize(
        fill()
          .width(80)
          .height(80)
      );

      return (
        <AdvancedImage
          cldImg={myImage}
          className="
            w-10
            h-10
            rounded-full
            object-cover
            border
            border-gray-200
          "
          alt={altText}
        />
      );

    } catch {

      return (
        <div
          className="
            w-10
            h-10
            rounded-full
            bg-blue-100
            text-blue-600
            flex
            items-center
            justify-center
            font-bold
          "
        >
          <User className="w-5 h-5" />
        </div>
      );

    }

  };


  /*
  |--------------------------------------------------------------------------
  | ADMIN ACTIONS
  |--------------------------------------------------------------------------
  */

  const handleDeactivate = (id) => {

    console.log(
      "Deactivating staff:",
      id
    );

    alert(
      `Deactivating account for staff ID: ${id}`
    );

  };


  const handleAssignRoles = (id) => {

    console.log(
      "Assigning roles to staff:",
      id
    );

    alert(
      `Opening Role Assignment modal for staff ID: ${id}`
    );

  };


  /*
  |--------------------------------------------------------------------------
  | EFFECT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    getStaffList();

  }, [page]);


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (

    <div className="p-6 bg-gray-50 min-h-screen">

      <div
        className="
          max-w-7xl
          mx-auto
          bg-white
          rounded-xl
          shadow-sm
          border
          border-gray-200
          overflow-hidden
        "
      >

        {/* ============================================================
            HEADER
        ============================================================ */}

        <div
          className="
            p-5
            border-b
            border-gray-100
            flex
            justify-between
            items-center
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-bold
                text-gray-800
              "
            >
              Staff Directory
            </h2>

            <p
              className="
                text-sm
                text-gray-500
              "
            >
              Manage school educators and
              administrative staff
            </p>

          </div>


          <span
            className="
              text-xs
              bg-blue-50
              text-blue-700
              px-3
              py-1
              rounded-full
              font-medium
            "
          >
            Total Staff: {staffList.length}
          </span>

        </div>


        {/* ============================================================
            TABLE
        ============================================================ */}

        <div className="overflow-x-auto">

          <table
            className="
              w-full
              text-left
              border-collapse
              text-sm
              text-gray-600
            "
          >

            <thead
              className="
                bg-gray-50
                text-gray-700
                uppercase
                text-xs
                font-semibold
                border-b
                border-gray-200
              "
            >

              <tr>

                <th className="py-3 px-4">
                  Photo
                </th>

                <th className="py-3 px-4">
                  Staff ID
                </th>

                <th className="py-3 px-4">
                  Full Name
                </th>

                <th className="py-3 px-4">
                  Category
                </th>

                <th className="py-3 px-4">
                  Type
                </th>

                <th className="py-3 px-4">
                  Assigned Class
                </th>

                <th className="py-3 px-4 text-center">
                  Subjects
                </th>

                {/*
                |------------------------------------------------------
                | ONLY ADMIN SEES ACTION COLUMN
                |------------------------------------------------------
                */}

                {isAdminState && (
                  <th className="py-3 px-4 text-center">
                    Action
                  </th>
                )}

              </tr>

            </thead>


            <tbody
              className="
                divide-y
                divide-gray-100
              "
            >

              {staffList.map((staff) => (

                <tr
                  key={staff._id}
                  className="
                    hover:bg-gray-50
                    transition-colors
                  "
                >

                  {/* PHOTO */}

                  <td className="py-3 px-4">

                    {renderCloudinaryImage(
                      staff.passportUrl,
                      staff.fullname
                    )}

                  </td>


                  {/* STAFF ID */}

                  <td
                    className="
                      py-3
                      px-4
                      font-semibold
                      text-gray-900
                    "
                  >
                    {staff.staffId}
                  </td>


                  {/* NAME */}

                  <td
                    className="
                      py-3
                      px-4
                      font-medium
                      text-gray-800
                    "
                  >
                    {staff.fullname}
                  </td>


                  {/* CATEGORY */}

                  <td className="py-3 px-4">

                    <span
                      className="
                        bg-purple-50
                        text-purple-700
                        px-2
                        py-0.5
                        rounded
                        text-xs
                      "
                    >
                      {staff.staffCategory || "N/A"}
                    </span>

                  </td>


                  {/* TYPE */}

                  <td className="py-3 px-4">

                    <span
                      className="
                        bg-gray-100
                        text-gray-700
                        px-2
                        py-0.5
                        rounded
                        text-xs
                      "
                    >
                      {staff.staffType || "N/A"}
                    </span>

                  </td>


                  {/* ASSIGNED CLASS */}

                  <td className="py-3 px-4">

                    {staff.assignedClass ? (

                      <div>

                        <p className="font-medium text-gray-800">

                          {staff.assignedClass.mainClass}

                          {staff.assignedClass.arm &&
                            ` ${staff.assignedClass.arm}`}

                        </p>

                        <p className="text-xs text-gray-400">

                          {staff.assignedClass.classId}

                        </p>

                      </div>

                    ) : (

                      <span className="text-gray-400">
                        Unassigned
                      </span>

                    )}

                  </td>


                  {/* SUBJECT COUNT */}

                  <td
                    className="
                      py-3
                      px-4
                      text-center
                      font-semibold
                      text-gray-700
                    "
                  >

                    {staff.assignedSubjects?.length || 0}

                  </td>


                  {/* =================================================
                      ADMIN ACTION
                  ================================================= */}

                  {isAdminState && (

                    <td
                      className="
                        py-3
                        px-4
                        text-center
                      "
                    >

                      <button
                        onClick={() =>
                          setSelectedStaff(staff)
                        }
                        className="
                          p-1.5
                          text-gray-500
                          hover:text-gray-800
                          hover:bg-gray-100
                          rounded-full
                          transition-colors
                        "
                        aria-label="More actions"
                      >

                        <MoreVertical
                          className="w-5 h-5"
                        />

                      </button>

                    </td>

                  )}

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


     {/* <UnderDevelopmentCard /> */}


      {/* ================================================================
          STAFF PROFILE MODAL
      ================================================================= */}

      <AnimatePresence>

        {selectedStaff && (

          <div
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              p-4
              bg-black/50
              backdrop-blur-sm
            "
          >

            <motion.div

              initial={{
                opacity: 0,
                scale: 0.95
              }}

              animate={{
                opacity: 1,
                scale: 1
              }}

              exit={{
                opacity: 0,
                scale: 0.95
              }}

              transition={{
                duration: 0.2
              }}

              className="
                bg-white
                rounded-2xl
                shadow-xl
                max-w-lg
                w-full
                overflow-hidden
                border
                border-gray-100
                flex
                flex-col
                max-h-[90vh]
              "
            >

              {/* ======================================================
                  MODAL HEADER
              ====================================================== */}

              <div
                className="
                  p-5
                  bg-gray-50
                  border-b
                  border-gray-100
                  flex
                  justify-between
                  items-center
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  {renderCloudinaryImage(
                    selectedStaff.passportUrl,
                    selectedStaff.fullname
                  )}

                  <div>

                    <h3
                      className="
                        font-bold
                        text-gray-900
                        text-lg
                      "
                    >
                      {selectedStaff.fullname}
                    </h3>

                    <p
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      {selectedStaff.staffType}
                      {" • "}
                      {selectedStaff.staffId}
                    </p>

                  </div>

                </div>


                <button
                  onClick={() =>
                    setSelectedStaff(null)
                  }
                  className="
                    p-1
                    text-gray-400
                    hover:text-gray-600
                    rounded-full
                    hover:bg-gray-200
                  "
                >

                  <X className="w-5 h-5" />

                </button>

              </div>


              {/* ======================================================
                  MODAL BODY
              ====================================================== */}

              <div
                className="
                  p-6
                  overflow-y-auto
                  space-y-6
                "
              >

                {/* BASIC INFORMATION */}

                <div>

                  <h4
                    className="
                      text-xs
                      font-semibold
                      text-gray-400
                      uppercase
                      tracking-wider
                      mb-3
                      flex
                      items-center
                      gap-1.5
                    "
                  >

                    <User className="w-4 h-4 text-blue-600" />

                    Staff Information

                  </h4>


                  <div className="grid grid-cols-2 gap-4">

                    <InfoItem
                      icon={<Briefcase />}
                      label="Category"
                      value={
                        selectedStaff.staffCategory
                      }
                    />

                    <InfoItem
                      icon={<Users />}
                      label="Type"
                      value={
                        selectedStaff.staffType
                      }
                    />

                    <InfoItem
                      icon={<Mail />}
                      label="Email"
                      value={
                        selectedStaff.email
                      }
                    />

                    <InfoItem
                      icon={<Phone />}
                      label="Phone"
                      value={
                        selectedStaff.phone
                      }
                    />

                  </div>

                </div>


                {/* ====================================================
                    SPECIAL ROLES
                ==================================================== */}

                <div>

                  <h4
                    className="
                      text-xs
                      font-semibold
                      text-gray-400
                      uppercase
                      tracking-wider
                      mb-2
                      flex
                      items-center
                      gap-1.5
                    "
                  >

                    <ShieldCheck
                      className="
                        w-4
                        h-4
                        text-blue-600
                      "
                    />

                    Special Roles

                  </h4>


                  <div className="flex flex-wrap gap-2">

                    {selectedStaff.specialRoles &&
                    Object.entries(
                      selectedStaff.specialRoles
                    )
                      .filter(
                        ([, value]) =>
                          value === true
                      )
                      .map(
                        ([role], index) => (

                          <span
                            key={index}
                            className="
                              bg-blue-50
                              text-blue-700
                              text-xs
                              px-2.5
                              py-1
                              rounded-md
                              font-medium
                            "
                          >
                            {formatRoleName(role)}
                          </span>

                        )
                      )}

                  </div>

                </div>


                {/* ====================================================
                    ASSIGNED CLASS
                ==================================================== */}

                <div>

                  <h4
                    className="
                      text-xs
                      font-semibold
                      text-gray-400
                      uppercase
                      tracking-wider
                      mb-2
                      flex
                      items-center
                      gap-1.5
                    "
                  >

                    <GraduationCap
                      className="
                        w-4
                        h-4
                        text-purple-600
                      "
                    />

                    Assigned Class

                  </h4>


                  {selectedStaff.assignedClass ? (

                    <div
                      className="
                        bg-purple-50
                        border
                        border-purple-100
                        rounded-lg
                        p-3
                      "
                    >

                      <p
                        className="
                          font-semibold
                          text-purple-900
                        "
                      >
                        {
                          selectedStaff.assignedClass
                            .mainClass
                        }

                        {selectedStaff.assignedClass.arm &&
                          ` ${selectedStaff.assignedClass.arm}`}
                      </p>

                      <p
                        className="
                          text-xs
                          text-purple-600
                          mt-1
                        "
                      >
                        Class ID:{" "}
                        {
                          selectedStaff.assignedClass
                            .classId
                        }
                      </p>

                    </div>

                  ) : (

                    <p
                      className="
                        text-sm
                        text-gray-500
                        italic
                      "
                    >
                      No class currently assigned.
                    </p>

                  )}

                </div>


                {/* ====================================================
                    ASSIGNED SUBJECTS
                ==================================================== */}

                <div>

                  <h4
                    className="
                      text-xs
                      font-semibold
                      text-gray-400
                      uppercase
                      tracking-wider
                      mb-2
                      flex
                      items-center
                      gap-1.5
                    "
                  >

                    <BookOpen
                      className="
                        w-4
                        h-4
                        text-green-600
                      "
                    />

                    Assigned Subjects (
                    {selectedStaff.assignedSubjects
                      ?.length || 0}
                    )

                  </h4>


                  {selectedStaff.assignedSubjects &&
                  selectedStaff.assignedSubjects.length > 0 ? (

                    <ul
                      className="
                        divide-y
                        divide-gray-100
                        bg-gray-50
                        rounded-lg
                        p-2
                        border
                        border-gray-100
                      "
                    >

                      {selectedStaff.assignedSubjects.map(
                        (sub, index) => (

                          <li
                            key={
                              sub._id ||
                              sub.id ||
                              index
                            }
                            className="
                              py-2
                              px-3
                              flex
                              justify-between
                              items-center
                              gap-3
                              text-sm
                            "
                          >

                            <div>

                              <span
                                className="
                                  font-medium
                                  text-gray-800
                                "
                              >
                                {sub.subject}
                              </span>

                              {sub.forClass && (
                                <p
                                  className="
                                    text-xs
                                    text-gray-400
                                    mt-0.5
                                  "
                                >
                                  {sub.forClass.mainClass}
                                  {sub.forClass.arm &&
                                    ` ${sub.forClass.arm}`}
                                </p>
                              )}

                            </div>


                            <span
                              className="
                                text-xs
                                bg-gray-200
                                text-gray-600
                                px-2
                                py-0.5
                                rounded
                                font-mono
                              "
                            >
                              {sub.abb || "—"}
                            </span>

                          </li>

                        )
                      )}

                    </ul>

                  ) : (

                    <p
                      className="
                        text-sm
                        text-gray-500
                        italic
                      "
                    >
                      No subjects currently assigned.
                    </p>

                  )}

                </div>

              </div>


              {/* ======================================================
                  MODAL FOOTER
              ====================================================== */}

              <div
                className="
                  p-4
                  bg-gray-50
                  border-t
                  border-gray-100
                  flex
                  flex-wrap
                  items-center
                  justify-end
                  gap-2
                "
              >

                {/* ==================================================
                    ADMIN ONLY ACTIONS
                ================================================== */}

                {isAdminState && (

                  <>

                    <button
                      onClick={() =>
                        handleDeactivate(
                          selectedStaff._id
                        )
                      }
                      className="
                        flex
                        items-center
                        gap-1.5
                        text-xs
                        font-medium
                        px-3
                        py-2
                        bg-red-50
                        text-red-600
                        hover:bg-red-100
                        rounded-lg
                        transition-colors
                      "
                    >

                      <UserX className="w-4 h-4" />

                      Deactivate Account

                    </button>


                    <button
                      onClick={() =>
                        handleAssignRoles(
                          selectedStaff._id
                        )
                      }
                      className="
                        flex
                        items-center
                        gap-1.5
                        text-xs
                        font-medium
                        px-3
                        py-2
                        bg-blue-600
                        text-white
                        hover:bg-blue-700
                        rounded-lg
                        transition-colors
                      "
                    >

                      <ShieldCheck
                        className="w-4 h-4"
                      />

                      Assign Roles

                    </button>

                  </>

                )}


                {/* CLOSE */}

                <button
                  onClick={() =>
                    setSelectedStaff(null)
                  }
                  className="
                    text-xs
                    font-medium
                    px-3
                    py-2
                    bg-gray-200
                    text-gray-700
                    hover:bg-gray-300
                    rounded-lg
                    transition-colors
                  "
                >
                  Close
                </button>

              </div>

            </motion.div>

          </div>

        )}

      </AnimatePresence>

    </div>

  );

}


/*
|--------------------------------------------------------------------------
| INFORMATION ITEM
|--------------------------------------------------------------------------
*/

function InfoItem({
  icon,
  label,
  value,
}) {

  return (

    <div>

      <p
        className="
          text-xs
          text-gray-400
          mb-1
        "
      >
        {label}
      </p>

      <div
        className="
          flex
          items-center
          gap-2
          text-sm
          text-gray-700
        "
      >

        <span className="text-gray-400">
          {React.cloneElement(icon, {
            className: "w-3.5 h-3.5",
          })}
        </span>

        <span className="truncate">
          {value || "N/A"}
        </span>

      </div>

    </div>

  );

}


/*
|--------------------------------------------------------------------------
| ROLE FORMATTER
|--------------------------------------------------------------------------
|
| canManageStudents → Can Manage Students
| chiefAdmin        → Chief Admin
|
*/

function formatRoleName(role) {

  return role
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) =>
      str.toUpperCase()
    );

}
  
