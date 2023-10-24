'use client'
import React, {useState} from "react";
import {useUserData} from "@/context/UserDataContext";

const HoverTracer = ({children,data}:{children:React.ReactElement,data:any}) => {
    const [start,setStart] = useState(Date.now());
    const user = useUserData()
    function pointerEnterHandler(){
        setStart(Date.now())
    }

    function pointerOutHandler(){
        const timeDifferent = (Date.now() - start)/1000

        if (timeDifferent > 2 && timeDifferent <= 10 && user.user != null)
            console.log(data)
    }


    return <div  onPointerEnter={pointerEnterHandler} onPointerLeave={pointerOutHandler}>
        {children}
    </div>
}

export default HoverTracer;