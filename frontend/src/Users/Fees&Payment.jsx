import { useEffect, useState } from "react";
import { mainApi } from "../api";
import { Loader } from "../components/UnderDev";
import axios from "axios";
import { AlertMessage } from "../components/LogInForm";
const getFeeAPI = `${mainApi}/user/fee-info`
import AdminFeePage from "./ChiefAdmin/ManageFee"



export default function Fee_Finance(){
    const [userInfo, setUserInfo] = useState(null) //straight from backend
    const [alertMsg, setAlertMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false)

async function getUser(){
    setLoading(true)
    const savedUser = JSON.parse(localStorage.getItem("logged-user"));

    try {
        const res = await axios.get(`${getFeeAPI}?user=${savedUser.user}`);

        console.log(res.data)
        setUserInfo(res.data);
    } catch (error) {
     if(error.response){
        setAlertMsg(error.response.data.msg)
     } else{
        setAlertMsg("Network/Server Error... Please try again later!")
     }
    } finally {
        setLoading(false)
    }
}


useEffect(() => {
    getUser();
}, [])
return (
<div className="min-h-screen bg-gray-50">

  {/* Page Header */}
  <div className="bg-white border-b border-gray-200 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">

      <div className="flex items-center gap-4">

        {/* School Logo */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center p-2 shadow-sm">
          <img
            src="/crest.png"
            alt="School Crest"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Title */}
        <div>
          <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-gray-500">
            Achievers International Schools
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            School Fees / Finances
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor school financial records
          </p>
        </div>

      </div>

    </div>
  </div>


  {/* Alerts */}
  {alertMsg && (
    <AlertMessage
      msg={alertMsg}
      zed={65}
      click={() => setAlertMsg("")}
    />
  )}

  {/* Loader */}
  {loading && <Loader test="Loading User Information" />}


  {/* Error */}
  {!userInfo && errorMsg && (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Unable to get User, {errorMsg}
      </div>
    </div>
  )}


  {/* Staff / Admin */}
  {userInfo && userInfo.students && (
    <AdminFeePage adminData={userInfo} />
  )}


  {/* Student */}
  {userInfo && userInfo.student && (
    <div>Student View UI</div>
  )}


  {/* Parent */}
  {userInfo && userInfo.wards && (
    <div>Parent UI</div>
  )}

</div>
)
}
