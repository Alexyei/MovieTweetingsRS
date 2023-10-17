'use client'
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {useState} from "react";
import {getClientAPI} from "@/api/client_api";
import {useRouter} from "next/navigation";

const api = getClientAPI()

const LogoutButton = ()=>{
    const [disabled, setDisabled] = useState(false)
    const router = useRouter()
    async function logoutHandler(){
        try {
            await api.authAPI.logout()

        }catch (err) {
            console.log(err)
        }finally {
            router.refresh()
        }

    }

    return (<DropdownMenuItem className="cursor-pointer" disabled={disabled} onClick={logoutHandler}>
        Выйти
    </DropdownMenuItem>)
}

export default LogoutButton