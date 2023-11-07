"use client"

import {
    Bar,
    BarChart,
    CartesianGrid,
    Rectangle,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts"
import React from "react";

export function RatingDistributionChart({distributionData}: { distributionData: { rating: number, count: number }[] }) {
    return (
        <div className={"w-full pt-4"}>
        <ResponsiveContainer width="100%" height={450}>
            <BarChart data={distributionData}>
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
                    tickFormatter={(value) => value > 1000 ? `${value / 1000}K`: value}
                />
                <Tooltip
                    cursor={{fill: 'hsl(var(--secondary))'}}
                    content={({active, payload}) => {

                        if (active && payload && payload.length) {
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid grid-cols-[120px_auto] gap-1 items-center">
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Диапазон оценки</span>
                                        <span className="font-bold text-muted-foreground">({payload[0].payload.rating-1}, {payload[0].payload.rating}]</span>

                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Количество</span>
                                        <span className="font-bold text-primary">{payload[0].payload.count}</span>
                                    </div>
                                </div>
                            )
                        }

                        return null
                    }}
                />
                <ReferenceLine y={0} stroke="hsl(var(--foreground))" />
                <Bar dataKey="count" className={"fill-primary"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--primary))" stroke="hsl(var(--foreground))"/>}/>
            </BarChart>
        </ResponsiveContainer></div>
    )
}

