export const mainApi = import.meta.env.VITE_MAIN_API + "/api";


const API_URL = "http://localhost:5000/api"
import axios from "axios"

export {API_URL}

export const mainApi2 = `http://localhost:5000/api`

const trueAPI = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

export function validateUser(user, permission, next){
    if(!user){
        return alert("Access Denied")
    }

    if(user.assignedRoles.permission){
        //for example, permission is canManageStudents.
        next()
    } else{
        return alert("Access Denied")
    }

}

export const formattedDate  = (date) => {
    const dated = new Date(date).toLocaleString("en-NG", {
    day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true
                    });
    return dated;
}