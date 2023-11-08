"use client"

import {Bar, BarChart, Rectangle, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import React from "react";
import {EventsCountT, } from "@/types/user_event.types";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";


export function ConversionChart({data}: { data: EventsCountT }) {
    const minWidth = data.length*30
    return (
        <ScrollArea className={"w-full pb-4 rounded-lg border bg-card text-card-foreground shadow-sm"}>
            <div style={{minWidth:minWidth}} >
        <ResponsiveContainer width={"100%"} height={450}>
            <BarChart data={data}>
                <XAxis
                    dataKey="event"
                    fontSize={12}
                    tickLine={false}
                    axisLine={true}
                    style={{fill: "hsl(var(--muted-foreground)",}}
                    tickFormatter={(value) => value.split("_")[0].toLowerCase()}
                />
                <YAxis
                    style={{fill: "hsl(var(--muted-foreground)",}}
                    fontSize={12}
                    tickLine={true}
                    axisLine={true}
                    tickFormatter={(value) => `${value / 1000}K`}
                />
                <Tooltip
                    cursor={{fill: 'hsl(var(--secondary))'}}
                    content={({active, payload}) => {

                        if (active && payload && payload.length) {
                            console.log(payload[0])
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid grid-cols-[120px_auto] gap-1 items-center">
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Тип</span>
                                        <span
                                            className="font-bold text-muted-foreground">{payload[0].payload.event.split("_")[0]}</span>
                                        <span
                                            className="text-[0.70rem] uppercase text-muted-foreground">Без покупки</span>
                                        <span className="font-bold text-primary">{payload[0].payload.no_buy}</span>
                                        <span
                                            className="text-[0.70rem] uppercase text-muted-foreground">С покупкой</span>
                                        <span className="font-bold text-destructive">{payload[0].payload.buy}</span>
                                    </div>
                                </div>
                            )
                        }

                        return null
                    }}
                />
                <ReferenceLine y={0} stroke="hsl(var(--foreground))" />
                <Bar dataKey="no_buy" className={"fill-primary"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--primary))" stroke="hsl(var(--foreground))"/>}/>
                <Bar dataKey="buy" className={"fill-destructive"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--destructive))" stroke="hsl(var(--foreground))"/>}/>
            </BarChart>
        </ResponsiveContainer>
            </div>
            <ScrollBar orientation={"horizontal"}></ScrollBar>
        </ScrollArea>
    )
}

