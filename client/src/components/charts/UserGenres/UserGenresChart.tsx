"use client"

import {Bar, BarChart, Legend, Rectangle, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import React from "react";

const renderLegend = (props:any) => {
    const { payload } = props;
    if(payload && payload.length){
        const data = payload[0]
        return (
            <ul className="flex flex-wrap items-center justify-between mx-auto gap-2">
                <li className={"flex items-center"}>
                    <span className={"w-4 h-4 bg-primary rounded-sm"}/>
                    <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground">Куплено</span>
                </li>
                <li className={"flex items-center"}>
                    <span className={"w-4 h-4 bg-destructive rounded-sm"}/>
                    <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground">В избранном</span>
                </li>
                <li className={"flex  items-center"}>
                    <span className={"w-4 h-4 bg-pink-500 rounded-sm"}/>
                    <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground  max-w-[150px]">Явные оценки</span>
                </li>
                <li className={"flex items-center"}>
                    <span className={"w-4 h-4 bg-orange-500 rounded-sm"}/>
                    <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground  max-w-[150px]">Неявные оценки</span>
                </li>
                <li className={"flex items-center"}>
                    <span className={"w-4 h-4 bg-green-500 rounded-sm"}/>
                    <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground  max-w-[150px]">Приоритетные оценки</span>
                </li>
            </ul>
        );
    }
}
export function UserGenresChart({data}: {data:{ id:number,name:string,count_list:number, count_buy:number, count_explicit:number, count_implicit:number, count_priority:number }[]} ) {
    return (
        <ResponsiveContainer width="100%" height={350}>
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
                            console.log(payload[0])
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid grid-cols-2 gap-2 items-center">

                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Куплено</span>
                                        <span className="font-bold">{payload[0].payload.count_buy}</span>
                                        <span className="text-[0.70rem] uppercase text-muted-foreground  max-w-[150px]">В избранном</span>
                                        <span className="font-bold">{payload[0].payload.count_list}</span>
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Явные оценки</span>
                                        <span className="font-bold">{payload[0].payload.count_explicit}</span>
                                        <span className="text-[0.70rem] uppercase text-muted-foreground  max-w-[150px]">Неявные оценки</span>
                                        <span className="font-bold">{payload[0].payload.count_implicit}</span>
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Приоритетные оценки</span>
                                        <span className="font-bold">{payload[0].payload.count_priority}</span>
                                    </div>
                                </div>
                            )
                        }

                        return null
                    }}
                />
                <ReferenceLine y={0} stroke="hsl(var(--foreground))" />
                <Legend  content={renderLegend} />
                <Bar dataKey="count_buy" className={"fill-primary"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--primary))" stroke="hsl(var(--foreground))"/>}/>
                <Bar dataKey="count_list" className={"fill-destructive"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--destructive))" stroke="hsl(var(--foreground))"/>}/>
                <Bar dataKey="count_explicit" className={"fill-pink-500"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--primary))" stroke="hsl(var(--foreground))"/>}/>
                <Bar dataKey="count_implicit" className={"fill-orange-500"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--destructive))" stroke="hsl(var(--foreground))"/>}/>
                <Bar dataKey="count_priority" className={"fill-green-500"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--destructive))" stroke="hsl(var(--foreground))"/>}/>
            </BarChart>
        </ResponsiveContainer>
    )
}

