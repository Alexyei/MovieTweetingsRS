"use client"

import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import React from "react";

const CustomTooltip = () => {
    return (
        <Tooltip
            cursor={{fill: 'hsl(var(--secondary))'}}
            content={({active, payload}) => {

                if (active && payload && payload.length) {
                    console.log(payload[0])
                    return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Rating
                            </span>
                                    <span className="font-bold text-muted-foreground">
                              {payload[0].payload.rating}
                            </span>
                                </div>
                                <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Total
                            </span>
                                    <span className="font-bold">
                              {payload[0].payload.count}
                            </span>
                                </div>
                            </div>
                        </div>
                    )
                }

                return null
            }}
        />
    )
}


export function RatingChart({data}: { data: { rating: number, count: number }[] }) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey="rating"
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
                    tickFormatter={(value) => `${value / 1000}K`}
                />
                <Tooltip
                    cursor={{fill: 'hsl(var(--secondary))'}}
                    content={({active, payload}) => {

                        if (active && payload && payload.length) {
                            console.log(payload[0])
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                        {/*<div className="flex flex-col">*/}
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Rating</span>
                                        <span className="font-bold text-muted-foreground">{payload[0].payload.rating}</span>
                                        {/*</div>*/}
                                        {/*<div className="flex flex-col">*/}
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Total</span>
                                        <span className="font-bold">{payload[0].payload.count}</span>
                                        {/*</div>*/}
                                    </div>
                                </div>
                            )
                        }

                        return null
                    }}
                />
                <Bar dataKey="count" className={"fill-primary"} radius={[4, 4, 0, 0]}/>
            </BarChart>
        </ResponsiveContainer>
    )
}

