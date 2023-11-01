import {getServerAPI} from "@/api/server_api";
import {notFound, redirect} from "next/navigation";
import React from "react";

const api = getServerAPI()
export default async function ServerAdminRoute({ children }:{children: React.ReactNode}) {

    const response = await api.auth.userData()
    if (response.status == 401)
        redirect('/sign-in')

    if (response.status == 200){
        if (response.response.role != "ADMIN") notFound()
    }

    return (
        <>{children}</>
    )
}