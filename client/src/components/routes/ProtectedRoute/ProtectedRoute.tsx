'use client'
import {useUserData} from "@/context/UserDataContext";
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";

interface ProtectedRoutePropsI {
    children: React.ReactNode
}
const ProtectedRoute = ({ children }:ProtectedRoutePropsI) => {
    const { user } = useUserData()
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            router.push('/sign-in')
        }
    }, [router, user])

    return <>{user ? children : null}</>
}

export default ProtectedRoute;