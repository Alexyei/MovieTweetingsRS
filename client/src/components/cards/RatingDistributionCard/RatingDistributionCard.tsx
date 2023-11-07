'use client'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import * as React from "react";
import {getClientAPI} from "@/api/client_api";
import {useEffect, useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {RatingDistributionT} from "@/types/rating.types";
import {RatingDistributionChart} from "@/components/charts/RatingDistributionChart/RatingDistributionChart";

const api = getClientAPI()
async function getDistributionData(){
    try {
        const response = await api.rating.distribution()

        if (response.status != 200) return null

        return  response.response
    }catch (e) {
        return null
    }

}



export default function RatingDistributionCard(){
    const [distributionData,setDistributionData] = useState<RatingDistributionT|null>()
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        getDistributionData().then(data=>{
            setDistributionData(data)
        }).finally(()=>setLoading(false))
    },[])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Распределение оценок</CardTitle>
            </CardHeader>
            <CardContent >
                {loading ? <div className={"w-full h-48 flex items-center justify-center"}>Загрузка графика...</div>:
                    distributionData != null  ?
                        <Tabs defaultValue="explicit" >
                            <TabsList className="grid w-[320px] grid-cols-2">
                                <TabsTrigger value="explicit">Explicit</TabsTrigger>
                                <TabsTrigger value="implicit">Implicit</TabsTrigger>
                            </TabsList>
                            <TabsContent value="explicit">
                                <RatingDistributionChart distributionData={distributionData.explicit}/>
                            </TabsContent>
                            <TabsContent value="implicit">
                                <RatingDistributionChart distributionData={distributionData.implicit}/>
                            </TabsContent>
                        </Tabs>
                        : <div className={"w-full h-48 flex items-center justify-center"}>Нет данных</div>}
            </CardContent>
        </Card>
    )
}