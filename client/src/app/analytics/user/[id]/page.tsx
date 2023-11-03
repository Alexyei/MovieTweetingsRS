import {getServerAPI} from "@/api/server_api";
import ServerAdminRoute from "@/components/routes/ServerAdminRoute/ServerAdminRoute";
import {notFound} from "next/navigation";
import {UserT} from "@/types/user.types";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import * as React from "react";

const api = getServerAPI()
export default async function Page({params}: { params: { id: number } }){
    const response = await api.auth.userData(params.id)
    if (response.status >= 400){
        return notFound()
    }

    const user = response.response as UserT
    return (
        <ServerAdminRoute>
            <Card>
                <CardHeader>
                    <div className={"flex items-center"}>
                        <Avatar className="h-20 w-20">
                            <AvatarImage
                                src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.login || user.id}`}
                                alt="@avatar"/>
                            <AvatarFallback>AV</AvatarFallback>
                        </Avatar>
                        <div className={"pl-4 w-full"}>
                            <CardTitle >{`${user.login ? user.login : ""} (id: ${user.id})`}</CardTitle>
                            <div className={"flex items-center mt-4 w-full"}>
                                <CardDescription >{user.email ? user.email:"email отсуствует"}</CardDescription>
                                <Badge className={`ml-4 inline-block`} variant={`${user.role == 'ADMIN' ? 'default':'secondary'}`}>{user.role.toLowerCase()}</Badge>
                            </div>

                        </div>
                    </div>
                </CardHeader>
                <CardContent>

                </CardContent>
            </Card>
        </ServerAdminRoute>
    )
}