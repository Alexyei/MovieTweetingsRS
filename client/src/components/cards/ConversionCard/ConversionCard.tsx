'use client'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import * as React from "react";
import {getClientAPI} from "@/api/client_api";
import {useEffect, useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {RatingDistributionT} from "@/types/rating.types";
import {RatingDistributionChart} from "@/components/charts/RatingDistributionChart/RatingDistributionChart";
import {EventsCountT} from "@/types/user_event.types";
import {ConversionChart} from "@/components/charts/ConversionChart/ConversionChart";

const api = getClientAPI()
async function getEventsCountData(){
    try {
        const response = await api.userEvent.eventsCount()

        if (response.status != 200) return null

        return  response.response
    }catch (e) {
        return null
    }

}



export default function ConversionCard(){
    const [eventsCountData,setEventsCountData] = useState<EventsCountT|null>()
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        getEventsCountData().then(data=>{
            setEventsCountData(data)
        }).finally(()=>setLoading(false))
    },[])

    return (
        <Card className={"flex flex-col"}>
            <CardHeader>
                <CardTitle>Конверсионная воронка</CardTitle>
            </CardHeader>
            <CardContent className={"flex-grow flex flex-col-reverse"}>
                {loading ? <div className={"w-full h-48 flex items-center justify-center"}>Загрузка графика...</div>:
                    eventsCountData != null  ?
                        <ConversionChart data={eventsCountData}/>

                        : <div className={"w-full h-48 flex items-center justify-center"}>Нет данных</div>}
            </CardContent>
        </Card>
    )
}