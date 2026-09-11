import React from "react";
import { motion } from "framer-motion";
import {
  UserRound,
  GraduationCap,
  Mail,
  BadgeCheck,
  School,
  WalletCards,
  CreditCard,
  CircleDollarSign,
  BellRing,
  CalendarDays,
  BookOpen,
} from "lucide-react";

export default function StudentDashboard({ studentData = null }) {
  if (!studentData?.student) {
    return (
      <div className="p-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Student information is not available.
          </p>
        </div>
      </div>
    );
  }

  const student = studentData.student;
  const classInfo = studentData.classInfo || {};
  const currentInfo = studentData.current || {};
  const updates = studentData.updates || [];

  const teacher = classInfo.classTeacher || {};
  const personalInfo = student.personalInfo || {};

  /*
   * Find the fee belonging to the current school session and term.
   */
  const currentFee =
    student.currentFee?.find(
      (fee) =>
        fee.session === currentInfo.currentSession &&
        fee.term === currentInfo.currentTerm
    ) || null;

  const totalFee = Number(currentFee?.total || 0);
  const paidFee = Number(currentFee?.paid || 0);
  const outstandingFee = Math.max(totalFee - paidFee, 0);

  const studentName =
    [
      personalInfo.firstName,
      personalInfo.otherName,
      personalInfo.surname,
    ]
      .filter(Boolean)
      .join(" ") || "Student";

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);

  const paidPercentage =
    totalFee > 0 ? Math.min((paidFee / totalFee) * 100, 100) : 0;

  return (
    <div className="space-y-5">
      {/* ================= CURRENT SCHOOL INFO ================= */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <School className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Student Dashboard
              </h2>

              <p className="text-[11px] text-slate-400">
                Current school information
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-semibold text-slate-600">
              <CalendarDays className="h-3.5 w-3.5" />
              {currentInfo.currentSession || "Session"}
            </span>

            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-semibold text-blue-700">
              {currentInfo.currentTerm || "Term"} Term
            </span>
          </div>
        </div>
      </motion.section>

      {/* ================= STUDENT PROFILE ================= */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <UserRound className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Student Profile
            </h2>
            <p className="text-[10px] text-slate-400">
              Personal and registration information
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {/* Passport */}
          <div className="flex justify-center sm:justify-start">
            <div className="h-28 w-24 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
              {student.passportUrl ? (
                <img
                  src={student.passportUrl}
                  alt={studentName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-300">
                  <UserRound className="h-8 w-8" />
                </div>
              )}
            </div>
          </div>

          {/* Student information */}
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-800">
              {studentName}
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              {personalInfo.gender || "Student"}
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoItem
                label="Admission No."
                value={student.admissionNo}
              />

              <InfoItem
                label="Portal Reg No."
                value={student.regNo}
              />

              <InfoItem
                label="Class"
                value={classInfo.mainClass || student.realClass}
              />

              <InfoItem
                label="Class Wing"
                value={classInfo.classId || "—"}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* ================= CLASS TEACHER ================= */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <GraduationCap className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Class Teacher Profile
            </h2>

            <p className="text-[10px] text-slate-400">
              Your current class teacher
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
                <GraduationCap className="h-5 w-5" />

                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-slate-800">
                  {teacher.fullname || "Not assigned"}
                </h3>

                <p className="mt-0.5 truncate text-[11px] text-slate-400">
                  Class Teacher
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[260px]">
              <InfoItem
                label="Staff ID"
                value={teacher.staffId || "—"}
              />

              <InfoItem
                label="Reg No."
                value={teacher.regNo || "—"}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-3">
            <Mail className="h-4 w-4 shrink-0 text-slate-400" />

            <span className="truncate text-xs text-slate-600">
              {teacher.email || "Email not available"}
            </span>
          </div>
        </div>

        {/* Class information */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <SmallStat
            icon={School}
            label="Class"
            value={classInfo.mainClass || student.realClass || "—"}
          />

          <SmallStat
            icon={BookOpen}
            label="Class Wing"
            value={classInfo.classId || "—"}
          />
        </div>
      </motion.section>

      {/* ================= CURRENT FEES ================= */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <WalletCards className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Current School Fees
              </h2>

              <p className="text-[10px] text-slate-400">
                {currentInfo.currentTerm || "Current"} Term •{" "}
                {currentInfo.currentSession || "Current Session"}
              </p>
            </div>
          </div>

          {currentFee && (
            <span className="rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-semibold text-slate-500">
              {currentFee.term} Term
            </span>
          )}
        </div>

        {!currentFee ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <WalletCards className="mx-auto h-7 w-7 text-slate-300" />

            <p className="mt-2 text-xs font-medium text-slate-500">
              No fee record found for the current term.
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              {currentInfo.currentTerm || "Current"} Term{" "}
              {currentInfo.currentSession || ""}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <FeeCard
                icon={CircleDollarSign}
                label="Total Fee"
                value={formatMoney(totalFee)}
                type="total"
              />

              <FeeCard
                icon={CreditCard}
                label="Paid"
                value={formatMoney(paidFee)}
                type="paid"
              />

              <FeeCard
                icon={WalletCards}
                label="Outstanding"
                value={formatMoney(outstandingFee)}
                type="outstanding"
              />
            </div>

            {/* Payment progress */}
            <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600">
                  Payment Progress
                </span>

                <span className="text-[11px] font-bold text-slate-700">
                  {paidPercentage.toFixed(0)}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${paidPercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full bg-emerald-500"
                />
              </div>

              <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                <span>Paid: {formatMoney(paidFee)}</span>

                <span>Balance: {formatMoney(outstandingFee)}</span>
              </div>
            </div>
          </>
        )}
      </motion.section>

      {/* ================= UPDATES ================= */}
      {updates.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <BellRing className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  Updates from School
                </h2>

                <p className="text-[10px] text-slate-400">
                  Latest school announcements and notices
                </p>
              </div>
            </div>

            <span className="text-[10px] font-medium text-slate-400">
              {updates.length}{" "}
              {updates.length === 1 ? "Update" : "Updates"}
            </span>
          </div>

          <div className="space-y-3">
            {updates.map((update) => (
              <motion.div
                key={update._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <BellRing className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-800">
                        {update.title}
                      </h3>

                      <span className="shrink-0 text-[10px] text-slate-400">
                        {new Date(update.createdAt).toLocaleDateString(
                          "en-NG",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm">
                      {update.body}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-medium text-slate-700">
                          {update.poster?.displayName || "Unknown"}
                        </p>

                        <p className="text-[10px] capitalize text-slate-400">
                          {update.poster?.staffType || "Staff"}
                        </p>
                      </div>

                      <span className="shrink-0 text-[10px] text-slate-400">
                        {new Date(update.createdAt).toLocaleTimeString(
                          "en-NG",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}

/* ================= SMALL UI COMPONENTS ================= */

function InfoItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 truncate text-xs font-semibold text-slate-700">
        {value || "—"}
      </p>
    </div>
  );
}

function SmallStat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="truncate text-xs font-semibold text-slate-700">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function FeeCard({ icon: Icon, label, value, type }) {
  const iconBg =
    type === "paid"
      ? "bg-emerald-50 text-emerald-600"
      : type === "outstanding"
      ? "bg-rose-50 text-rose-600"
      : "bg-blue-50 text-blue-600";

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}
        >
          <Icon className="h-4 w-4" />
        </div>

        <span className="text-[10px] font-medium text-slate-400">
          {label}
        </span>
      </div>

      <p className="mt-3 text-base font-bold text-slate-800 sm:text-lg">
        {value}
      </p>
    </div>
  );
}