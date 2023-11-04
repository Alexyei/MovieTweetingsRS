"use client"

import {Bar, BarChart, Legend, Rectangle, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import React from "react";

const renderLegend = (props:any) => {
    const { payload } = props;
    if(payload && payload.length){
        const data = payload[0]
        return (
            <ul className="flex flex-wrap items-center justify-around mx-auto">
                <li className={"flex items-center"}>
                <span className={"w-4 h-4 bg-primary rounded-sm"}/>
                <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground">Количество оценок (EXPLICIT)</span>
                </li>
                <li className={"flex items-center"}>
                    <span className={"w-4 h-4 bg-destructive rounded-sm"}/>
                    <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground">Отличие от средней оценки (EXPLICIT)</span>
                </li>
                <li className={"flex items-center"}>
                    <span className={"w-4 h-4 bg-pink-500 rounded-sm"}/>
                    <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground  max-w-[150px]">Количество оценок (IMPLICIT)</span>
                </li>
                <li className={"flex items-center"}>
                    <span className={"w-4 h-4 bg-orange-500 rounded-sm"}/>
                    <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground  max-w-[150px]">Отличие от средней оценки (IMPLICIT)</span>
                </li>
            </ul>
        );
    }
}
export function UserRatingsByGenresChart({data}: { data: {
    genre: {id:number,name:string,mean_rating:number,mean_rating_norm:number},
        ratings_count_implicit: number,
        mean_rating_difference_implicit: number,
        ratings_count_norm_implicit: number,
        mean_rating_difference_norm_implicit: number,
        ratings_count_explicit: number,
        mean_rating_difference_explicit: number,
        ratings_count_norm_explicit: number,
        mean_rating_difference_norm_explicit: number
    }[] }) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey="genre.name"
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
                            console.log(payload[0])
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid grid-cols-2 gap-2 items-center">

                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Средняя оценка (IMPLICIT)</span>
                                        <span className="font-bold">{payload[0].payload.genre.mean_rating}</span>
                                        <span className="text-[0.70rem] uppercase text-muted-foreground  max-w-[150px]">Отличие от средней оценки (IMPLICIT)</span>
                                        <span className="font-bold">{payload[0].payload.mean_rating_difference_implicit}</span>
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Количество оценок (IMPLICIT)</span>
                                        <span className="font-bold">{payload[0].payload.ratings_count_implicit}</span>
                                        <span className="text-[0.70rem] uppercase text-muted-foreground  max-w-[150px]">Отличие от средней оценки (EXPLICIT)</span>
                                        <span className="font-bold">{payload[0].payload.mean_rating_difference_explicit}</span>
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Количество оценок (EXPLICIT)</span>
                                        <span className="font-bold">{payload[0].payload.ratings_count_explicit}</span>
                                    </div>
                                </div>
                            )
                        }

                        return null
                    }}
                />
                <ReferenceLine y={0} stroke="hsl(var(--foreground))" />
                <Legend  content={renderLegend} />
                <Bar dataKey="ratings_count_norm_explicit" className={"fill-primary"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--primary))" stroke="hsl(var(--foreground))"/>}/>
                <Bar dataKey="mean_rating_difference_norm_explicit" className={"fill-destructive"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--destructive))" stroke="hsl(var(--foreground))"/>}/>
                <Bar dataKey="ratings_count_norm_implicit" className={"fill-pink-500"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--primary))" stroke="hsl(var(--foreground))"/>}/>
                <Bar dataKey="mean_rating_difference_norm_implicit" className={"fill-orange-500"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--destructive))" stroke="hsl(var(--foreground))"/>}/>
            </BarChart>
        </ResponsiveContainer>
    )
}

