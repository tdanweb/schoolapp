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
    <div>
    {
        alertMsg && <AlertMessage msg={alertMsg} zed={65} click={() => setAlertMsg("")}/>
    }
    {
        loading && <Loader test={`Loading User Information`}/>
    }
    {
        !userInfo && errorMsg && <p>Unable to get User, {errorMsg}</p>
    }

    {
        //if it;s a staff controller
        userInfo && userInfo.students && <AdminFeePage adminData={userInfo}/>
    }

    {
        userInfo && userInfo.student && <div>Student View UI</div>
    }

    {
        userInfo && userInfo.wards && <div>Parent UI</div>
    }
    </div>
)
}
