import {getServerAPI} from "@/api/server_api";
import ServerAdminRoute from "@/components/routes/ServerAdminRoute/ServerAdminRoute";
import {notFound} from "next/navigation";
import {UserT} from "@/types/user.types";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import * as React from "react";
import UserLogsTable from "@/components/tables/UserLogs/UserLogs";
import UserSimilarityTable from "@/components/tables/UserSimilarity/UserSimilarity";
import UserCollectionTable from "@/components/tables/UserCollection/UserCollection";
import UserRatingTable from "@/components/tables/UserRatings/UserRatings";
import ItemBasedRecsCard from "@/components/ItemBasedRecsCard/ItemBasedRecsCard";
import UserBasedRecsCard from "@/components/UserBasedRecsCard/UserBasedRecsCard";
import UserTasteCard from "@/components/cards/UserTasteCard/UserTasteCard";
import UserGenresCountCard from "@/components/cards/UserGenreCountCard/UserGenresCountCard";


const api = getServerAPI()


export default async function Page({params}: { params: { id: number } }){
    const userID = params.id
    const response = await api.auth.userData(userID)
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
                            <div className={"flex items-center mt-4 w-full flex-wrap gap-4"}>
                                <CardDescription >{user.email ? user.email:"email отсуствует"}</CardDescription>
                                <Badge className={` inline-block`} variant={`${user.role == 'ADMIN' ? 'default':'secondary'}`}>{user.role.toLowerCase()}</Badge>
                            </div>

                        </div>
                    </div>
                </CardHeader>
                {/*<CardContent>*/}

                {/*</CardContent>*/}
            </Card>
            <UserTasteCard userID={userID}/>
            <UserGenresCountCard userID={userID}/>
            <div className="grid  w-full gap-4 lg:grid-cols-2">
                <UserCollectionTable userID={userID}/>
                <UserRatingTable/>
            </div>
            <div className="grid  w-full gap-4 lg:grid-cols-2">
                <UserLogsTable userID={userID}/>
                <UserSimilarityTable userID={userID}/>
            </div>
            <ItemBasedRecsCard userID={userID}/>
            <UserBasedRecsCard userID={userID}/>
        </ServerAdminRoute>
    )
}