

let info = {
    heroMessages: [
        {
            head: "Manage your Documents with Ease",
            desc: "Attach verification means to make documents authentic",
            photoUrl: "",
            linkTo: ""
        },
        {
            head: "Generate and Manage E-reciepts for your Local Business Transactions",
            desc: "Have a copies of reciepts store online. Create a custom reciept template or generate one",
            photoUrl: "",
            linkTo: ""
        },
        {
            head: "Create and Sell Authenticated Events Tickets",
            desc: "You can get your events easily with create tickets for your events and share the links",
            photoUrl: "",
            linkTo: ""
        },
        {
            head: "Easy verification via QR-Code/Bar Code",
            desc: "All documents can be easily verified just by scanning, share links and also get reviews on tickets, no fear of loss",
            photoUrl: "",
            linkTo: ""
        },   
    ]
};


const classrooms = [
    {
        classId: "JSS1 A", mainClass: "JSS1", arm: "A", dept: ""
    },
    {
        classId: "JSS1 B", mainClass: "JSS1", arm: "B", dept: ""
    },
    {
        classId: "JSS1 C", mainClass: "JSS1", arm: "C", dept: ""
    },
    {
        classId: "JSS2 A", mainClass: "JSS2", arm: "A", dept: ""
    },
    {
        classId: "JSS2 B", mainClass: "JSS2", arm: "B", dept: ""
    },
    {
        classId: "JSS3", mainClass: "JSS3", arm: "", dept: ""
    },
    {
        classId: "SS1 SCI", mainClass: "SS1", arm: "", dept: "SCI"
    },
    {
        classId: "SS1 ART", mainClass: "SS1", arm: "", dept: "ART"
    }
]

export {classrooms};

export const schoolMainClasses = [
    "Basic 1", "Basic 2", "Basic 3", "Basic 4", "Basic 5", "Basic 6", "Basic 7", "Basic 8", "Basic 9", "SSS 1", "SSS 2", "SSS 3"
];


const timer = (days) => {
    let expiresIn = 1*24*60*60*1000

    return expiresIn;
}

export {timer};

export const initialApplicants = [
  {
    _id: "app_001",
    regNo: "AIS/2026/001",
    fullName: "Adebayo Chukwuemeka",
    gender: "Male",
    streamId: "2026-2027",
    admissionNo: "",
    status: "under review",
    feePaid: true,
    examinationDetails: {
      status: "pending",
      score: 0,
      rating: 0,
      seatNo: "ST-001",
      examDate: "Saturday, Aug 15, 2026",
      examVenue: "Main Hall A",
    },
  },
  {
    _id: "app_002",
    regNo: "AIS/2026/002",
    fullName: "Fatima Zainab Bello",
    gender: "Female",
    streamId: "2026-2027",
    admissionNo: "",
    status: "processing",
    feePaid: true,
    examinationDetails: {
      status: "pending",
      score: 0,
      rating: 0,
      seatNo: "ST-002",
      examDate: "Saturday, Aug 15, 2026",
      examVenue: "Main Hall A",
    },
  },
  {
    _id: "app_003",
    regNo: "AIS/2026/003",
    fullName: "Oluwaseun David Titilope",
    gender: "Male",
    streamId: "2026-2027",
    admissionNo: "ADM/2026/089",
    status: "admitted",
    feePaid: true,
    examinationDetails: {
      status: "result out",
      score: 84.5,
      rating: 4,
      seatNo: "ST-003",
      examDate: "Saturday, Aug 15, 2026",
      examVenue: "Science Lab 2",
    },
  },
  {
    _id: "app_004",
    regNo: "AIS/2026/004",
    fullName: "Chioma Deborah Okonkwo",
    gender: "Female",
    streamId: "2026-2027",
    admissionNo: "",
    status: "not admitted",
    feePaid: true,
    examinationDetails: {
      status: "absent",
      score: 0,
      rating: 0,
      seatNo: "ST-004",
      examDate: "Saturday, Aug 15, 2026",
      examVenue: "Science Lab 2",
    },
  },
];

export function totalFee({arr}){
    return typeof(arr)
    const init = 0
    for (let i = 0; i < arr.length; i++) {
        const elm = arr[i];
        init += elm.feeInfo.total
    }
    return init;

}


export const saveProgress = (user) => {
    const time = new Date().getTime();
    user.date = time;
    localStorage.setItem("logged-user", JSON.stringify(user));
}

export const gradeScaleI = [
    {min: 0, max: 29, grade: "F", remark: "Failed", short: "Fail"},
    {min: 30, max: 39, grade: "E", remark: "Fair", short: "Fair"},
    {min: 40, max: 49, grade: "D", remark: "Pass", short: "Pass"},
    {min: 50, max: 59, grade: "C", remark: "Credit", short: "Credt"},
    {min: 60, max: 69, grade: "B", remark: "Good", short: "Good"},
    {min: 70, max: 100, grade: "A", remark: "Excellent", short: "Excl"}
]

export const gradeScaleII = [
  { min: 75, max: 100, grade: "A1", remark: "Excellent", short: "Excellent" },
  { min: 70, max: 74, grade: "B2", remark: "Very Good", short: "V. Good" },
  { min: 65, max: 69, grade: "B3", remark: "Good", short: "Good" },
  { min: 60, max: 64, grade: "C4", remark: "Credit", short: "Credit" },
  { min: 55, max: 59, grade: "C5", remark: "Credit", short: "Credit" },
  { min: 50, max: 54, grade: "C6", remark: "Credit", short: "Credit" },
  { min: 45, max: 49, grade: "D7", remark: "Pass", short: "Pass" },
  { min: 40, max: 44, grade: "E8", remark: "Pass", short: "Pass" },
  { min: 0, max: 39, grade: "F9", remark: "Fail", short: "Fail" },
];

export const gradeScaleIII = [
  { min: 80, max: 100, grade: "A1", remark: "Outstanding", short: "Outstanding" },
  { min: 75, max: 79, grade: "A2", remark: "Excellent", short: "Excellent" },
  { min: 70, max: 74, grade: "B1", remark: "Very Good", short: "V. Good" },
  { min: 65, max: 69, grade: "B2", remark: "Good", short: "Good" },
  { min: 60, max: 64, grade: "C1", remark: "Credit", short: "Credit" },
  { min: 55, max: 59, grade: "C2", remark: "Credit", short: "Credit" },
  { min: 50, max: 54, grade: "D", remark: "Pass", short: "Pass" },
  { min: 40, max: 49, grade: "E", remark: "Weak Pass", short: "W. Pass" },
  { min: 0, max: 39, grade: "F", remark: "Fail", short: "Fail" },
];


// mockAttendance.js

export const mockStudents = [
    {
        regNo: "REG/2026/001",
        admissionNo: "ADM/001",
        fullname: "Daniel Betiku",
        classId: "Basic 7A",
        passportUrl: "",
    },
    {
        regNo: "REG/2026/002",
        admissionNo: "ADM/002",
        fullname: "Deborah Betiku",
        classId: "Basic 5B",
        passportUrl: "",
    },
];

export const mockAttendance = [
    // =========================
    // DANIEL - WEEK 1
    // =========================
    {
        _id: "ATT-001",
        regNo: "REG/2026/001",
        week: 1,
        classId: "Basic 7A",
        day: "Monday",
        dated: "2026-09-07",
        mor: true,
        aft: true,
        term: "First Term",
        session: "2026/2027",
    },
    {
        _id: "ATT-002",
        regNo: "REG/2026/001",
        week: 1,
        classId: "Basic 7A",
        day: "Tuesday",
        dated: "2026-09-08",
        mor: true,
        aft: true,
        term: "First Term",
        session: "2026/2027",
    },
    {
        _id: "ATT-003",
        regNo: "REG/2026/001",
        week: 1,
        classId: "Basic 7A",
        day: "Wednesday",
        dated: "2026-09-09",
        mor: true,
        aft: false,
        term: "First Term",
        session: "2026/2027",
    },
    {
        _id: "ATT-004",
        regNo: "REG/2026/001",
        week: 1,
        classId: "Basic 7A",
        day: "Thursday",
        dated: "2026-09-10",
        mor: true,
        aft: true,
        term: "First Term",
        session: "2026/2027",
    },
    {
        _id: "ATT-005",
        regNo: "REG/2026/001",
        week: 1,
        classId: "Basic 7A",
        day: "Friday",
        dated: "2026-09-11",
        mor: true,
        aft: true,
        term: "First Term",
        session: "2026/2027",
    },

    // =========================
    // DANIEL - WEEK 2
    // =========================
    {
        _id: "ATT-006",
        regNo: "REG/2026/001",
        week: 2,
        classId: "Basic 7A",
        day: "Monday",
        dated: "2026-09-14",
        mor: true,
        aft: true,
        term: "First Term",
        session: "2026/2027",
    },
    {
        _id: "ATT-007",
        regNo: "REG/2026/001",
        week: 2,
        classId: "Basic 7A",
        day: "Tuesday",
        dated: "2026-09-15",
        mor: true,
        aft: true,
        term: "First Term",
        session: "2026/2027",
    },
    {
        _id: "ATT-008",
        regNo: "REG/2026/001",
        week: 2,
        classId: "Basic 7A",
        day: "Wednesday",
        dated: "2026-09-16",
        mor: false,
        aft: false,
        term: "First Term",
        session: "2026/2027",
    },
    {
        _id: "ATT-009",
        regNo: "REG/2026/001",
        week: 2,
        classId: "Basic 7A",
        day: "Thursday",
        dated: "2026-09-17",
        mor: true,
        aft: true,
        term: "First Term",
        session: "2026/2027",
    },
    {
        _id: "ATT-010",
        regNo: "REG/2026/001",
        week: 2,
        classId: "Basic 7A",
        day: "Friday",
        dated: "2026-09-18",
        mor: true,
        aft: false,
        term: "First Term",
        session: "2026/2027",
    },

    // =========================
    // DEBORAH - WEEK 1
    // =========================
    {
        _id: "ATT-011",
        regNo: "REG/2026/002",
        week: 1,
        classId: "Basic 5B",
        day: "Monday",
        dated: "2026-09-07",
        mor: true,
        aft: true,
        term: "First Term",
        session: "2026/2027",
    },
    {
        _id: "ATT-012",
        regNo: "REG/2026/002",
        week: 1,
        classId: "Basic 5B",
        day: "Tuesday",
        dated: "2026-09-08",
        mor: true,
        aft: true,
        term: "First Term",
        session: "2026/2027",
    },
    {
        _id: "ATT-013",
        regNo: "REG/2026/002",
        week: 1,
        classId: "Basic 5B",
        day: "Wednesday",
        dated: "2026-09-09",
        mor: true,
        aft: true,
        term: "First Term",
        session: "2026/2027",
    },
    {
        _id: "ATT-014",
        regNo: "REG/2026/002",
        week: 1,
        classId: "Basic 5B",
        day: "Thursday",
        dated: "2026-09-10",
        mor: true,
        aft: false,
        term: "First Term",
        session: "2026/2027",
    },
    {
        _id: "ATT-015",
        regNo: "REG/2026/002",
        week: 1,
        classId: "Basic 5B",
        day: "Friday",
        dated: "2026-09-11",
        mor: true,
        aft: true,
        term: "First Term",
        session: "2026/2027",
    },
];