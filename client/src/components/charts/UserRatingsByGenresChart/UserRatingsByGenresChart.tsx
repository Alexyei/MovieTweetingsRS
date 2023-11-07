"use client"

import {Bar, BarChart, Legend, Rectangle, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import React from "react";
import {UserRatingsDataByGenresExtendedT, UserRatingsDataByGenresShortT} from "@/types/genre.types";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

const renderLegend = (props:any) => {
    const { payload } = props;
    if(payload && payload.length){
        const data = payload[0]
        return (
            <ul className="flex flex-wrap items-center justify-around mx-auto">
                <li className={"flex items-center"}>
                <span className={"w-4 h-4 bg-primary rounded-sm"}/>
                <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground">Количество оценок</span>
                </li>
                <li className={"flex items-center"}>
                    <span className={"w-4 h-4 bg-destructive rounded-sm"}/>
                    <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground">Отличие средней оценки пользователя по жанру от общей средней оценки по жанру</span>
                </li>
                <li className={"flex items-center"}>
                    <span className={"w-4 h-4 bg-green-500 rounded-sm"}/>
                    <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground">Отличие средней оценки пользователя по жанру от своей средней оценки</span>
                </li>
            </ul>
        );
    }
}
export function UserRatingsByGenresChart({data}: { data: UserRatingsDataByGenresShortT}) {
    const minWidth = data.genresData.length*65
    return (
        <ScrollArea className={"w-full pb-4 rounded-lg border bg-card text-card-foreground shadow-sm"}>
        <div style={{minWidth:minWidth}} >
        <ResponsiveContainer width={"100%"} height={450}>

            <BarChart data={data.genresData}>
                <XAxis
                    dataKey="name"
                    fontSize={12}
                    tickLine={false}
                    axisLine={true}
                    style={{fill: "hsl(var(--muted-foreground)",}}
                />
                <YAxis
                    style={{fill: "hsl(var(--muted-foreground)",}}
                    fontSize={12}
                    tickLine={true}
                    axisLine={true}
                    padding={{ top: 10, bottom: 10 }}
                />
                <Tooltip
                    cursor={{fill: 'hsl(var(--secondary))'}}
                    content={({active, payload}) => {



                        if (active && payload && payload.length) {
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid grid-cols-[200px_auto] gap-1 items-center">
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Отношение оценок пользователя по жанру к общему количеству</span>
                                        <span className="font-bold">{(payload[0].payload.userCount/data.globalUser.userCount).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})}</span>
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Количество оценок пользователя по жанру (значение/нормированное)</span>
                                        <span className="font-bold">{payload[0].payload.userCount} / <span className={"text-primary"}>{payload[0].payload.userCountNorm.toFixed(2)}</span></span>
                                        <span className="text-[0.70rem] uppercase text-muted-foreground  ">Средняя оценка по жанру (общая/пользователя)</span>
                                        <span className="font-bold">{payload[0].payload.userAvg.toFixed(2)} / {payload[0].payload.allAvg.toFixed(2)}</span>
                                        <span className="text-[0.70rem] uppercase text-muted-foreground  ">Отличие средней оценки пользователя от общей по жанру (значение/нормированное)</span>
                                        <span className="font-bold">{payload[0].payload.allDifAvg.toFixed(2)} / <span className={"text-destructive"}>{payload[0].payload.allDifAvgNorm.toFixed(2)}</span></span>
                                        {/*<span className="text-[0.70rem] uppercase text-muted-foreground  ">Средняя оценка пользователя</span>*/}
                                        {/*<span className="font-bold">{data.globalUser.userAvg.toFixed(2)}</span>*/}
                                        <span className="text-[0.70rem] uppercase text-muted-foreground  ">Отличие средней оценки пользователя по жанру от своей средней (значение/нормированное)</span>
                                        <span className="font-bold">{payload[0].payload.userDifAvg.toFixed(2)} / <span className={"text-green-500"}>{payload[0].payload.userDifAvgNorm.toFixed(2)}</span></span>
                                    </div>

                                </div>
                            )
                        }

                        return null
                    }}
                />
                <ReferenceLine y={0} stroke="hsl(var(--foreground))" />
                <Legend  content={renderLegend} />
                <Bar dataKey="userCountNorm" className={"fill-primary"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--primary))" stroke="hsl(var(--foreground))"/>}/>
                <Bar dataKey="allDifAvgNorm" className={"fill-destructive"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--destructive))" stroke="hsl(var(--foreground))"/>}/>
                <Bar dataKey="userDifAvgNorm" className={"fill-green-500"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--fill-green-500))" stroke="hsl(var(--foreground))"/>}/>
            </BarChart>

        </ResponsiveContainer>
        </div>
            <ScrollBar orientation={"horizontal"}></ScrollBar>
        </ScrollArea>
    )
}

