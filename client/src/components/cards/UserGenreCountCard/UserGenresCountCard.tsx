'use client'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {UserRatingsByGenresChart} from "@/components/charts/UserRatingsByGenresChart/UserRatingsByGenresChart";
import * as React from "react";
import {UserGenreCountT, UserRatingsDataByGenresExtendedT} from "@/types/genre.types";
import {getClientAPI} from "@/api/client_api";
import {useEffect, useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {UserGenresCountChart} from "@/components/charts/UserGenresCountChart/UserGenresCountChart";

const api = getClientAPI()
async function getGenreCountData(userID:number){
    try {
        const response = await api.genre.userGenreCount(userID)

        if (response.status != 200) return null


        return response.response
    }catch (e) {
        return null
    }

}



export default function UserGenresCountCard({userID}:{userID:number}){
    const [countData,setCountData] = useState<UserGenreCountT[]|null>()
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        getGenreCountData(userID).then(data=>{
            setCountData(data)
            console.log(data)
        }).finally(()=>setLoading(false))
    },[])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Жанры пользователя</CardTitle>
            </CardHeader>
            <CardContent >
                {loading ? <div className={"w-full h-48 flex items-center justify-center"}>Загрузка графика...</div>:
                countData != null && countData.length ?
                    <UserGenresCountChart data={countData}/>
                    : <div className={"w-full h-48 flex items-center justify-center"}>Нет данных</div>}
            </CardContent>
        </Card>
    )
}