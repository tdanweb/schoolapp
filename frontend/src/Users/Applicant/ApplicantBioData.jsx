import axios from "axios";
import { useParams } from "react-router-dom";
import { mainApi } from "../../api";
import { useState } from "react";

const initialApplicantData = {
    
}

export default function ApplicantBioData(){
    const [uploading, setUploading] = useState(false);

    const {id} = useParams(); //id is regNo
    const [load1, setLoad1] = useState(false);
    const [msg1, setMsg1] = useState("")
    const [msg2, setMsg2] = useState("")
    
    async function getApplicantByRegNo(){
        setLoad1(true);

        try {
          const res = await axios.get(`${mainApi}/applicant/get/${id}`); 
          //return user, applicant || null => allow user to register
          if(res.data.success){
            console.log(res.data.applicant);
            setMsg1(res.data.msg)
          } 
        } catch (error) {
            if(error.response){
                setMsg1(error.response.data.msg)
            }
        } finally{
            setLoad1(false)
        }
    }

    //if applicant is yet to pay return an overlay on the portal, Complete Reg Fee Payment to fill BioData, admission closed, tell them admission is closed...
}