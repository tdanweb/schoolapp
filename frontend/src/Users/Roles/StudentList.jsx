import { useMemo, useState } from "react";
import { mainApi } from "../../api";

const api = `${mainApi}/students/work/:${"Basic 7B"}`;
import {
  FiSearch,
  FiUsers,
  FiPhone,
  FiHash,
  FiCreditCard,
  FiEye,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";


// ======================================================
// API
// ======================================================




// ======================================================
// MOCK STUDENT DATA
// ======================================================

const mockStudents = [
  {
    _id: "student001",

    fullname: "Amaka Grace Okafor",

    passportUrl: "/passport.png",

    regNo: "STU/2026/001",
    admissionNo: "ADM/2026/001",

    phone: "08031234567",

    currentFee: [
      {
        total: 185000,
        session: "2025/2026",
        term: "Third",
        paid: 125000,
      },
    ],

    status: "active",
  },

  {
    _id: "student002",

    fullname: "Daniel Michael Adeyemi",

    passportUrl: "/passport.png",

    regNo: "STU/2026/002",
    admissionNo: "ADM/2026/002",

    phone: "08145678901",

    currentFee: [
      {
        total: 185000,
        session: "2025/2026",
        term: "Third",
        paid: 185000,
      },
    ],

    status: "active",
  },

  {
    _id: "student003",

    fullname: "Chiamaka Blessing Eze",

    passportUrl: "/passport.png",

    regNo: "STU/2026/003",
    admissionNo: "ADM/2026/003",

    phone: "07012345678",

    currentFee: [
      {
        total: 185000,
        session: "2025/2026",
        term: "Third",
        paid: 75000,
      },
    ],

    status: "active",
  },

  {
    _id: "student004",

    fullname: "Samuel David Williams",

    passportUrl: "/passport.png",

    regNo: "STU/2026/004",
    admissionNo: "ADM/2026/004",

    phone: "09098765432",

    currentFee: [
      {
        total: 185000,
        session: "2025/2026",
        term: "Third",
        paid: 150000,
      },
    ],

    status: "active",
  },

  {
    _id: "student005",

    fullname: "Esther Favour Johnson",

    passportUrl: "/passport.png",

    regNo: "STU/2026/005",
    admissionNo: "ADM/2026/005",

    phone: "08076543210",

    currentFee: [
      {
        total: 185000,
        session: "2025/2026",
        term: "Third",
        paid: 0,
      },
    ],

    status: "active",
  },
];


// ======================================================
// FORMAT CURRENCY
// ======================================================

function formatCurrency(amount = 0) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}


// ======================================================
// GET CURRENT FEE
// ======================================================
//
// Backend will eventually send the configured
// current session/term fee.
//
// For now, we simply use the first item.
//
// Later we can filter using the current session + term.
//

function getCurrentFee(student) {
  return student?.currentFee?.[0] || {
    total: 0,
    paid: 0,
  };
}


// ======================================================
// GET BALANCE
// ======================================================

function getBalance(student) {
  const fee = getCurrentFee(student);

  return Math.max(
    Number(fee?.total || 0) -
    Number(fee?.paid || 0),
    0
  );
}


// ======================================================
// STATUS BADGE
// ======================================================

function FeeStatus({ student }) {

  const balance = getBalance(student);

  if (balance <= 0) {
    return (
      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        Paid
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
      Balance Due
    </span>
  );
}


// ======================================================
// STUDENT ROW
// ======================================================

function StudentRow({
  student,
  onView,
}) {

  const fee = getCurrentFee(student);

  const balance = getBalance(student);


  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50">

      {/* PASSPORT */}

      <td className="px-5 py-4">

        <img
          src={student?.passportUrl || "/passport.png"}
          alt={student?.fullname || "Student"}
          className="h-11 w-11 rounded-full border border-slate-200 object-cover"
          onError={(e) => {
            e.currentTarget.src = "/passport.png";
          }}
        />

      </td>


      {/* FULLNAME */}

      <td className="px-5 py-4">

        <div className="min-w-[180px]">

          <p className="font-semibold text-slate-800">
            {student?.fullname || "Unnamed Student"}
          </p>

          <FeeStatus student={student} />

        </div>

      </td>


      {/* REG NO */}

      <td className="px-5 py-4">

        <div className="flex items-center gap-2 whitespace-nowrap text-sm text-slate-600">

          <FiHash className="text-slate-400" />

          {student?.regNo || "—"}

        </div>

      </td>


      {/* ADMISSION NO */}

      <td className="px-5 py-4">

        <div className="flex items-center gap-2 whitespace-nowrap text-sm text-slate-600">

          <FiCreditCard className="text-slate-400" />

          {student?.admissionNo || "—"}

        </div>

      </td>


      {/* PHONE */}

      <td className="px-5 py-4">

        <div className="flex items-center gap-2 whitespace-nowrap text-sm text-slate-600">

          <FiPhone className="text-slate-400" />

          {student?.phone || "—"}

        </div>

      </td>


      {/* TOTAL */}

      <td className="px-5 py-4">

        <span className="whitespace-nowrap text-sm font-semibold text-slate-800">

          {formatCurrency(fee?.total)}

        </span>

      </td>


      {/* BALANCE */}

      <td className="px-5 py-4">

        <span
          className={`
            whitespace-nowrap text-sm font-bold
            ${
              balance > 0
                ? "text-amber-600"
                : "text-emerald-600"
            }
          `}
        >

          {formatCurrency(balance)}

        </span>

      </td>


      {/* ACTION */}

      <td className="px-5 py-4">

        <button
          type="button"
          onClick={() => onView(student)}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        >

          <FiEye />

          View

        </button>

      </td>

    </tr>
  );
}


// ======================================================
// MAIN COMPONENT
// ======================================================

export default function StudentList() {

  const [students, setStudents] = useState(mockStudents);
  const api4Get = api + "Basic 7A"
  const [search, setSearch] = useState("");

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [showStats, setShowStats] =
    useState(true);


  // ====================================================
  // SEARCH
  // ====================================================

  const filteredStudents = useMemo(() => {

    const keyword = search
      .trim()
      .toLowerCase();

    if (!keyword) {
      return students;
    }

    return students.filter((student) => {

      return (
        student?.fullname
          ?.toLowerCase()
          .includes(keyword) ||

        student?.regNo
          ?.toLowerCase()
          .includes(keyword) ||

        student?.admissionNo
          ?.toLowerCase()
          .includes(keyword) ||

        student?.phone
          ?.toLowerCase()
          .includes(keyword)
      );

    });

  }, [students, search]);


  // ====================================================
  // SUMMARY
  // ====================================================

  const totalStudents = students.length;

  const totalExpected = students.reduce(
    (sum, student) =>
      sum + Number(
        getCurrentFee(student)?.total || 0
      ),
    0
  );

  const totalPaid = students.reduce(
    (sum, student) =>
      sum + Number(
        getCurrentFee(student)?.paid || 0
      ),
    0
  );

  const totalBalance = students.reduce(
    (sum, student) =>
      sum + getBalance(student),
    0
  );


  // ====================================================
  // FUTURE API
  // ====================================================

  /*
  async function getStudents() {

    try {

      const res = await axios.get(api);

      setStudents(res.data.students || []);

    } catch (error) {

      console.error(
        "Unable to fetch students",
        error
      );

    }

  }

  useEffect(() => {
    getStudents();
  }, []);

  */


  return (

    <div className="min-h-screen bg-slate-100 p-4 md:p-6 lg:p-8">

      <div className="mx-auto max-w-7xl">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm">

                <FiUsers size={21} />

              </div>

              <div>

                <h1 className="text-2xl font-bold text-slate-900">
                  Student List
                </h1>

                <p className="text-sm text-slate-500">
                  Basic 7B
                </p>

              </div>

            </div>

          </div>


          {/* SEARCH */}

          <div className="relative w-full md:w-80">

            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search student..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

        </div>


        {/* =================================================
            SUMMARY TOGGLE
        ================================================= */}

        <div className="mb-4">

          <button
            type="button"
            onClick={() =>
              setShowStats((prev) => !prev)
            }
            className="flex items-center gap-2 text-sm font-semibold text-slate-600"
          >

            {showStats
              ? <FiChevronUp />
              : <FiChevronDown />
            }

            Class Summary

          </button>

        </div>


        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        {showStats && (

          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


            {/* STUDENTS */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Students
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {totalStudents}
                  </p>

                </div>

                <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                  <FiUsers />
                </div>

              </div>

            </div>


            {/* EXPECTED */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Total Fees
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {formatCurrency(totalExpected)}
                  </p>

                </div>

                <div className="rounded-xl bg-purple-50 p-3 text-purple-700">
                  <FiCreditCard />
                </div>

              </div>

            </div>


            {/* PAID */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Paid
                  </p>

                  <p className="mt-1 text-xl font-bold text-emerald-600">
                    {formatCurrency(totalPaid)}
                  </p>

                </div>

                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                  <FiCreditCard />
                </div>

              </div>

            </div>


            {/* BALANCE */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Outstanding
                  </p>

                  <p className="mt-1 text-xl font-bold text-amber-600">
                    {formatCurrency(totalBalance)}
                  </p>

                </div>

                <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
                  <FiCreditCard />
                </div>

              </div>

            </div>

          </div>

        )}


        {/* =================================================
            TABLE CARD
        ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


          {/* TABLE HEADER */}

          <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="font-bold text-slate-900">
                Basic 7B Students
              </h2>

              <p className="mt-1 text-xs text-slate-500">

                Showing {filteredStudents.length} of{" "}
                {students.length} students

              </p>

            </div>

          </div>


          {/* =================================================
              RESPONSIVE TABLE
          ================================================= */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1050px] text-left">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Passport
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Student
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Reg No.
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Admission No.
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Phone
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Total Fee
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Balance
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredStudents.length > 0 ? (

                  filteredStudents.map((student) => (

                    <StudentRow
                      key={student?._id}
                      student={student}
                      onView={setSelectedStudent}
                    />

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="8"
                      className="px-5 py-16 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <FiUsers
                          size={35}
                          className="text-slate-300"
                        />

                        <p className="mt-3 font-semibold text-slate-600">
                          No students found
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          Try another search term.
                        </p>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>


      {/* ===================================================
          STUDENT QUICK VIEW
      =================================================== */}

      {selectedStudent && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          onClick={() =>
            setSelectedStudent(null)
          }
        >

          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="flex items-center gap-4">

              <img
                src={
                  selectedStudent?.passportUrl ||
                  "/passport.png"
                }
                alt={selectedStudent?.fullname}
                className="h-16 w-16 rounded-xl object-cover"
              />

              <div>

                <h3 className="font-bold text-slate-900">
                  {selectedStudent?.fullname}
                </h3>

                <p className="text-sm text-slate-500">
                  {selectedStudent?.regNo}
                </p>

              </div>

            </div>


            <div className="mt-6 space-y-4">


              <div className="flex justify-between border-b border-slate-100 pb-3">

                <span className="text-sm text-slate-500">
                  Admission No.
                </span>

                <span className="text-sm font-semibold text-slate-800">
                  {selectedStudent?.admissionNo || "—"}
                </span>

              </div>


              <div className="flex justify-between border-b border-slate-100 pb-3">

                <span className="text-sm text-slate-500">
                  Phone
                </span>

                <span className="text-sm font-semibold text-slate-800">
                  {selectedStudent?.phone || "—"}
                </span>

              </div>


              <div className="flex justify-between border-b border-slate-100 pb-3">

                <span className="text-sm text-slate-500">
                  Total Fee
                </span>

                <span className="text-sm font-semibold text-slate-800">
                  {formatCurrency(
                    getCurrentFee(selectedStudent)?.total
                  )}
                </span>

              </div>


              <div className="flex justify-between">

                <span className="text-sm text-slate-500">
                  Balance
                </span>

                <span className="text-sm font-bold text-amber-600">
                  {formatCurrency(
                    getBalance(selectedStudent)
                  )}
                </span>

              </div>

            </div>


            <button
              type="button"
              onClick={() =>
                setSelectedStudent(null)
              }
              className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}