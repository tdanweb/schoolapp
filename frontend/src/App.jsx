import React, {useState, useEffect, useRef} from "react"
import { Route, Routes, useNavigate, Link } from "react-router-dom"
import TourSchool from "./Pages/Tour"
import HomePage, { HomeView } from "./Pages/HomePage"
import ChiefSettingUI, { TermInfo } from "./Users/ChiefAdmin/GeneralSetting"
import UserPortals, { AddDocuments, DashboardHome, ProtectPortal} from "./Users/ChiefAdmin/UserPortal"
import LandingPage, { UserForm } from "./Pages/LandPage"
import { ViewUser } from "./Users/ChiefAdmin/ManageUser"
import Setting2 from "./Users/ChiefAdmin/Setting2"
import EnrolStaff from "./Users/ChiefAdmin/StaffEnrol"
import SetStaffRoles from "./Users/ChiefAdmin/AssignStaff"
import AdmissionPage from "./Admission/AdmissionPage"
import { GiveAdmission, ManageApplicants } from "./Users/ManageAdmission"
import { AssignExamDetails } from "./Users/ChiefAdmin/AssignApplicant"
import { ManageAdmission, ManageResultsAndAdmission } from "./Users/ChiefAdmin/ManageResultAndAdmission"
import ProfileView from "./Users/StudentProfile"
import StaffParentProfile from "./Users/StaffParentProfile"
import StudentLIST from "./Users/Roles/StudentsLIST"
import ApplicantPortal from "./Admission/ApplicantPortal"
import ApplicantHome from "./Admission/ApplicantHome"
import ApplicationFee from "./Admission/Payment"
import ResultEntry from "./Users/Roles/ResultUpload"
import ApplicantFAQs, { ApplicantContact } from "./Admission/FAQs"
import EntranceExam from "./Admission/ApplicantExam"
import AdmissionStatus from "./Admission/Status"
import ManageStaff from "./Users/ManageStaff"
import Updates from "./Users/Updates"
import StaffList from "./Users/ChiefAdmin/StaffList"
import { ResultPage } from "./Users/Roles/ResultsView"
import ApplicantRegPage from "./Admission/ApplicantReg"
import ManageResultPins from "./Users/ChiefAdmin/ManageResultPins"
import Academics from "./Pages/Academics"
import Posts, { SinglePost } from "./Pages/Postpage"
import ManagePosts from "./Users/Poster"
import StudentAttendance from "./Users/Student/Attendance"
import Inbox from "./Users/Inbox"
import { ParentStudentProfile } from "./Users/Parent-Student-Profile"
import { Timetable } from "./Users/UnderDevCompo"
import Fee_Finance from "./Users/Fees&Payment"
import Letter from "./Admission/Letter"
import AdmissionLetter from "./Admission/Letter"
import { ProtectedAccount } from "./Users/Protected"
import StudentRegistrationForm from "./Users/StudentRegForm"
import AdminAuth, { AccessDenied } from "./Users/ChiefAdmin/AdminAuth"
import { WeeklyCA } from "./Users/ChiefAdmin/ManageCA"
import WeeklyCAView from "./Users/Student/CAView"
import WardPerformance from "./Users/Parent/WardPerformance"


function App() {
  const [userLogged, setUserLogged] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("logged-user"));
    if(user) setUserLogged(true);
  }, []);

  return (
    <>
          <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/admission-letter/:id" element={<AdmissionLetter/>}/>
            <Route path="/tour" element={<TourSchool/>}/>
            <Route path="/academics" element={<Academics/>}/>
            <Route path="/sign-in" element={<UserForm/>}/>
            <Route path="/blog" element={<h4>blog Posting to Appear here....</h4>}/>
            <Route path="/calendar" element={<TermInfo/>}/>




          <Route element={<ProtectedAccount/>}>
            <Route path="/app/*" element={<HomePage/>}>
              <Route index element={<HomeView/>}/>
              <Route path="blog/*" element={<Posts/>}>
               <Route path="one/:id" element={<SinglePost/>}/>
              </Route>
              <Route path="tour" element={<TourSchool/>}/>
              <Route path="academics" element={<Academics/>}/>
            </Route>

            <Route path="/app/user/*" element={<UserPortals/>}>
              {
                //work on notifications and profile view page later
              }
              <Route path="posts" element={<ManagePosts/>}/>
              <Route path="results" element={<ResultEntry/>}/>
              <Route path="weekly-ca" element={<WeeklyCA/>}/>
              <Route path="attendance" element={<StudentAttendance/>}/>
              <Route path="performance" element={<WeeklyCAView/>}/>
              <Route path="inbox" element={<Inbox/>}/>
              <Route path="document" element={<AddDocuments/>}/>
              <Route path="calendar" element={<TermInfo/>}/>
              <Route path="stu-list" element={<StudentLIST/>}/>
              <Route path="admin-setting/:id" element={<ChiefSettingUI/>}/>
              <Route index element={<DashboardHome/>}/>
              <Route path="profile" element={<StaffParentProfile/>}/>
              <Route path="parent-student" element={<ParentStudentProfile/>}/>
              <Route path="home" element={<DashboardHome/>}/>
              <Route path="set-subject" element={<Setting2/>}/>
              <Route path="users"
               element={ <AdminAuth permission={"canApproveUser"}> <ViewUser/> </AdminAuth>}/>     
              <Route path="staff-enrol" element={<EnrolStaff/>}/>
              <Route path="staff-roles" element={<SetStaffRoles/>}/>
              <Route path="stu-reg"
               element={ <AdminAuth permission={"canManageStudents"}> <StudentRegistrationForm/> </AdminAuth>}/>
              <Route path="staff-list" element={<StaffList/>}/>
              <Route path="timetable" element={<Timetable/>}/>
              <Route path="manage-students"
                 element={ <AdminAuth permission={"canManageStudents"}> <ProfileView/> </AdminAuth>}/>
              <Route path="updates" element={<Updates/>}/>
              <Route path="finance"
                element={<AdminAuth> <Fee_Finance  /></AdminAuth>}/>
              <Route path="fees" element={<Fee_Finance/>}/> 
              <Route path="child/fee" element={<Fee_Finance/>}/>
              <Route path="child/results" element={<WardPerformance/>}/>
              <Route path="result-pins" element={<ManageResultPins/>}/>
              <Route path="unauthorized" element={<AccessDenied/>}/>
              {/*Manage Admissions*/}
              <Route path="manage-applicants/:id/*" element={<AdminAuth><ManageApplicants/></AdminAuth>}>
                <Route path="exam" element={<AssignExamDetails/>}/>
                <Route path="list" element={<ManageResultsAndAdmission/>}/>
                <Route path="admit" element={<ManageAdmission/>}/>
              </Route>
            </Route>
          </Route>

            {/* Portal */}
            <Route path="/admission" element={<AdmissionPage/>}/>
            <Route path="/applicant/*" element={<ApplicantPortal/>}>
                <Route index element={<ApplicantHome/>}/>
                <Route path="home" element={<ApplicantHome/>}/>
                <Route path="payment" element={<ApplicationFee/>}/>
                <Route path="data" element={<ApplicantRegPage/>}/>
                <Route path="faqs" element={<ApplicantFAQs/>}/>
                <Route path="exam" element={<EntranceExam/>}/>
                <Route path="status" element={<AdmissionStatus/>}/>
                <Route path="contact" element={<ApplicantContact/>}/>
            </Route>


            {/* Result Portal */}
            <Route path="/result" element={<ResultPage/>}/>
          </Routes>
    </>
  )
}

export default App