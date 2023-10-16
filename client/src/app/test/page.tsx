import {Button} from "@/components/ui/button";
import ProtectedRoute from "@/components/routes/ProtectedRoute/ProtectedRoute";
import AdminRoute from "@/components/routes/AdminRoute/AdminRoute";
import { cookies } from "next/headers";
export default async function Home() {

    return (
        <ProtectedRoute>
            {cookies().toString()}
            <Button variant="outline">Text!</Button>
        <Button variant="secondary">Text!</Button>
        <Button variant="destructive">Text!</Button>
        <Button >Text!</Button>
        <Button disabled={true}>Text!</Button>
        </ProtectedRoute>
    )}