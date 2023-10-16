import {Button} from "@/components/ui/button";
import ProtectedRoute from "@/components/routes/ProtectedRoute/ProtectedRoute";
import AdminRoute from "@/components/routes/AdminRoute/AdminRoute";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation'

export default async function Home() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const loadUser = async () => {

        const response = await fetch(API_URL + '/api/v1.0.0/auth/data', {
            method: 'GET',
            mode: "cors",
            headers: {
                'Content-type': 'application/json',
                Cookie: cookies().toString()
            },
        })

        const answer = await response.json()

        if (response.ok) {
            return answer
        } else {
            return answer
        }

    }
    const user = await loadUser()
    if (user.email)
        redirect('/sign-in')
    return (
        <>
            {user.message || user.email}<br></br>
            {cookies().toString()}
            <Button variant="outline">Text!</Button>
            <Button variant="secondary">Text!</Button>
            <Button variant="destructive">Text!</Button>
            <Button >Text!</Button>
            <Button disabled={true}>Text!</Button>
        </>
    )}