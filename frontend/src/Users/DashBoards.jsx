import {
  Users,
  GraduationCap,
  WalletCards,
  School,
  CalendarDays,
  ShieldCheck,
  Clock3,
} from "lucide-react";
import { motion } from "framer-motion";

export function StaffDashboard({
  staffData = null,
  adminData = null,
  permissions = null,
}) {
  // =========================================================
  // Existing staff dashboard logic remains here...
  // =========================================================


  // =========================================================
  // ADMIN DASHBOARD DATA
  // Only staff with adminData get this section
  // =========================================================

  const adminSettings = adminData?.setting || adminData?.settings || {};

  const currentSession =
    adminSettings?.currentSession ||
    adminData?.currentSession ||
    "";

  const currentTerm =
    adminSettings?.currentTerm ||
    adminData?.currentTerm ||
    "";

  const schoolWeek =
    adminSettings?.schoolWeek ||
    adminData?.schoolWeek ||
    0;

  const noOfWeeks =
    adminData?.term?.noOfWeeks ||
    adminData?.noOfWeeks ||
    0;

  const feeDetails = adminData?.feeDetails || {};

  const studentNo = adminData?.studentNo || 0;
  const noOfStaff = adminData?.noOfStaff || 0;
  const totalClass = adminData?.totalClass || 0;

  // ---------------------------------------------------------
  // Week display
  // ---------------------------------------------------------

  const weekNumber = Number(schoolWeek) || 0;
  const totalWeeks = Number(noOfWeeks) || 0;

  const weekProgress =
    totalWeeks > 0
      ? Math.min((weekNumber / totalWeeks) * 100, 100)
      : 0;

  // ---------------------------------------------------------
  // Currency formatter
  // ---------------------------------------------------------

  const formatMoney = (value = 0) => {
    return `₦${Number(value).toLocaleString("en-NG")}`;
  };

  // ---------------------------------------------------------
  // Admin cards
  // ---------------------------------------------------------

  const adminCards = [
    {
      title: "Total Students",
      value: studentNo,
      description: "Currently enrolled",
      icon: GraduationCap,
    },
    {
      title: "Total Staff",
      value: noOfStaff,
      description: "Active staff members",
      icon: Users,
    },
    {
      title: "Classes",
      value: totalClass,
      description: "Active classes",
      icon: School,
    },
    {
      title: "Fees Collected",
      value: formatMoney(feeDetails.paid),
      description: "Total paid this period",
      icon: WalletCards,
    },
  ];

  return (
    <div className="space-y-6">

      {/* =====================================================
          EXISTING STAFF DASHBOARD
          ===================================================== */}

      {/* Your existing staff dashboard UI goes here */}


      {/* =====================================================
          ADMIN SECTION
          Only rendered when adminData exists
          ===================================================== */}

      {adminData && (
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-5"
        >
          {/* ADMIN HEADER */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Admin Overview
                  </h2>

                  <p className="text-xs text-slate-500">
                    School administration dashboard
                  </p>
                </div>
              </div>
            </div>

            {/* SESSION / TERM */}

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                <CalendarDays className="w-4 h-4 text-blue-600" />

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
                    Session
                  </p>

                  <p className="text-sm font-semibold text-slate-700">
                    {currentSession || "N/A"}
                  </p>
                </div>
              </div>

              <div className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-[10px] uppercase tracking-wide text-blue-400 font-semibold">
                  Term
                </p>

                <p className="text-sm font-semibold text-blue-700">
                  {currentTerm || "N/A"}
                </p>
              </div>
            </div>
          </div>


          {/* =================================================
              ADMIN STAT CARDS
              ================================================= */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {adminCards.map((card, index) => {
              const Icon = card.icon;

              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.07,
                  }}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        {card.title}
                      </p>

                      <p className="mt-1 text-xl sm:text-2xl font-bold text-slate-800">
                        {card.value}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {card.description}
                      </p>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>


          {/* =================================================
              FEES + SCHOOL WEEK
              ================================================= */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* FEES */}

            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-slate-800">
                    Fee Overview
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">
                    Current fee collection status
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <WalletCards className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] uppercase font-semibold text-slate-400">
                    Total
                  </p>

                  <p className="mt-1 text-sm sm:text-base font-bold text-slate-800">
                    {formatMoney(feeDetails.total)}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3">
                  <p className="text-[10px] uppercase font-semibold text-emerald-600">
                    Paid
                  </p>

                  <p className="mt-1 text-sm sm:text-base font-bold text-emerald-700">
                    {formatMoney(feeDetails.paid)}
                  </p>
                </div>

                <div className="rounded-xl bg-rose-50 p-3">
                  <p className="text-[10px] uppercase font-semibold text-rose-500">
                    Outstanding
                  </p>

                  <p className="mt-1 text-sm sm:text-base font-bold text-rose-600">
                    {formatMoney(feeDetails.outstanding)}
                  </p>
                </div>

              </div>

              {/* COLLECTION PROGRESS */}

              <div className="mt-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-slate-500">
                    Collection progress
                  </span>

                  <span className="text-xs font-bold text-slate-700">
                    {feeDetails.total
                      ? Math.round(
                          (Number(feeDetails.paid || 0) /
                            Number(feeDetails.total)) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>

                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        feeDetails.total
                          ? Math.min(
                              (Number(feeDetails.paid || 0) /
                                Number(feeDetails.total)) *
                                100,
                              100
                            )
                          : 0
                      }%`,
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
              </div>
            </motion.div>


            {/* SCHOOL WEEK */}

            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-slate-800">
                    Academic Progress
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">
                    Current school term
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock3 className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-2xl font-bold text-slate-800">
                    Week {weekNumber}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    of {totalWeeks || "—"} weeks
                  </p>
                </div>

                <p className="text-sm font-bold text-blue-600">
                  {Math.round(weekProgress)}%
                </p>
              </div>

              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${weekProgress}%`,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                  className="h-full bg-blue-600 rounded-full"
                />
              </div>

              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Week {weekNumber}
                </span>

                <span className="font-medium text-slate-600">
                  {totalWeeks > weekNumber
                    ? `${totalWeeks - weekNumber} weeks remaining`
                    : "Term completed"}
                </span>
              </div>
            </motion.div>

          </div>


          {/* ADMIN FOOTER SUMMARY */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-md bg-slate-900 text-white p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Administration
                </p>

                <h3 className="mt-1 font-bold">
                  {currentSession || "Current Session"} •{" "}
                  {currentTerm || "Current Term"}
                </h3>
              </div>

              <div className="flex items-center gap-5 text-sm">
                <div>
                  <span className="text-slate-400">Students</span>
                  <p className="font-bold">{studentNo}</p>
                </div>

                <div>
                  <span className="text-slate-400">Staff</span>
                  <p className="font-bold">{noOfStaff}</p>
                </div>

                <div>
                  <span className="text-slate-400">Classes</span>
                  <p className="font-bold">{totalClass}</p>
                </div>
              </div>
            </div>
          </motion.div>

        </motion.section>
      )}
    </div>
  );
}