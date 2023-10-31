'use client'
import React, {useState} from "react";
import {useUserData} from "@/context/UserDataContext";
import {getClientAPI} from "@/api/client_api";

const api = getClientAPI()
const HoverTracer = ({children,movieID}:{children:React.ReactElement,movieID:string}) => {
    const [start,setStart] = useState(Date.now());
    const user = useUserData()
    function pointerEnterHandler(){
        setStart(Date.now())
    }

    async function pointerOutHandler(){
        const timeDifferent = (Date.now() - start)/1000
        if (timeDifferent > 2 && timeDifferent <= 10 && user.user != null){
            try{
                const response = await api.userEvent.create(movieID,null,"DETAILS")
            }catch (e){}
        }
    }


    return <div  onPointerEnter={pointerEnterHandler} onPointerLeave={pointerOutHandler}>
        {children}
    </div>
}

export default HoverTracer;