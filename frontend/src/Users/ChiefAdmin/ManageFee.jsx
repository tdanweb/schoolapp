import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  WalletCards,
  Users,
  Search,
  School,
  CreditCard,
  Banknote,
  X,
  Plus,
  Trash2,
  Pencil,
  CheckCircle2,
  UserRound,
  ReceiptText,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";
import { AlertMessage } from "../../components/LogInForm";
import { mainApi } from "../../api";
import axios from "axios";

function AdminFeePage({ adminData }) {
  const currentSession = adminData?.settings?.currentSession || "";
  const currentTerm = adminData?.settings?.currentTerm || "";

  const students = adminData?.students || [];

  const canManageFinance =
    adminData?.staffInfo?.staffType === "chief-admin" ||
    adminData?.staffInfo?.specialRoles?.canManageFinance === true;

  const [view, setView] = useState("class");
  const [selectedClass, setSelectedClass] = useState("");
  const [admissionSearch, setAdmissionSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash-at-hand");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentComment, setPaymentComment] = useState("");
  const [onlineToken, setOnlineToken] = useState("");

  const [editFeeOpen, setEditFeeOpen] = useState(false);
  const [editedBreakdown, setEditedBreakdown] = useState([]);

  const money = (value = 0) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);

  const getCurrentFee = (student) => {
    return (
      student?.currentFee?.find(
        (fee) =>
          fee?.session === currentSession &&
          fee?.term === currentTerm
      ) || null
    );
  };

  const getStudentName = (student) => {
    const personal = student?.personalInfo || {};

    const fullName = [
      personal?.firstName,
      personal?.otherName,
      personal?.surname,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      fullName ||
      student?.fullname ||
      student?.name ||
      student?.admissionNo ||
      "Student"
    );
  };

  const classes = useMemo(() => {
    return [
      ...new Set(
        students
          .map((student) => student?.realClassId)
          .filter(Boolean)
      ),
    ].sort();
  }, [students]);

  const classStudents = useMemo(() => {
    if (!selectedClass) return [];

    return students.filter(
      (student) => student?.realClassId === selectedClass
    );
  }, [students, selectedClass]);

  const classSummary = useMemo(() => {
    return classStudents.reduce(
      (acc, student) => {
        const fee = getCurrentFee(student);

        acc.total += Number(fee?.total || 0);
        acc.paid += Number(fee?.paid || 0);
        acc.outstanding += Math.max(
          Number(fee?.total || 0) - Number(fee?.paid || 0),
          0
        );

        return acc;
      },
      {
        total: 0,
        paid: 0,
        outstanding: 0,
      }
    );
  }, [classStudents, currentSession, currentTerm]);

  const schoolFeeInfo = adminData?.feeInfo || {
    total: 0,
    paid: 0,
    outstanding: 0,
  };

  const searchedStudent = useMemo(() => {
    const search = admissionSearch.trim().toLowerCase();

    if (!search) return null;

    return (
      students.find(
        (student) =>
          student?.admissionNo?.toLowerCase() === search
      ) || null
    );
  }, [admissionSearch, students]);

  const openStudent = (student) => {
    setSelectedStudent(student);
    setAdmissionSearch(student?.admissionNo || "");
  };

  const goToStudentView = () => {
    if (!searchedStudent) {
      console.log("Student Search", {
        admissionNo: admissionSearch,
        message: "Student not found",
      });
      return;
    }

    setSelectedStudent(searchedStudent);
  };

  const openEditFee = () => {
    if (!canManageFinance) {
      console.log("Finance Access Denied", {
        message: "User does not have finance management permission.",
      });
      return;
    }

    const fee = getCurrentFee(selectedStudent);

    setEditedBreakdown(
      fee?.breakdown?.map((item) => ({
        title: item?.title || "",
        amount: Number(item?.amount || 0),
      })) || []
    );

    setEditFeeOpen(true);
  };

  const updateBreakdownItem = (index, field, value) => {
    setEditedBreakdown((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]:
                field === "amount"
                  ? value.replace(/[^0-9.]/g, "")
                  : value,
            }
          : item
      )
    );
  };

  const addBreakdownItem = () => {
    setEditedBreakdown((prev) => [
      ...prev,
      {
        title: "",
        amount: 0,
      },
    ]);
  };

  const removeBreakdownItem = (index) => {
    setEditedBreakdown((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  //later..
  const saveFeeUpdate = () => {
    if (!selectedStudent) return;

    if (!canManageFinance) {
      console.log("Finance Access Denied");
      return;
    }

    const cleanedBreakdown = editedBreakdown
      .map((item) => ({
        title: item.title.trim(),
        amount: Number(item.amount) || 0,
      }))
      .filter((item) => item.title);

    const total = cleanedBreakdown.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    console.log("Student Fee Update", {
      admissionNo: selectedStudent.admissionNo,
      session: currentSession,
      term: currentTerm,
      classId: selectedStudent.realClassId,
      fullname: getStudentName(selectedStudent),
      breakdown: cleanedBreakdown,
      total,
    });

    setEditFeeOpen(false);
  };

  const openPayment = () => {
    if (!canManageFinance) {
      console.log("Finance Access Denied", {
        message: "User does not have finance management permission.",
      });
      return;
    }

    setPaymentAmount("");
    setPaymentComment("");
    setOnlineToken("");
    setPaymentMethod("cash-at-hand");
    setPaymentOpen(true);
  };

  
  //msg
  const [alertMsg, setAlertMsg] = useState("");
  const [payInfo, setPayInfo] = useState(null)
  const submitPayment = async () => {
    if (!selectedStudent) return;

    if (!canManageFinance) {
      console.log("Finance Access Denied");
      return;
    }

    const fee = getCurrentFee(selectedStudent);

    const total = Number(fee?.total || 0);
    const paid = Number(fee?.paid || 0);
    const outstanding = Math.max(total - paid, 0);

    const amount = Number(paymentAmount);

    if (!amount || amount <= 0) {
      console.log("Payment Error", {
        message: "Enter a valid payment amount.",
      });
      return;
    }

    if (amount > outstanding) {
      console.log("Payment Error", {
        message: "Payment cannot exceed outstanding balance.",
        outstanding,
        attemptedAmount: amount,
      });
      return;
    }

    if (
      paymentMethod === "online" &&
      onlineToken.trim() !== "admin1234"
    ) {
      console.log("Payment Error", {
        message: "Invalid online payment token.",
      });
      return;
    }

    const newPaid = paid + amount;
    const newOutstanding = Math.max(total - newPaid, 0);

    const paymentPayload = {
      admissionNo: selectedStudent.admissionNo,
      session: currentSession,
      term: currentTerm,

      paymentId: `FEE-${Date.now()}`,

      classId: selectedStudent.realClassId,
      fullname: getStudentName(selectedStudent),

      totalFee: total,
      totalPaid: newPaid,
      balanced: newOutstanding === 0,

      payer: adminData?.staffInfo?.fullname || "Admin",
      datedPaid: new Date().toISOString(),

      comment: paymentComment.trim(),

      method: paymentMethod,

      adminStaff: adminData?.staffInfo?._id,

      paymentAmount: amount,
      previousPaid: paid,
      previousOutstanding: outstanding,
      newOutstanding,
    };

    console.log("Student Fee Payment", paymentPayload);

    setPaymentOpen(false);
    setPaymentAmount("");
    setPaymentComment("");
    setOnlineToken("");

const payAPI = `${mainApi}/admin/pay-fee?token=${
  JSON.parse(localStorage.getItem("logged-user")).token
}`;

try {

  const res = await axios.put(payAPI, paymentPayload);

  const pay = res.data.payment
  setPayInfo(pay)
  setAlertMsg(res.data.msg)

} catch (error) {

  if (error.response) {

    // Backend responded with an error

    setAlertMsg(error.response.data.msg);

  } else if (error.request) {

    // Request was sent but no response came back

    setAlertMsg("Network Error...");

  } else {

    // Something went wrong before the request was sent

    console.log(error.message);

  }

}
  };

  const studentFee = selectedStudent
    ? getCurrentFee(selectedStudent)
    : null;

  const studentTotal = Number(studentFee?.total || 0);
  const studentPaid = Number(studentFee?.paid || 0);
  const studentOutstanding = Math.max(
    studentTotal - studentPaid,
    0
  );



  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      {alertMsg && <AlertMessage element={payInfo ? <PaymentCard data={payInfo}/> : <></>} msg={alertMsg} zed={100} click={() => setAlertMsg("")}/>}
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <WalletCards size={22} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  Fee Management
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage student fee records.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {currentSession} Session
                  </span>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {currentTerm} Term
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
                canManageFinance
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {canManageFinance ? (
                <>
                  <CheckCircle2 size={18} />
                  Finance management enabled
                </>
              ) : (
                <>
                  <ShieldAlert size={18} />
                  View only
                </>
              )}
            </div>
          </div>
        </div>

        {/* VIEW SWITCH */}
        <div className="mb-5 flex w-full rounded-xl border border-slate-200 bg-white p-1 shadow-sm sm:w-fit">
          <button
            onClick={() => setView("class")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition sm:flex-none ${
              view === "class"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <School size={17} />
            Class Fees
          </button>

          <button
            onClick={() => setView("student")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition sm:flex-none ${
              view === "student"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <UserRound size={17} />
            Single Student
          </button>
        </div>

        <AnimatePresence mode="wait">

          {/* =====================================================
              CLASS VIEW
          ====================================================== */}
          {view === "class" && (
            <motion.div
              key="class-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >

              {/* SCHOOL SUMMARY */}
              <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

                <SummaryCard
                  icon={<ReceiptText size={19} />}
                  title="Total Expected"
                  value={money(schoolFeeInfo.total)}
                  bg="bg-blue-50"
                  iconColor="text-blue-600"
                />

                <SummaryCard
                  icon={<CheckCircle2 size={19} />}
                  title="Total Paid"
                  value={money(schoolFeeInfo.paid)}
                  bg="bg-emerald-50"
                  iconColor="text-emerald-600"
                />

                <SummaryCard
                  icon={<WalletCards size={19} />}
                  title="Outstanding"
                  value={money(schoolFeeInfo.outstanding)}
                  bg="bg-rose-50"
                  iconColor="text-rose-600"
                />
              </div>

              {/* CLASS SELECTOR */}
              <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <School size={18} className="text-blue-600" />

                  <div>
                    <h2 className="font-semibold text-slate-800">
                      Select Class
                    </h2>

                    <p className="text-xs text-slate-500">
                      View fee records for a particular class.
                    </p>
                  </div>
                </div>

                {classes.length ? (
                  <div className="flex flex-wrap gap-2">
                    {classes.map((className) => (
                      <button
                        key={className}
                        onClick={() => setSelectedClass(className)}
                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                          selectedClass === className
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        {className}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    No classes found.
                  </p>
                )}
              </div>

              {/* SELECTED CLASS */}
              {selectedClass ? (
                <>
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">
                        {selectedClass}
                      </h2>

                      <p className="text-sm text-slate-500">
                        {classStudents.length} student
                        {classStudents.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {/* CLASS SUMMARY */}
                  <div className="mb-6 grid gap-4 sm:grid-cols-3">

                    <SummaryCard
                      icon={<ReceiptText size={18} />}
                      title="Class Total"
                      value={money(classSummary.total)}
                      bg="bg-blue-50"
                      iconColor="text-blue-600"
                    />

                    <SummaryCard
                      icon={<CheckCircle2 size={18} />}
                      title="Class Paid"
                      value={money(classSummary.paid)}
                      bg="bg-emerald-50"
                      iconColor="text-emerald-600"
                    />

                    <SummaryCard
                      icon={<WalletCards size={18} />}
                      title="Class Outstanding"
                      value={money(classSummary.outstanding)}
                      bg="bg-rose-50"
                      iconColor="text-rose-600"
                    />
                  </div>

                  {/* STUDENTS */}
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-5 py-4">
                      <h3 className="font-semibold text-slate-800">
                        Student Fee Records
                      </h3>
                    </div>

                    {classStudents.length ? (
                      <div className="divide-y divide-slate-100">
                        {classStudents.map((student) => {
                          const fee = getCurrentFee(student);

                          const total = Number(fee?.total || 0);
                          const paid = Number(fee?.paid || 0);
                          const outstanding = Math.max(
                            total - paid,
                            0
                          );

                          return (
                            <div
                              key={student._id || student.admissionNo}
                              className="flex flex-col gap-4 p-4 transition hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between"
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                {student?.passportUrl ? (
                                  <img
                                    src={student.passportUrl}
                                    alt=""
                                    className="h-11 w-11 shrink-0 rounded-xl border border-slate-200 object-cover"
                                  />
                                ) : (
                                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                                    <UserRound size={20} />
                                  </div>
                                )}

                                <div className="min-w-0">
                                  <p className="truncate font-semibold text-slate-800">
                                    {getStudentName(student)}
                                  </p>

                                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                                    <span>
                                      {student.admissionNo}
                                    </span>

                                    <span>
                                      {student.regNo || "No Reg. No"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:min-w-[430px]">
                                <FeeMiniStat
                                  title="Total"
                                  value={money(total)}
                                />

                                <FeeMiniStat
                                  title="Paid"
                                  value={money(paid)}
                                  valueClass="text-emerald-600"
                                />

                                <FeeMiniStat
                                  title="Due"
                                  value={money(outstanding)}
                                  valueClass={
                                    outstanding > 0
                                      ? "text-rose-600"
                                      : "text-emerald-600"
                                  }
                                />
                              </div>

                              <button
                                onClick={() => {
                                  openStudent(student);
                                  setView("student");
                                }}
                                className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
                              >
                                View
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-sm text-slate-500">
                        No students found in this class.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                  <School
                    size={30}
                    className="mx-auto mb-3 text-slate-300"
                  />

                  <p className="font-medium text-slate-600">
                    Select a class to view fee records
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Choose one of the available classes above.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* =====================================================
              SINGLE STUDENT VIEW
          ====================================================== */}
          {view === "student" && (
            <motion.div
              key="student-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >

              {/* SEARCH */}
              <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <h2 className="font-semibold text-slate-800">
                    Find Student
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Search using the student's admission number.
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative flex-1">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      value={admissionSearch}
                      onChange={(e) =>
                        setAdmissionSearch(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          goToStudentView();
                        }
                      }}
                      placeholder="Enter admission number e.g. AIA/0002"
                      className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <button
                    onClick={goToStudentView}
                    className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Search Student
                  </button>
                </div>
              </div>

              {selectedStudent ? (
                <>
                  {/* BACK */}
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800"
                  >
                    <ArrowLeft size={17} />
                    Search another student
                  </button>

                  {/* STUDENT PROFILE */}
                  <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
                      {selectedStudent?.passportUrl ? (
                        <img
                          src={selectedStudent.passportUrl}
                          alt=""
                          className="h-24 w-24 rounded-2xl border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                          <UserRound size={34} />
                        </div>
                      )}

                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-slate-800">
                          {getStudentName(selectedStudent)}
                        </h2>

                        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                          <InfoItem
                            label="Admission No"
                            value={selectedStudent.admissionNo}
                          />

                          <InfoItem
                            label="Reg. No"
                            value={
                              selectedStudent.regNo || "N/A"
                            }
                          />

                          <InfoItem
                            label="Class"
                            value={
                              selectedStudent.realClassId || "N/A"
                            }
                          />

                          <InfoItem
                            label="Term"
                            value={`${currentTerm} Term`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* NO FEE */}
                  {!studentFee ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                      <ReceiptText
                        size={32}
                        className="mx-auto mb-3 text-slate-300"
                      />

                      <p className="font-semibold text-slate-700">
                        No fee record found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        There is no fee record for this student
                        in the current term/session.
                      </p>

                      {canManageFinance && (
                        <button
                          onClick={openEditFee}
                          className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white"
                        >
                          Create Fee Breakdown
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* FEE SUMMARY */}
                      <div className="mb-6 grid gap-4 sm:grid-cols-3">

                        <SummaryCard
                          icon={<ReceiptText size={19} />}
                          title="Total Fee"
                          value={money(studentTotal)}
                          bg="bg-blue-50"
                          iconColor="text-blue-600"
                        />

                        <SummaryCard
                          icon={<CheckCircle2 size={19} />}
                          title="Paid"
                          value={money(studentPaid)}
                          bg="bg-emerald-50"
                          iconColor="text-emerald-600"
                        />

                        <SummaryCard
                          icon={<WalletCards size={19} />}
                          title="Outstanding"
                          value={money(studentOutstanding)}
                          bg="bg-rose-50"
                          iconColor="text-rose-600"
                        />
                      </div>

                      {/* FEE DETAILS */}
                      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">

                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                          <div className="flex items-center justify-between border-b border-slate-200 p-5">
                            <div>
                              <h3 className="font-semibold text-slate-800">
                                Fee Breakdown
                              </h3>

                              <p className="mt-1 text-xs text-slate-500">
                                {currentTerm} Term •{" "}
                                {currentSession}
                              </p>
                            </div>

                            {canManageFinance && (
                              <button
                                onClick={openEditFee}
                                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                              >
                                <Pencil size={15} />
                                Edit
                              </button>
                            )}
                          </div>

                          <div className="divide-y divide-slate-100">
                            {studentFee?.breakdown?.length ? (
                              studentFee.breakdown.map(
                                (item, index) => (
                                  <div
                                    key={`${item.title}-${index}`}
                                    className="flex items-center justify-between gap-4 px-5 py-4"
                                  >
                                    <span className="text-sm text-slate-600">
                                      {item.title}
                                    </span>

                                    <span className="text-sm font-semibold text-slate-800">
                                      {money(item.amount)}
                                    </span>
                                  </div>
                                )
                              )
                            ) : (
                              <div className="p-5 text-sm text-slate-500">
                                No fee breakdown available.
                              </div>
                            )}

                            <div className="flex items-center justify-between bg-slate-50 px-5 py-4">
                              <span className="text-sm font-bold text-slate-700">
                                Total
                              </span>

                              <span className="text-base font-bold text-slate-900">
                                {money(studentTotal)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* PAYMENT ACTION */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                          <div className="mb-5">
                            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                              <CreditCard size={20} />
                            </div>

                            <h3 className="font-semibold text-slate-800">
                              Payment
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              Record a payment for this student's
                              current fee.
                            </p>
                          </div>

                          <div className="mb-5 rounded-xl bg-rose-50 p-4">
                            <p className="text-xs font-medium text-rose-600">
                              Outstanding
                            </p>

                            <p className="mt-1 text-xl font-bold text-rose-700">
                              {money(studentOutstanding)}
                            </p>
                          </div>

                          <button
                            onClick={openPayment}
                            disabled={
                              !canManageFinance ||
                              studentOutstanding <= 0
                            }
                            className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                              canManageFinance &&
                              studentOutstanding > 0
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "cursor-not-allowed bg-slate-100 text-slate-400"
                            }`}
                          >
                            <CreditCard size={17} />
                            {studentOutstanding <= 0
                              ? "Fully Paid"
                              : "Record Payment"}
                          </button>

                          {!canManageFinance && (
                            <p className="mt-3 text-center text-xs text-amber-600">
                              You do not have finance management
                              permission.
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                  <Search
                    size={34}
                    className="mx-auto mb-3 text-slate-300"
                  />

                  <p className="font-semibold text-slate-700">
                    Search for a student
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter an admission number above to view the
                    student's fee.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =========================================================
          PAYMENT MODAL
      ========================================================== */}
      <AnimatePresence>
        {paymentOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="w-full max-w-md rounded-2xl bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h3 className="font-bold text-slate-800">
                    Record Payment
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {selectedStudent?.admissionNo}
                  </p>
                </div>

                <button
                  onClick={() => setPaymentOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="space-y-4 p-5">

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">
                      Outstanding
                    </span>

                    <span className="font-bold text-rose-600">
                      {money(studentOutstanding)}
                    </span>
                  </div>
                </div>

                {/* METHOD */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    Payment Method
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    <PaymentMethod
                      active={paymentMethod === "cash-at-hand"}
                      icon={<Banknote size={17} />}
                      label="Cash"
                      onClick={() =>
                        setPaymentMethod("cash-at-hand")
                      }
                    />

                    <PaymentMethod
                      active={paymentMethod === "bank-transfer"}
                      icon={<CreditCard size={17} />}
                      label="Transfer"
                      onClick={() =>
                        setPaymentMethod("bank-transfer")
                      }
                    />

                    <PaymentMethod
                      active={paymentMethod === "online"}
                      icon={<WalletCards size={17} />}
                      label="Online"
                      onClick={() =>
                        setPaymentMethod("online")
                      }
                    />
                  </div>
                </div>

                {/* AMOUNT */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    Amount
                  </label>

                  <input
                    type="number"
                    min="1"
                    max={studentOutstanding}
                    value={paymentAmount}
                    onChange={(e) =>
                      setPaymentAmount(e.target.value)
                    }
                    placeholder="Enter payment amount"
                    className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-1 text-[11px] text-slate-400">
                    Maximum: {money(studentOutstanding)}
                  </p>
                </div>

                {/* ONLINE TOKEN */}
                {paymentMethod === "online" && (
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Online Token
                    </label>

                    <input
                      type="text"
                      value={onlineToken}
                      onChange={(e) =>
                        setOnlineToken(e.target.value)
                      }
                      placeholder="Enter online token"
                      className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <p className="mt-1 text-[11px] text-slate-400">
                      Token validation is currently handled
                      locally.
                    </p>
                  </div>
                )}

                {/* COMMENT */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    Comment
                  </label>

                  <textarea
                    value={paymentComment}
                    onChange={(e) =>
                      setPaymentComment(e.target.value)
                    }
                    rows={3}
                    placeholder="Optional payment comment..."
                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <button
                  onClick={submitPayment}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <CheckCircle2 size={17} />
                  Confirm Payment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          EDIT FEE MODAL
      ========================================================== */}
      <AnimatePresence>
        {editFeeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h3 className="font-bold text-slate-800">
                    Edit Fee Breakdown
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {selectedStudent?.admissionNo} •{" "}
                    {currentTerm} Term
                  </p>
                </div>

                <button
                  onClick={() => setEditFeeOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="max-h-[65vh] overflow-y-auto p-5">

                <div className="space-y-3">
                  {editedBreakdown.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="flex gap-2">
                        <input
                          value={item.title}
                          onChange={(e) =>
                            updateBreakdownItem(
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="Fee title"
                          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />

                        <input
                          type="number"
                          min="0"
                          value={item.amount}
                          onChange={(e) =>
                            updateBreakdownItem(
                              index,
                              "amount",
                              e.target.value
                            )
                          }
                          placeholder="Amount"
                          className="w-32 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />

                        <button
                          onClick={() =>
                            removeBreakdownItem(index)
                          }
                          className="rounded-lg p-2.5 text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addBreakdownItem}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Plus size={17} />
                  Add Fee Item
                </button>

                {/* LIVE TOTAL */}
                <div className="mt-5 flex items-center justify-between rounded-xl bg-blue-50 p-4">
                  <span className="text-sm font-semibold text-blue-700">
                    New Total
                  </span>

                  <span className="text-lg font-bold text-blue-800">
                    {money(
                      editedBreakdown.reduce(
                        (sum, item) =>
                          sum + (Number(item.amount) || 0),
                        0
                      )
                    )}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 border-t border-slate-200 p-5">
                <button
                  onClick={() => setEditFeeOpen(false)}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={saveFeeUpdate}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


/* =============================================================
   SMALL UI COMPONENTS
============================================================= */

function SummaryCard({
  icon,
  title,
  value,
  bg,
  iconColor,
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className={`rounded-xl p-2.5 ${bg} ${iconColor}`}>
          {icon}
        </div>

        <div>
          <p className="text-xs font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-1 text-lg font-bold text-slate-800">
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function FeeMiniStat({
  title,
  value,
  valueClass = "text-slate-800",
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className={`mt-1 text-xs font-bold sm:text-sm ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 truncate text-sm font-medium text-slate-700">
        {value || "N/A"}
      </p>
    </div>
  );
}

function PaymentMethod({
  active,
  icon,
  label,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border px-2 py-3 text-xs font-medium transition ${
        active
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-slate-200 text-slate-500 hover:bg-slate-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}


import { CheckCircle, Receipt, User, CalendarDays } from "lucide-react";

function PaymentCard({ data }) {
  if (!data) return null;

  const money = (amount) =>
    `₦${Number(amount || 0).toLocaleString()}`;

  return (
    <div className="my-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <CheckCircle size={22} className="text-green-600" />
        </div>

        <div>
          <h3 className="font-semibold text-gray-800">
            Payment Recorded
          </h3>
          <p className="text-xs text-gray-500">
            {data.paymentId}
          </p>
        </div>
      </div>

      {/* Student Info */}
      <div className="grid grid-cols-2 gap-3 py-4 text-sm">
        <div className="flex items-center gap-2">
          <User size={16} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Admission No.</p>
            <p className="font-medium text-gray-800">
              {data.admissionNo}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500">Class</p>
          <p className="font-medium text-gray-800">
            {data.classId}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Term / Session</p>
            <p className="font-medium text-gray-800">
              {data.term} • {data.session}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Receipt size={16} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Payment</p>
            <p className="font-semibold text-gray-800">
              {money(data.paymentAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="rounded-lg bg-gray-50 p-3">
        <div className="flex justify-between py-1 text-sm">
          <span className="text-gray-500">Previous Paid</span>
          <span>{money(data.previousPaid)}</span>
        </div>

        <div className="flex justify-between py-1 text-sm">
          <span className="font-medium text-gray-700">New Paid</span>
          <span className="font-semibold text-gray-800">
            {money(data.newPaid)}
          </span>
        </div>

        <div className="mt-2 flex justify-between border-t border-gray-200 pt-2">
          <span className="font-medium text-gray-700">
            Outstanding
          </span>

          <span className="font-bold text-red-600">
            {money(data.outstanding)}
          </span>
        </div>

        <div className="flex justify-between pt-1 text-sm">
          <span className="text-gray-500">Total Fee</span>
          <span className="font-medium">
            {money(data.total)}
          </span>
        </div>
      </div>

      {/* Comment */}
      {data.comment && (
        <div className="mt-3">
          <p className="text-xs text-gray-500">Comment</p>
          <p className="text-sm text-gray-700">
            {data.comment}
          </p>
        </div>
      )}

      {/* Status */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle size={17} className="text-green-600" />
          <span className="font-medium text-green-700">
            Payment successful
          </span>
        </div>

        <span className="text-xs text-gray-500">
          Staff: {data.staffId}
        </span>
      </div>
    </div>
  );
}
export default AdminFeePage;