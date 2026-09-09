import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaClipboardCheck,
  FaFileInvoiceDollar,
  FaBell,
  FaCalendarAlt,
  FaTasks,
  FaSignOutAlt,
  FaUserGraduate,
  FaMoneyBillWave,
  FaSchool,
  FaUsers,
  FaBook,
  FaUserEdit,
  FaUserFriends,
  FaGraduationCap,
  FaCog,
  FaUserMd,
  FaBookOpen,
  FaHistory,
  FaUserCheck,
  FaKey,
  FaTablet,
  FaList,
} from "react-icons/fa";

export function AllSideBarLinks({
  user,
  permissions = {},
  click,
  userId = "SCH0001",
}) {
  const location = useLocation();
  /*
   * -------------------------------------------------------
   * ROLE DEFINITIONS
   * -------------------------------------------------------
   */
  const isChiefAdmin = user === "chief-admin";
  const isStaff = user === "staff"
  const isAdmin = user === "admin" || isChiefAdmin;
  const isParent = user === "parent";
  const isStudent = user === "student";

  /*
   * -------------------------------------------------------
   * STYLING & NAVIGATION HELPERS
   * -------------------------------------------------------
   */
  const styling =
    "p-2.5 px-3 font-poppins text-slate-200 text-[9pt] hover:bg-slate-800/60 justify-between flex items-center transition-colors my-0.5";
  const activeStyling = "bg-indigo-600 text-white font-semibold";

  const SideLink = ({ name, abb, icon, url }) => {
    const isActive = location.pathname === url;
    return (
      <Link
        key={abb}
        onClick={() => typeof click === "function" && click(abb)}
        className={`${styling} ${isActive ? activeStyling : ""}`}
        to={url}
      >
        <span>{name}</span>
        {icon}
      </Link>
    );
  };

  /*
   * =======================================================
   * 1. STUDENT SIDEBAR (7 Crucial Links)
   * =======================================================
   */
  if (isStudent) {
    return (
      <div className="space-y-1">
        <SideLink name="Home" abb="home" icon={<FaHome size={18} />} url="/app/user/home" />
        <SideLink name="My Results" abb="my-results" icon={<FaClipboardCheck size={18} />} url="/app/user/my-results" />
        <SideLink name="Fee Records" abb="fees" icon={<FaFileInvoiceDollar size={18} />} url="/app/user/fees" />
        <SideLink name="School Updates" abb="updates" icon={<FaBell size={18} />} url="/app/user/updates" />
        <SideLink name="Academic Calendar" abb="calendar" icon={<FaCalendarAlt size={18} />} url="/app/user/calendar" />
        <SideLink name="My Performance" abb="performance" icon={<FaTasks size={18} />} url="/app/user/performance" />
        <SideLink name="Attendance" abb="attendance" icon={<FaHistory size={18} />} url="/app/user/attendance" />
      </div>
    );
  }

  /*
  * REGULAR STAFF, ALL TAKEN AS TEACHING FOR NOW
   */

  if(isStaff){
    return(
      <>
         <SideLink name="Home" abb="home" icon={<FaHome size={18} />} url="/app/user/home" />
         <SideLink name="Upload Results" abb="results" icon={<FaClipboardCheck size={18} />} url="/app/user/results" />
         <SideLink name="Class List" abb="list" icon={<FaUsers size={18} />} url="/app/user/stu-list" />
         <SideLink name="My Timetable" abb="list" icon={<FaList size={18} />} url="/app/user/timetable" />
         {permissions.canManageStudents &&
         <>
         <SideLink name="Manage Students" abb="stu-m" icon={<FaUserEdit size={18} />} url="/app/user/manage-students" />  
         <SideLink name="Enrol Students" abb="stu" icon={<FaUserFriends size={18} />} url="/app/user/stu-reg" />
         </>
         }
      </>
    )
  }

  /*
   * =======================================================
   * 2. PARENT SIDEBAR
   * =======================================================
   */
  if (isParent) {
    return (
      <div className="space-y-1">
        <SideLink name="Home" abb="home" icon={<FaHome size={18} />} url="/app/user/home" />
        <SideLink name="Student Profile" abb="child-profile" icon={<FaUserGraduate size={18} />} url="/app/user/child/profile" />
        <SideLink name="Child Results" abb="child-results" icon={<FaClipboardCheck size={18} />} url="/app/user/child/results" />
        <SideLink name="Fee Records" abb="child-fees" icon={<FaFileInvoiceDollar size={18} />} url="/app/user/child/fees" />
        <SideLink name="Pay Fees" abb="pay-fees" icon={<FaMoneyBillWave size={18} />} url="/app/user/child/pay-fees" />
        <SideLink name="School Updates" abb="updates" icon={<FaBell size={18} />} url="/app/user/updates" />
        <SideLink name="Contact School" abb="contact" icon={<FaSchool size={18} />} url="/app/user/contact-school" />
        <SideLink name="Attendance" abb="attendance" icon={<FaHistory size={18} />} url="/app/user/child/attendance" />
      </div>
    );
  }

  /*
   * =======================================================
   * 3. STAFF / ADMIN / CHIEF-ADMIN SIDEBAR
   * =======================================================
   */
  return (
    <div className="space-y-1">
      {/* General */}
      <SideLink name="Home" abb="home" icon={<FaHome size={18} />} url="/app/user/home" />

      {/* Staff Academic Actions */}
      {(isAdmin || permissions.isClassTeacher) && (
        <SideLink name="Class List" abb="list" icon={<FaUsers size={18} />} url="/app/user/stu-list" />
      )}
      {(isAdmin || permissions.isSubjectTeacher) && (
        <SideLink name="My Subjects" abb="subjects" icon={<FaBook size={18} />} url="/app/user/my-subjects" />
      )}
      {(isAdmin || permissions.canUploadAssignedResults || permissions.isSubjectTeacher) && (
        <SideLink name="Upload Results" abb="results" icon={<FaClipboardCheck size={18} />} url="/app/user/results" />
      )}

      {/* Operations & Management */}
      {(isAdmin || permissions.canManageStudents) && (
        <SideLink name="Manage Students" abb="stu-m" icon={<FaUserEdit size={18} />} url="/app/user/manage-students" />
      )}
      {(isAdmin || permissions.canManageStudents) && (
        <SideLink name="Enrol Students" abb="stu" icon={<FaUserFriends size={18} />} url="/app/user/stu-reg" />
      )}
      {(isAdmin || permissions.canManageAdmission) && (
        <SideLink name="Admissions" abb="adm" icon={<FaGraduationCap size={18} />} url={`/app/user/manage-applicants/${userId}`} />
      )}
      {(isAdmin || permissions.canManageFinance) && (
        <SideLink name="Fee Management" abb="finance" icon={<FaFileInvoiceDollar size={18} />} url="/app/user/finance" />
      )}
      {(isAdmin || permissions.canCreateUpdate) && (
        <SideLink name="Manage Post" abb="posts" icon={<FaTablet size={18} />} url="/app/user/posts" />
      )}
      {/* Standard Admin */}
      {isAdmin && (
        <>
          <SideLink name="Staff List" abb="staff-list" icon={<FaUserMd size={18} />} url="/app/user/staff-list" />
          <SideLink name="Assign Staff" abb="ass" icon={<FaUserFriends size={18} />} url={`/app/user/staff-roles`} />
        </>
      )}
      {
        isAdmin || permissions.canApproveUsers && (
          <SideLink name="Approve Users" abb="users" icon={<FaUserCheck size={18} />} url="/app/user/users" />
        )
      }

      {/* Chief Admin Only */}
      {isChiefAdmin && (
        <>
          <SideLink name="General Setup" abb="set" icon={<FaCog size={18} />} url={`/app/user/admin-setting/${userId}`} />
          <SideLink name="Subjects & Classes" abb="set2" icon={<FaBookOpen size={18} />} url="/app/user/set-subject" />
          <SideLink name="Enrol Staff" abb="set3" icon={<FaUserMd size={18} />} url="/app/user/staff-enrol" />
          <SideLink name="Approve Users" abb="users" icon={<FaUserCheck size={18} />} url="/app/user/users" />
          <SideLink name="Result Pins" abb="pins" icon={<FaKey size={18} />} url="/app/user/result-pins" />
        </>
      )}

    </div>
  );
}