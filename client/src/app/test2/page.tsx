import {Button} from "@/components/ui/button";
import ProtectedRoute from "@/components/routes/ProtectedRoute/ProtectedRoute";
import AdminRoute from "@/components/routes/AdminRoute/AdminRoute";
import { cookies } from "next/headers";
import {notFound, redirect} from 'next/navigation'
import {getServerAPI} from "@/api/server_api";
import {UserDataT} from "@/types/user.types";

const api = getServerAPI()
export default async function Home() {
    // const API_URL = process.env.NEXT_PUBLIC_API_URL
    // const loadUser = async () => {
    //
    //     const response = await fetch(API_URL + '/api/v1.0.0/auth/data', {
    //         method: 'GET',
    //         mode: "cors",
    //         headers: {
    //             'Content-type': 'application/json',
    //             Cookie: cookies().toString()
    //         },
    //     })
    //
    //     const answer = await response.json()
    //
    //     if (response.ok) {
    //         return answer
    //     } else {
    //         return answer
    //     }
    //
    // }
    // const user = await loadUser()
    const response = await api.authAPI.userData()
    if (response.status == 401)
        redirect('/sign-in')
    if (response.status == 403)
        notFound()

    const user = response.response as UserDataT
    return (
        <>
            {user.email}<br></br>
            {cookies().toString()}
            <Button variant="outline">Text!</Button>
            <Button variant="secondary">Text!</Button>
            <Button variant="destructive">Text!</Button>
            <Button >Text!</Button>
            <Button disabled={true}>Text!</Button>
        </>
    )}