import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {Button} from "@/components/ui/button";

function loadUser(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            if (Math.random() > 0.5 )

            reject(new Error('User error'))
            else
                resolve ({email:'mail'})
        },2000)
    })
}
export default async function Home() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL



    const user = await loadUser() as any
        if (!user.email)
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
        )
}
