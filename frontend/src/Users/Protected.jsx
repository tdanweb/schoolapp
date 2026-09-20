import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { mainApi } from "../api";
import { useEffect, useState } from "react";
import axios from "axios";

const api = `${mainApi}/user/auth`;

export function ProtectedAccount(){

    const navTo = useNavigate()
    const [user, setUser] = useState(null);
    const [recInfo, setRecInfo] = useState(false)

    async function getUser(){
        const saved = JSON.parse(localStorage.getItem("logged-user"));
        if(!saved) return navTo("/sign-in");

        try {
            const res = await axios.get(`${api}?token=${saved.token}`);
            //continue
            setUser(res.data.user)
            setRecInfo(true)
        } catch (error) {
            if(error.response){
                navTo("/sign-in")
            } else {
                navTo("/sign-in")
            }

            setRecInfo(true)
        }
    }


    useEffect(() => {
        getUser()
    }, [])

    return recInfo && ( user ? <Outlet/> : <Navigate to="/sign-in" replace/>)
}