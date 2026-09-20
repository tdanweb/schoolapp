import React from "react";
import {
  Users,
  Wallet,
  CheckCircle,
  AlertCircle,
  CalendarDays,
  GraduationCap,
  UserRound,
  Sparkles,
} from "lucide-react";

function ParentDashboard({ parentData }) {

    
  if (!parentData?.success || !parentData?.isParent) {
    return (
      <div className="p-6">
        <p>Unable to load parent information.</p>
      </div>
    );
  }
    

  const { parent, summary, setting } = parentData;

  const wards = parent.wards || [];

  const today = new Date().toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formatMoney = (amount = 0) => {
    return `₦${Number(amount).toLocaleString()}`;
  };

  return (
<div className="space-y-8 p-4 md:p-8 bg-slate-50 min-h-screen text-slate-800">

  {/* =====================================
      WELCOME / CURRENT INFORMATION
  ====================================== */}
  <div className="relative overflow-hidden bg-gradient-to-br from-[#0B192C] via-[#1E3A8A] to-[#0F172A] rounded-3xl p-6 md:p-8 text-white shadow-xl border border-slate-800">
    {/* Subtle Decorative Ambient Background Glows */}
    <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F59E0B] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
          Parent Dashboard
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">{parent.fullname}</span>
        </h1>

        <p className="text-sm md:text-base text-slate-300 max-w-xl">
          Here is an overview of your wards and their latest school academic & fee updates.
        </p>
      </div>

      {/* Current school information */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">

        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5 hover:border-[#D4AF37]/30 transition-all">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Session</p>
          <p className="font-bold text-sm text-amber-300 mt-1">
            {setting?.currentSession || "-"}
          </p>
        </div>

        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5 hover:border-[#D4AF37]/30 transition-all">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Term</p>
          <p className="font-bold text-sm text-amber-300 mt-1">
            {setting?.currentTerm || "-"} Term
          </p>
        </div>

        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5 hover:border-[#D4AF37]/30 transition-all">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">School Week</p>
          <p className="font-bold text-sm text-amber-300 mt-1">
            Week {setting?.schoolWeek || "-"}
          </p>
        </div>

        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5 hover:border-[#D4AF37]/30 transition-all">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Today</p>
          <p className="font-bold text-sm text-amber-300 mt-1">
            {today}
          </p>
        </div>

      </div>

    </div>
  </div>


  {/* =====================================
      SUMMARY CARDS
  ====================================== */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

    {/* Total Wards */}
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Wards</p>
          <p className="text-2xl font-black text-[#0B192C] mt-2">
            {summary?.totalWards || 0}
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center group-hover:bg-[#1E3A8A] group-hover:text-white transition-colors">
          <Users size={22} />
        </div>
      </div>
    </div>


    {/* Total Fees */}
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Fees</p>
          <p className="text-xl font-black text-[#0B192C] mt-2">
            {formatMoney(summary?.totalFees)}
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#D4AF37] flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
          <Wallet size={22} />
        </div>
      </div>
    </div>


    {/* Paid */}
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Paid</p>
          <p className="text-xl font-black text-emerald-600 mt-2">
            {formatMoney(summary?.totalPaid)}
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
          <CheckCircle size={22} />
        </div>
      </div>
    </div>


    {/* Balance */}
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Balance Due</p>
          <p className="text-xl font-black text-rose-600 mt-2">
            {formatMoney(summary?.totalBalance)}
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
          <AlertCircle size={22} />
        </div>
      </div>
    </div>

  </div>


  {/* =====================================
      MY WARDS
  ====================================== */}
  <div className="space-y-4">

    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
      <div>
        <h2 className="text-xl font-extrabold text-[#0B192C]">
          My Wards
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Students attached to your parent account
        </p>
      </div>

      <span className="text-xs font-bold px-3 py-1 bg-slate-200 text-slate-700 rounded-full">
        {wards.length} {wards.length === 1 ? "Ward" : "Wards"}
      </span>
    </div>


    {/* Ward cards */}
    {wards.length === 0 ? (

      <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users size={32} />
        </div>
        <p className="font-bold text-slate-700 text-lg">
          No active wards found
        </p>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          No student is currently attached to this parent account.
        </p>
      </div>

    ) : (

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {wards.map((student) => (

          <div
            key={student._id}
            className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
          >

            {/* Student top section */}
            <div className="p-6 bg-gradient-to-b from-slate-50/80 to-white">
              <div className="flex gap-5">

                {/* Passport */}
                <div className="shrink-0 relative">
                  {student.passportUrl ? (
                    <img
                      src={student.passportUrl}
                      alt={student.fullname}
                      className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#D4AF37]/40 shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                      <UserRound size={36} />
                    </div>
                  )}
                </div>


                {/* Basic information */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-lg text-[#0B192C] truncate">
                        {student.fullname}
                      </h3>
                      <p className="text-xs font-medium text-slate-500">
                        ADM: {student.admissionNo}
                      </p>
                    </div>

                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-0.5">
                      {student.status}
                    </span>
                  </div>


                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#1E3A8A] px-2.5 py-1 rounded-md border border-blue-100">
                      <GraduationCap size={14} className="text-[#1E3A8A]" />
                      {student.class?.mainClass || "-"}
                    </span>

                    {student.class?.arm && (
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                        Arm: {student.class.arm}
                      </span>
                    )}

                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                      {student.personalInfo?.gender || "-"}
                    </span>
                  </div>

                </div>

              </div>
            </div>


            {/* Student details */}
            <div className="border-t border-slate-100 bg-slate-50/50 p-5">
              <div className="grid grid-cols-3 gap-3 text-left">

                <div>
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                    Reg No.
                  </p>
                  <p className="text-xs font-semibold text-slate-700 mt-1 truncate">
                    {student.regNo}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                    Class
                  </p>
                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    {student.class?.mainClass || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                    Date of Birth
                  </p>
                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    {student.personalInfo?.dob
                      ? new Date(student.personalInfo.dob).toLocaleDateString("en-NG")
                      : "-"}
                  </p>
                </div>

              </div>
            </div>


            {/* Current Fee */}
            <div className="border-t border-slate-100 p-5 mt-auto">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-amber-50 rounded-lg text-[#D4AF37]">
                  <Wallet size={16} />
                </div>
                <h4 className="font-bold text-sm text-[#0B192C]">
                  Current Fees
                </h4>
              </div>


              {student.currentFee?.length ? (

                <div className="space-y-3">
                  {student.currentFee.map((fee, index) => {
                    const balance = Number(fee.total || 0) - Number(fee.paid || 0);

                    return (
                      <div
                        key={index}
                        className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <p className="text-xs font-bold text-[#0B192C]">
                              {fee.term || setting?.currentTerm} Term
                            </p>
                            <p className="text-[11px] font-medium text-slate-500">
                              {fee.session || setting?.currentSession}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total</span>
                            <p className="font-black text-sm text-[#0B192C]">
                              {formatMoney(fee.total)}
                            </p>
                          </div>
                        </div>


                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                          <div>
                            <p className="text-[10px] uppercase font-semibold text-slate-400">
                              Paid
                            </p>
                            <p className="text-xs font-bold text-emerald-600 mt-0.5">
                              {formatMoney(fee.paid)}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] uppercase font-semibold text-slate-400">
                              Balance
                            </p>
                            <p className={`text-xs font-bold mt-0.5 ${balance > 0 ? "text-rose-600" : "text-slate-700"}`}>
                              {formatMoney(balance)}
                            </p>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

              ) : (

                <p className="text-xs text-slate-400 italic">
                  No current fee information available.
                </p>

              )}

            </div>

          </div>

        ))}

      </div>

    )}

  </div>

</div>
  );
}

export default ParentDashboard;