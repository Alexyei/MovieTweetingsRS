"use client"

import {Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import React from "react";

const data = [
    {
        name: "Jan",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Feb",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Mar",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Apr",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "May",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Jun",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Jul",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Aug",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Sep",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Oct",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Nov",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Dec",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
]

export function Overview() {


    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    // className={"stroke-border"}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    style={
                        {
                            fill: "hsl(var(--muted-foreground)",

                            // "--theme-primary": `hsl(${
                            //     theme?.cssVars[mode === "dark" ? "dark" : "light"].primary
                            // })`,
                        }
                    }
                />
                <YAxis

                    // className={"stroke-foreground"}
                    // stroke="#888888"
                    style={
                        {fill:  "hsl(var(--muted-foreground)",}
                    }
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                    cursor={{fill: 'hsl(var(--secondary))'}}
                    content={({ active, payload }) => {

                        if (active && payload && payload.length) {
                            console.log(payload[0])
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Month
                            </span>
                                            <span className="font-bold text-muted-foreground">
                              {payload[0].payload.name}
                            </span>
                                        </div>
                                        <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Total
                            </span>
                                            <span className="font-bold">
                              {payload[0].payload.total}
                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        return null
                    }}
                />
                {/*<Tooltip   formatter={(value, name, props)=>[value,""]}/>*/}
                <Bar dataKey="total"  className={"fill-primary"} radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}