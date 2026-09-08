import React, { useState, useEffect } from "react";

import { FaBell, FaCalendarAlt, FaChartLine, FaCheckCircle, FaClock, FaMoneyBillWave,  FaUserGraduate,  FaUsers, FaBook, FaGraduationCap,  FaChalkboardTeacher,  FaClipboardCheck} from "react-icons/fa";

const parentData = {
  term: "First Term",
  session: "2026/2027",
  week: "Week 6",

  wards: [
    {
      name: "Daniel Betiku",
      className: "JSS 2A",
      admissionNo: "AIS/2026/0012",
      attendance: "94%",
      performance: "78%",
      feeBalance: 85000,
    },
    {
      name: "Deborah Betiku",
      className: "Primary 5",
      admissionNo: "AIS/2026/0028",
      attendance: "97%",
      performance: "86%",
      feeBalance: 45000,
    },
  ],

  updates: [
    {
      title: "Mid-Term Examination",
      text: "The mid-term examination begins on October 12.",
      date: "Sep 28",
    },
    {
      title: "Parents' Meeting",
      text: "Parents are reminded of the upcoming PTA meeting.",
      date: "Sep 30",
    },
    {
      title: "School Excursion",
      text: "JSS 1–3 students will be going on an educational excursion.",
      date: "Oct 04",
    },
  ],
};

export function ParentDashboardHome() {
  const totalBalance = parentData.wards.reduce( (sum, ward) => sum + ward.feeBalance, 0);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* Header */}
      <div className="mb-6">
        <p className="text-sm text-slate-500">Welcome back,</p>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Parent Dashboard
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Here's an overview of your wards and school activities.
        </p>
      </div>

      {/* School Information */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">

        <InfoCard
          icon={<FaCalendarAlt />}
          title="Session"
          value={parentData.session}
        />

        <InfoCard
          icon={<FaClock />}
          title="Current Term"
          value={parentData.term}
        />

        <InfoCard
          icon={<FaChartLine />}
          title="Current Week"
          value={parentData.week}
        />

      </div>

      {/* Fee Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-sm">

        <div className="flex items-center justify-between mb-4">

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <FaMoneyBillWave />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">
                Outstanding Fees
              </h2>

              <p className="text-xs text-slate-500">
                Total balance for all wards
              </p>
            </div>
          </div>

          <span className="text-lg md:text-xl font-bold text-red-600">
            ₦{totalBalance.toLocaleString()}
          </span>

        </div>

        <div className="space-y-2">

          {parentData.wards.map((ward) => (
            <div
              key={ward.admissionNo}
              className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3"
            >
              <div>
                <p className="font-medium text-sm text-slate-800">
                  {ward.name}
                </p>

                <p className="text-xs text-slate-500">
                  {ward.className}
                </p>
              </div>

              <p className="font-semibold text-sm text-red-600">
                ₦{ward.feeBalance.toLocaleString()}
              </p>
            </div>
          ))}

        </div>

        <button className="mt-4 w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-slate-800">
          View Fee Details
        </button>

      </div>

      {/* Wards */}
      <section className="mb-6">

        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg text-slate-900">
            My Wards
          </h2>

          <FaUsers className="text-slate-400" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">

          {parentData.wards.map((ward) => (
            <div
              key={ward.admissionNo}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
            >

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                  <FaUserGraduate />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">
                    {ward.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {ward.className}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {ward.admissionNo}
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">

                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500">
                    Attendance
                  </p>

                  <p className="font-bold text-green-600 mt-1">
                    {ward.attendance}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500">
                    Performance
                  </p>

                  <p className="font-bold text-blue-600 mt-1">
                    {ward.performance}
                  </p>
                </div>

              </div>

              <button className="w-full mt-4 border border-slate-200 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">
                View Student Details
              </button>

            </div>
          ))}

        </div>

      </section>

      {/* School Updates */}
      <section>

        <div className="flex items-center gap-2 mb-3">
          <FaBell className="text-amber-500" />

          <h2 className="font-bold text-lg text-slate-900">
            School Updates
          </h2>
        </div>

        <div className="space-y-3">

          {parentData.updates.map((update, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl p-4"
            >

              <div className="flex justify-between gap-4">

                <div>
                  <h3 className="font-semibold text-slate-800">
                    {update.title}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {update.text}
                  </p>
                </div>

                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {update.date}
                </span>

              </div>

            </div>
          ))}

        </div>

      </section>

    </div>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

      <div className="flex items-center gap-2 text-slate-400 text-sm">
        {icon}
        <span>{title}</span>
      </div>

      <p className="font-bold text-slate-800 mt-2 text-sm md:text-base">
        {value}
      </p>

    </div>
  );
}



// STUDENT DASHBOARD
const studentData = {
  name: "Daniel Betiku",
  className: "JSS 2A",
  arm: "Gold",
  session: "2026/2027",
  term: "First Term",

  currentInfo: {
    title: "Current Topic",
    subject: "Mathematics",
    topic: "Algebraic Expressions",
    teacher: "Mr. Adewale",
  },

  upcomingClasses: [
    {
      subject: "Mathematics",
      teacher: "Mr. Adewale",
      time: "10:00 AM",
      room: "Room 12",
    },
    {
      subject: "Basic Science",
      teacher: "Mrs. Johnson",
      time: "12:00 PM",
      room: "Science Lab",
    },
    {
      subject: "English Language",
      teacher: "Mrs. Williams",
      time: "2:00 PM",
      room: "Room 8",
    },
  ],

  exams: [
    {
      title: "Mathematics Test",
      date: "Oct 05, 2026",
      subject: "Mathematics",
    },
    {
      title: "Basic Science Test",
      date: "Oct 08, 2026",
      subject: "Basic Science",
    },
    {
      title: "Mid-Term Examination",
      date: "Oct 12, 2026",
      subject: "All Subjects",
    },
  ],

  updates: [
    {
      title: "School Assembly",
      text: "There will be a general school assembly on Monday morning.",
    },
    {
      title: "Sports Practice",
      text: "Students participating in athletics should report to the sports field by 3:30 PM.",
    },
  ],
};

export function StudentDashboardHome(stuData) {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* Welcome */}
      <div className="mb-6">

        <p className="text-sm text-slate-500">
          Welcome back,
        </p>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          {studentData.name}
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          {studentData.className} • {studentData.arm} Arm
        </p>

      </div>

      {/* Academic Information */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">

        <InfoCard
          icon={<FaGraduationCap />}
          title="Class"
          value={studentData.className}
        />

        <InfoCard
          icon={<FaCalendarAlt />}
          title="Session"
          value={studentData.session}
        />

        <InfoCard
          icon={<FaBook />}
          title="Term"
          value={studentData.term}
        />

        <InfoCard
          icon={<FaClock />}
          title="Today"
          value="Wednesday"
        />

      </div>

      {/* Current Information */}
      <section className="mb-6">

        <h2 className="font-bold text-lg text-slate-900 mb-3">
          Current Information
        </h2>

        <div className="bg-slate-900 text-white rounded-2xl p-5">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
              <FaBook />
            </div>

            <div>
              <p className="text-xs text-slate-300">
                Currently Learning
              </p>

              <h3 className="font-bold text-lg">
                {studentData.currentInfo.subject}
              </h3>
            </div>

          </div>

          <div className="mt-5">

            <p className="text-sm text-slate-300">
              Current Topic
            </p>

            <p className="font-semibold mt-1">
              {studentData.currentInfo.topic}
            </p>

            <p className="text-xs text-slate-400 mt-2">
              Teacher: {studentData.currentInfo.teacher}
            </p>

          </div>

        </div>

      </section>

      {/* Upcoming Classes */}
      <section className="mb-6">

        <div className="flex justify-between items-center mb-3">

          <h2 className="font-bold text-lg text-slate-900">
            Upcoming Classes
          </h2>

          <FaChalkboardTeacher className="text-slate-400" />

        </div>

        <div className="space-y-3">

          {studentData.upcomingClasses.map((item, index) => (

            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl p-4"
            >

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  {index + 1}
                </div>

                <div className="flex-1">

                  <h3 className="font-semibold text-slate-800">
                    {item.subject}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    {item.teacher} • {item.room}
                  </p>

                </div>

                <div className="text-right">

                  <p className="font-bold text-sm text-slate-800">
                    {item.time}
                  </p>

                  <p className="text-xs text-slate-400">
                    Today
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* Test & Exam Schedule */}
      <section className="mb-6">

        <h2 className="font-bold text-lg text-slate-900 mb-3">
          Tests & Examination
        </h2>

        <div className="grid md:grid-cols-3 gap-3">

          {studentData.exams.map((exam, index) => (

            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl p-4"
            >

              <p className="text-xs font-medium text-blue-600">
                {exam.subject}
              </p>

              <h3 className="font-bold text-slate-800 mt-2">
                {exam.title}
              </h3>

              <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
                <FaCalendarAlt />
                {exam.date}
              </div>

            </div>

          ))}

        </div>

      </section>

      {/* General Updates */}
      <section>

        <div className="flex items-center gap-2 mb-3">

          <FaBell className="text-amber-500" />

          <h2 className="font-bold text-lg text-slate-900">
            School Updates
          </h2>

        </div>

        <div className="space-y-3">

          {studentData.updates.map((update, index) => (

            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl p-4"
            >

              <h3 className="font-semibold text-slate-800">
                {update.title}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                {update.text}
              </p>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}


//STAFF DASHBOARD
const staffData = {
  staff: {
    name: "Mr. Daniel Adewale",
    role: "Teaching Staff",

    // This should eventually come from your backend
    permissions: {
      viewSchoolStats: false,
      viewStudentStats: true,
      viewAttendance: true,
      viewResults: true,
    },

    classTeacher: {
      isClassTeacher: true,
      className: "JSS 2A",
      studentCount: 32,
    },

    assignedSubjects: [
      {
        subject: "Mathematics",
        className: "JSS 2A",
        arm: "Gold",
      },
      {
        subject: "Mathematics",
        className: "JSS 3A",
        arm: "Gold",
      },
      {
        subject: "Basic Mathematics",
        className: "JSS 1B",
        arm: "Blue",
      },
    ],
  },

  // Only displayed when viewSchoolStats === true
  schoolStats: {
    students: 486,
    staff: 42,
    classes: 18,
    subjects: 27,
  },

  todayClasses: [
    {
      subject: "Mathematics",
      className: "JSS 2A",
      time: "8:00 AM",
      room: "Room 12",
    },
    {
      subject: "Mathematics",
      className: "JSS 3A",
      time: "10:00 AM",
      room: "Room 14",
    },
    {
      subject: "Basic Mathematics",
      className: "JSS 1B",
      time: "1:00 PM",
      room: "Room 7",
    },
  ],

  attendance: {
    present: 29,
    absent: 3,
    total: 32,
  },

  updates: [
    {
      title: "Staff Meeting",
      text: "All teaching staff are reminded of the staff meeting on Friday.",
      date: "Today",
    },
    {
      title: "Continuous Assessment",
      text: "CA scores for the current assessment should be submitted before Friday.",
      date: "Tomorrow",
    },
    {
      title: "Mid-Term Examination",
      text: "The mid-term examination timetable has been released.",
      date: "Sep 28",
    },
  ],
};

export default function StaffDashboardHome() {
  const { staff } = staffData;

  const isAdmin = staff.permissions.viewSchoolStats;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6">

        <p className="text-sm text-slate-500">
          Welcome back,
        </p>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          {staff.name}
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          {staff.role}
          {staff.classTeacher.isClassTeacher &&
            ` • Class Teacher, ${staff.classTeacher.className}`}
        </p>

      </div>


      {/* =====================================================
          SCHOOL-WIDE STATS
          ONLY AUTHORIZED ADMIN / CHIEF ADMIN
      ===================================================== */}

      {isAdmin && (
        <section className="mb-6">

          <div className="flex items-center justify-between mb-3">

            <div>
              <h2 className="font-bold text-lg text-slate-900">
                School Overview
              </h2>

              <p className="text-xs text-slate-500">
                Overall school statistics
              </p>
            </div>

            <FaGraduationCap className="text-slate-400" />

          </div>


          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

            <StatCard
              icon={<FaUsers />}
              title="Students"
              value={staffData.schoolStats.students}
            />

            <StatCard
              icon={<FaChalkboardTeacher />}
              title="Staff"
              value={staffData.schoolStats.staff}
            />

            <StatCard
              icon={<FaBook />}
              title="Subjects"
              value={staffData.schoolStats.subjects}
            />

            <StatCard
              icon={<FaGraduationCap />}
              title="Classes"
              value={staffData.schoolStats.classes}
            />

          </div>

        </section>
      )}


      {/* =====================================================
          STAFF / CLASS OVERVIEW
      ===================================================== */}

      <section className="mb-6">

        <h2 className="font-bold text-lg text-slate-900 mb-3">
          {staff.classTeacher.isClassTeacher
            ? "My Class"
            : "My Teaching Overview"}
        </h2>


        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

          {/* Class students */}
          {staff.classTeacher.isClassTeacher && (
            <InfoCard
              icon={<FaUsers />}
              title="My Students"
              value={staff.classTeacher.studentCount}
            />
          )}


          {/* Number of assigned classes */}
          <InfoCard
            icon={<FaChalkboardTeacher />}
            title="Assigned Classes"
            value={new Set(
              staff.assignedSubjects.map(
                (item) => item.className
              )
            ).size}
          />


          {/* Number of subjects */}
          <InfoCard
            icon={<FaBook />}
            title="Subjects"
            value={new Set(
              staff.assignedSubjects.map(
                (item) => item.subject
              )
            ).size}
          />

        </div>

      </section>


      {/* =====================================================
          ASSIGNED SUBJECTS
      ===================================================== */}

      <section className="mb-6">

        <div className="flex items-center justify-between mb-3">

          <div>
            <h2 className="font-bold text-lg text-slate-900">
              My Subjects & Classes
            </h2>

            <p className="text-xs text-slate-500">
              Classes and subjects assigned to you
            </p>
          </div>

          <FaBook className="text-slate-400" />

        </div>


        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">

          {staff.assignedSubjects.map((item, index) => (

            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
            >

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FaBook />
                </div>

                <div>

                  <h3 className="font-bold text-slate-800">
                    {item.subject}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {item.className}
                  </p>

                </div>

              </div>


              <div className="flex items-center justify-between mt-4">

                <span className="text-xs text-slate-500">
                  {item.arm} Arm
                </span>

                <button className="text-xs font-semibold text-blue-600">
                  View Class
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* =====================================================
          TODAY'S CLASSES
      ===================================================== */}

      <section className="mb-6">

        <div className="flex items-center justify-between mb-3">

          <h2 className="font-bold text-lg text-slate-900">
            Today's Classes
          </h2>

          <FaCalendarAlt className="text-slate-400" />

        </div>


        <div className="space-y-3">

          {staffData.todayClasses.map((item, index) => (

            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl p-4"
            >

              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FaClock />
                </div>


                <div className="flex-1">

                  <h3 className="font-semibold text-slate-800">
                    {item.subject}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    {item.className} • {item.room}
                  </p>

                </div>


                <div className="text-right">

                  <p className="font-bold text-sm text-slate-800">
                    {item.time}
                  </p>

                  <p className="text-xs text-slate-400">
                    Today
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* =====================================================
          ATTENDANCE
          Only if staff has permission
      ===================================================== */}

      {staff.permissions.viewAttendance && (
        <section className="mb-6">

          <h2 className="font-bold text-lg text-slate-900 mb-3">
            Class Attendance
          </h2>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">

            <div className="flex items-center justify-between mb-5">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                  <FaClipboardCheck />
                </div>

                <div>

                  <h3 className="font-bold text-slate-800">
                    Today's Attendance
                  </h3>

                  <p className="text-xs text-slate-500">
                    {staff.classTeacher.className}
                  </p>

                </div>

              </div>

              <span className="font-bold text-green-600">
                {Math.round(
                  (staffData.attendance.present /
                    staffData.attendance.total) *
                    100
                )}
                %
              </span>

            </div>


            <div className="grid grid-cols-3 gap-3">

              <MiniStat
                title="Present"
                value={staffData.attendance.present}
              />

              <MiniStat
                title="Absent"
                value={staffData.attendance.absent}
              />

              <MiniStat
                title="Total"
                value={staffData.attendance.total}
              />

            </div>


            <button className="w-full mt-4 bg-slate-900 text-white py-3 rounded-xl text-sm font-semibold">
              Manage Attendance
            </button>

          </div>

        </section>
      )}


      {/* =====================================================
          SCHOOL / STAFF UPDATES
      ===================================================== */}

      <section>

        <div className="flex items-center gap-2 mb-3">

          <FaBell className="text-amber-500" />

          <h2 className="font-bold text-lg text-slate-900">
            Updates
          </h2>

        </div>


        <div className="space-y-3">

          {staffData.updates.map((update, index) => (

            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl p-4"
            >

              <div className="flex justify-between gap-4">

                <div>

                  <h3 className="font-semibold text-slate-800">
                    {update.title}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {update.text}
                  </p>

                </div>

                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {update.date}
                </span>

              </div>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}


/* ============================================================
   REUSABLE COMPONENTS
============================================================ */
function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mb-3">
        {icon}
      </div>

      <p className="text-xs text-slate-500">
        {title}
      </p>

      <p className="text-xl font-bold text-slate-900 mt-1">
        {value}
      </p>

    </div>
  );
}


function MiniStat({ title, value }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3 text-center">

      <p className="text-xs text-slate-500">
        {title}
      </p>

      <p className="font-bold text-slate-800 mt-1">
        {value}
      </p>

    </div>
  );
}
