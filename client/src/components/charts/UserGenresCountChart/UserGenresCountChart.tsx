"use client"

import {Bar, BarChart, Legend, Rectangle, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import React from "react";
import {UserGenreCountT, UserRatingsDataByGenresExtendedT, UserRatingsDataByGenresShortT} from "@/types/genre.types";
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
                <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground">Приобретено</span>
                </li>
                <li className={"flex items-center"}>
                    <span className={"w-4 h-4 bg-destructive rounded-sm"}/>
                    <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground">В избранном</span>
                </li>
                <li className={"flex items-center"}>
                    <span className={"w-4 h-4 bg-pink-500 rounded-sm"}/>
                    <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground">Явные оценки (EXPLICIT)</span>
                </li>
                <li className={"flex items-center"}>
                    <span className={"w-4 h-4 bg-yellow-300 rounded-sm"}/>
                    <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground">Неявные оценки (IMPLICIT)</span>
                </li>
                <li className={"flex items-center"}>
                    <span className={"w-4 h-4 bg-lime-500 rounded-sm"}/>
                    <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground">Приоритетные оценки</span>
                </li>
            </ul>
        );
    }
}
export function UserGenresCountChart({data}: { data: UserGenreCountT[]}) {
    const minWidth = data.length*100
    return (
        <ScrollArea className={"w-full pb-4 rounded-lg border bg-card text-card-foreground shadow-sm"}>
        <div style={{minWidth:minWidth}} >
        <ResponsiveContainer width={"100%"} height={450}>

            <BarChart data={data}>
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
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Приобретено</span>
                                        <span className="font-bold text-primary">{payload[0].payload.collection.purchased}</span>
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">В избранном</span>
                                        <span className="font-bold text-destructive">{payload[0].payload.collection.liked}</span>
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Явные оценки (EXPLICIT)</span>
                                        <span className="font-bold text-pink-500">{payload[0].payload.ratings.explicit}</span>
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Неявные оценки (IMPLICIT)</span>
                                        <span className="font-bold text-yellow-300">{payload[0].payload.ratings.implicit}</span>
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Приоритетные оценки</span>
                                        <span className="font-bold text-lime-500">{payload[0].payload.ratings.priority}</span>
                                    </div>

                                </div>
                            )
                        }

                        return null
                    }}
                />
                <ReferenceLine y={0} stroke="hsl(var(--foreground))" />
                <Legend  content={renderLegend} />
                <Bar dataKey="collection.purchased" className={"fill-primary"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--primary))" stroke="hsl(var(--foreground))"/>}/>
                <Bar dataKey="collection.liked" className={"fill-destructive"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--destructive))" stroke="hsl(var(--foreground))"/>}/>
                <Bar dataKey="ratings.explicit" className={"fill-pink-500"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--fill-pink-500))" stroke="hsl(var(--foreground))"/>}/>
                <Bar dataKey="ratings.implicit" className={"fill-yellow-300"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--fill-yellow-300))" stroke="hsl(var(--foreground))"/>}/>
                <Bar dataKey="ratings.priority" className={"fill-lime-500"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--fill-lime-500))" stroke="hsl(var(--foreground))"/>}/>
            </BarChart>

        </ResponsiveContainer>
        </div>
            <ScrollBar orientation={"horizontal"}></ScrollBar>
        </ScrollArea>
    )
}

