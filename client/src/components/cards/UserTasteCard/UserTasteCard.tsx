'use client'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {UserRatingsByGenresChart} from "@/components/charts/UserRatingsByGenresChart/UserRatingsByGenresChart";
import * as React from "react";
import {UserRatingsDataByGenresExtendedT} from "@/types/genre.types";
import {getClientAPI} from "@/api/client_api";
import {useEffect, useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

const api = getClientAPI()
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
            genre.explicit['userDifAvg']= genre.explicit.userAvg - data.globalUser.explicit.userAvg
            genre.explicit['userDifAvgNorm']=genre.explicit['userDifAvg']/max.explicit.userDifAvg || 0
            genre.explicit['allDifAvg']=genre.explicit.userAvg - genre.explicit.allAvg
            genre.explicit['allDifAvgNorm']=genre.explicit['allDifAvg']/max.explicit.allDifAvg || 0
            genre.explicit['userCountNorm']=genre.explicit.userCount/max.explicit.userCount || 0

            genre.implicit['userDifAvg']=genre.implicit.userAvg - data.globalUser.implicit.userAvg
            genre.implicit['userDifAvgNorm']=genre.implicit['userDifAvg']/max.implicit.userDifAvg || 0
            genre.implicit['allDifAvg']=genre.implicit.userAvg - genre.implicit.allAvg
            genre.implicit['allDifAvgNorm']=genre.implicit['allDifAvg']/max.implicit.allDifAvg || 0
            genre.implicit['userCountNorm']=genre.implicit.userCount/max.implicit.userCount || 0
        })

        return data as UserRatingsDataByGenresExtendedT
    }catch (e) {
        return null
    }

}

function ExplicitChart({tasteData}:{tasteData: UserRatingsDataByGenresExtendedT}){
    const explicitData = {
        globalUser: {
            ...tasteData.globalUser.explicit
        },
        genresData: tasteData.genresData.map(genre=>({
            id:genre.id,
            name:genre.name,
            ...genre.explicit
        }))
            // .filter(genre=>genre.userCount > 0)
    }

    return <UserRatingsByGenresChart data={explicitData}/>
}

function ImplicitChart({tasteData}:{tasteData: UserRatingsDataByGenresExtendedT}){
    const implicitData = {
        globalUser: {
            ...tasteData.globalUser.implicit
        },
        genresData: tasteData.genresData.map(genre=>({
            id:genre.id,
            name:genre.name,
            ...genre.implicit
        }))
            // .filter(genre=>genre.userCount > 0)
    }

    return <UserRatingsByGenresChart data={implicitData}/>
}

export default function UserTasteCard({userID}:{userID:number}){
    const [tasteData,setTasteData] = useState<UserRatingsDataByGenresExtendedT|null>()
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        getTasteData(userID).then(data=>{
            setTasteData(data)
        }).finally(()=>setLoading(false))
    },[])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Вкусы пользователя</CardTitle>
            </CardHeader>
            <CardContent >
                {loading ? <div className={"w-full h-48 flex items-center justify-center"}>Загрузка графика...</div>:
                tasteData != null && tasteData.genresData.length ?
                    <Tabs defaultValue="explicit" >
                        <TabsList className="grid w-[320px] grid-cols-2">
                            <TabsTrigger value="explicit">Explicit</TabsTrigger>
                            <TabsTrigger value="implicit">Implicit</TabsTrigger>
                        </TabsList>
                        <TabsContent value="explicit">
                            <p>Средняя оценка пользователя: {tasteData.globalUser.explicit.userAvg.toFixed(2)}</p>
                            <p>Количество оценок пользователя: {tasteData.globalUser.explicit.userCount}</p>
                            <ExplicitChart tasteData={tasteData}/>
                        </TabsContent>
                        <TabsContent value="implicit">
                            <p>Средняя оценка пользователя: {tasteData.globalUser.implicit.userAvg.toFixed(2)}</p>
                            <p>Количество оценок пользователя: {tasteData.globalUser.implicit.userCount}</p>
                            <ImplicitChart tasteData={tasteData}/>
                        </TabsContent>
                    </Tabs>
                    : <div className={"w-full h-48 flex items-center justify-center"}>Нет данных</div>}
            </CardContent>
        </Card>
    )
}