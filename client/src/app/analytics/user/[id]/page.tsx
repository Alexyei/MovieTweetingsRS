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
import {UserRatingsByGenresChart} from "@/components/charts/UserRatingsByGenresChart/UserRatingsByGenresChart";
import {UserGenresChart} from "@/components/charts/UserGenres/UserGenresChart";
import UserCollectionTable from "@/components/tables/UserCollection/UserCollection";
import UserRatingTable from "@/components/tables/UserRatings/UserRatings";
import ItemBasedRecsCard from "@/components/ItemBasedRecsCard/ItemBasedRecsCard";
import UserBasedRecsCard from "@/components/UserBasedRecsCard/UserBasedRecsCard";
import {UserRatingsDataByGenresExtendedT} from "@/types/genre.types";


const api = getServerAPI()

async function getTasteData(userID:number){
    try {
        const response = await api.genre.userRatingsDataByGenres(userID)

        if (response.status != 200) return null

        const data = response.response


        const max = data.genresData.reduce((acc,genre)=>{
            acc.explicit.userCount = Math.max(acc.explicit.userCount, genre.explicit.userCount)
            acc.explicit.userDifAvg = Math.max(acc.explicit.userDifAvg, data.globalUser.explicit.userAvg - genre.explicit.userAvg)
            acc.explicit.allDifAvg = Math.max(acc.explicit.allDifAvg, genre.explicit.allAvg - genre.explicit.userAvg)

            acc.implicit.userCount = Math.max(acc.implicit.userCount, genre.implicit.userCount)
            acc.implicit.userDifAvg = Math.max(acc.implicit.userDifAvg, data.globalUser.implicit.userAvg - genre.implicit.userAvg)
            acc.implicit.allDifAvg = Math.max(acc.implicit.allDifAvg, genre.implicit.allAvg - genre.implicit.userAvg)
            return acc
        },{
            explicit: {
                userCount: 0,
                userDifAvg:0,
                allDifAvg:0
            },
            implicit: {
                userCount: 0,
                userDifAvg:0,
                allDifAvg:0
            }
        })

        data.genresData.forEach((genre:any)=>{
            genre.explicit['userDifAvg']=data.globalUser.explicit.userAvg - genre.explicit.userAvg
            genre.explicit['userDifAvgNorm']=genre.explicit['userDifAvg']/max.explicit.userDifAvg
            genre.explicit['allDifAvg']=genre.explicit.allAvg - genre.explicit.userAvg
            genre.explicit['allDifAvgNorm']=genre.explicit['allDifAvg']/max.explicit.allDifAvg
            genre.explicit['userCountNorm']=genre.explicit.userCount/max.explicit.userCount

            genre.implicit['userDifAvg']=data.globalUser.implicit.userAvg - genre.implicit.userAvg
            genre.implicit['userDifAvgNorm']=genre.implicit['userDifAvg']/max.implicit.userDifAvg
            genre.implicit['allDifAvg']=genre.implicit.allAvg - genre.implicit.userAvg
            genre.implicit['allDifAvgNorm']=genre.implicit['allDifAvg']/max.implicit.allDifAvg
            genre.implicit['userCountNorm']=genre.implicit.userCount/max.implicit.userCount
        })

        return data as UserRatingsDataByGenresExtendedT
    }catch (e) {
        return null
    }

}

export default async function Page({params}: { params: { id: number } }){
    const userID = params.id
    const response = await api.auth.userData(userID)
    if (response.status >= 400){
        return notFound()
    }

    // const tasteData = [
    //     {genre: {id:1,name:'Comedy',mean_rating:7.7,mean_rating_norm:7.7/8.5},
    //         ratings_count_implicit:100,ratings_count_norm_implicit: 100/100,mean_rating_difference_implicit: 1.5, mean_rating_difference_norm_implicit: 1.5/2.1,
    //         ratings_count_explicit:100,ratings_count_norm_explicit: 100/100,mean_rating_difference_explicit: 1.5, mean_rating_difference_norm_explicit: 1.5/2.1
    //     },
    //     {genre: {id:2,name:'Action',mean_rating:8.5,mean_rating_norm:8.5/8.5},
    //         ratings_count_implicit:2,ratings_count_norm_implicit: 2/100,mean_rating_difference_implicit: -2.1, mean_rating_difference_norm_implicit: -2.1/2.1,
    //         ratings_count_explicit:2,ratings_count_norm_explicit: 2/100,mean_rating_difference_explicit: -2.1, mean_rating_difference_norm_explicit: -2.1/2.1,
    //     },
    // ]
    const tasteData = await getTasteData(userID)

    const  genresData = [
        {id:1,name:'Comedy',count_buy:10,count_list:7,count_explicit:5,count_implicit:8, count_priority:11},
        {id:1,name:'Action',count_buy:10,count_list:0,count_explicit:2,count_implicit:0, count_priority:31},
    ]

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
            <Card>
                <CardHeader>
                    <CardTitle>Вкусы пользователя</CardTitle>
                </CardHeader>
                <CardContent >
                    {tasteData != null && tasteData.genresData.length ?
                    <UserRatingsByGenresChart data={tasteData}/>: "Нет данных"}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Жанры пользователя</CardTitle>
                </CardHeader>

                <CardContent >
                    {genresData.length ?
                        <UserGenresChart data={genresData}/>
                        : "Нет данных"}
                </CardContent>


            </Card>
            <div className="grid  w-full gap-4 lg:grid-cols-2">
                <UserCollectionTable/>
                <UserRatingTable/>
            </div>
            <div className="grid  w-full gap-4 lg:grid-cols-2">
                <UserLogsTable/>
                <UserSimilarityTable/>
            </div>
            <ItemBasedRecsCard userID={userID}/>
            <UserBasedRecsCard userID={userID}/>
        </ServerAdminRoute>
    )
}