'use client'
import React, {useEffect} from "react";
import {useUserData} from "@/context/UserDataContext";
import {useRouter} from "next/navigation";

interface AdminRoutePropsI {
    children: React.ReactNode
}
const AdminRoute = ({ children }:AdminRoutePropsI) => {
    const { user } = useUserData()
    const router = useRouter()

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            router.push('/sign-in')
        }
    }, [router, user])

    return <>{user ? children : null}</>
}

export default AdminRoute;