'use client'
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useUserData} from "@/context/UserDataContext";


const LogoutButton = ()=>{
    const [disabled, setDisabled] = useState(false)
    const user = useUserData()
    const router = useRouter()
    async function logoutHandler(){
        // try {
            await user.logout()
            router.refresh()
        // }catch (err) {
        //     console.log(err)
        // }finally {
        //     router.refresh()
        // }

    }

    return (<DropdownMenuItem className="cursor-pointer" disabled={disabled} onClick={logoutHandler}>
        Выйти
    </DropdownMenuItem>)
}

export default LogoutButton