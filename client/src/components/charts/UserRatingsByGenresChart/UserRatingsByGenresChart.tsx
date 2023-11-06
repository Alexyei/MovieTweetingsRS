"use client"

import {Bar, BarChart, Legend, Rectangle, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import React from "react";
import {UserRatingsDataByGenresExtendedT} from "@/types/genre.types";
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
                <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground">Количество оценок (EXPLICIT)</span>
                </li>
                <li className={"flex items-center"}>
                    <span className={"w-4 h-4 bg-destructive rounded-sm"}/>
                    <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground">Отличие средней оценки пользователя по жанру от общей средней оценки по жанру (EXPLICIT)</span>
                </li>
                <li className={"flex items-center"}>
                    <span className={"w-4 h-4 bg-green-500 rounded-sm"}/>
                    <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground">Отличие средней оценки пользователя по жанру от своей средней оценки (EXPLICIT)</span>
                </li>
                <li className={"flex items-center"}>
                    <span className={"w-4 h-4 bg-blue-500 rounded-sm"}/>
                    <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground">Количество оценок (IMPLICIT)</span>
                </li>
                <li className={"flex items-center"}>
                    <span className={"w-4 h-4 bg-pink-500 rounded-sm"}/>
                    <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground">Отличие средней оценки пользователя по жанру от общей средней оценки по жанру (IMPLICIT)</span>
                </li>
                <li className={"flex items-center"}>
                    <span className={"w-4 h-4 bg-lime-500 rounded-sm"}/>
                    <span className="ml-1 text-[0.70rem] uppercase text-muted-foreground">Отличие средней оценки пользователя по жанру от своей средней оценки (IMPLICIT)</span>
                </li>
            </ul>
        );
    }
}
export function UserRatingsByGenresChart({data}: {
    // data: {
    // genre: {id:number,name:string,mean_rating:number,mean_rating_norm:number},
    //     ratings_count_implicit: number,
    //     mean_rating_difference_implicit: number,
    //     ratings_count_norm_implicit: number,
    //     mean_rating_difference_norm_implicit: number,
    //     ratings_count_explicit: number,
    //     mean_rating_difference_explicit: number,
    //     ratings_count_norm_explicit: number,
    //     mean_rating_difference_norm_explicit: number
    // }[] }
    data: UserRatingsDataByGenresExtendedT}
) {
    console.log(data.genresData.length*100)
    return (
        <ScrollArea className={"w-full pb-4"}>
        <div className={`min-w-[4200px]`}>
        <ResponsiveContainer width={"100%"} height={500}>

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
                    position={{ y: -10 }}
                    content={({active, payload}) => {



                        if (active && payload && payload.length) {
                            console.log(payload[0])
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <Tabs defaultValue="explicit" className="w-[320px]">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="explicit">Explicit</TabsTrigger>
                                            <TabsTrigger value="implicit">Implicit</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="explicit">
                                            <div className="grid grid-cols-[240px_auto] gap-2 items-center">
                                                <span className="text-[0.70rem] uppercase text-muted-foreground">Отношение оценок пользователя по жанру к общему количеству (процент/всего) (EXPLICIT)</span>
                                                <span className="font-bold">{(payload[0].payload.explicit.userCount/data.globalUser.explicit.userCount).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})} / {data.globalUser.explicit.userCount}</span>
                                                <span className="text-[0.70rem] uppercase text-muted-foreground">Количество оценок пользователя по жанру (значение/нормированное) (EXPLICIT)</span>
                                                <span className="font-bold">{payload[0].payload.explicit.userCount} / {payload[0].payload.explicit.userCountNorm.toFixed(2)}</span>
                                                <span className="text-[0.70rem] uppercase text-muted-foreground  ">Средняя оценка по жанру (общая/пользователя) (EXPLICIT) </span>
                                                <span className="font-bold">{payload[0].payload.explicit.userAvg.toFixed(2)}/{payload[0].payload.explicit.allAvg.toFixed(2)}</span>
                                                <span className="text-[0.70rem] uppercase text-muted-foreground  ">Отличие средней оценки пользователя от общей по жанру (значение/нормированное) (EXPLICIT)</span>
                                                <span className="font-bold">{payload[0].payload.explicit.allDifAvg.toFixed(2)}/{payload[0].payload.explicit.allDifAvgNorm.toFixed(2)}</span>
                                                <span className="text-[0.70rem] uppercase text-muted-foreground  ">Средняя оценка пользователя (EXPLICIT)</span>
                                                <span className="font-bold">{data.globalUser.explicit.userAvg.toFixed(2)}</span>
                                                <span className="text-[0.70rem] uppercase text-muted-foreground  ">Отличие средней оценки пользователя по жанру от своей средней (значение/нормированное) (EXPLICIT)</span>
                                                <span className="font-bold">{payload[0].payload.explicit.userDifAvg.toFixed(2)}/{payload[0].payload.explicit.userDifAvgNorm.toFixed(2)}</span>
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="implicit">
                                            <div className="grid grid-cols-[240px_auto]  gap-2 items-center">
                                                <span className="text-[0.70rem] uppercase text-muted-foreground">Отношение оценок пользователя по жанру к общему количеству (процент/всего) (IMPLICIT)</span>
                                                <span className="font-bold">{(payload[0].payload.implicit.userCount/data.globalUser.implicit.userCount).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})} / {data.globalUser.implicit.userCount}</span>
                                                <span className="text-[0.70rem] uppercase text-muted-foreground">Количество оценок пользователя по жанру (значение/нормированное) (IMPLICIT)</span>
                                                <span className="font-bold">{payload[0].payload.implicit.userCount} / {payload[0].payload.implicit.userCountNorm.toFixed(2)}</span>
                                                <span className="text-[0.70rem] uppercase text-muted-foreground  ">Средняя оценка по жанру (общая/пользователя) (IMPLICIT) </span>
                                                <span className="font-bold">{payload[0].payload.implicit.userAvg.toFixed(2)}/{payload[0].payload.implicit.allAvg.toFixed(2)}</span>
                                                <span className="text-[0.70rem] uppercase text-muted-foreground  ">Отличие средней оценки пользователя от общей по жанру (значение/нормированное) (IMPLICIT)</span>
                                                <span className="font-bold">{payload[0].payload.implicit.allDifAvg.toFixed(2)}/{payload[0].payload.implicit.allDifAvgNorm.toFixed(2)}</span>
                                                <span className="text-[0.70rem] uppercase text-muted-foreground  ">Средняя оценка пользователя (IMPLICIT)</span>
                                                <span className="font-bold">{data.globalUser.implicit.userAvg.toFixed(2)}</span>
                                                <span className="text-[0.70rem] uppercase text-muted-foreground  ">Отличие средней оценки пользователя по жанру от своей средней (значение/нормированное) (IMPLICIT)</span>
                                                <span className="font-bold">{payload[0].payload.implicit.userDifAvg.toFixed(2)}/{payload[0].payload.implicit.userDifAvgNorm.toFixed(2)}</span>
                                            </div>
                                        </TabsContent>
                                        </Tabs>


                                </div>
                            )
                        }

                        return null
                    }}
                />
                <ReferenceLine y={0} stroke="hsl(var(--foreground))" />
                <Legend  content={renderLegend} />
                <Bar dataKey="explicit.userCountNorm" className={"fill-primary"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--primary))" stroke="hsl(var(--foreground))"/>}/>
                <Bar dataKey="explicit.allDifAvgNorm" className={"fill-destructive"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--destructive))" stroke="hsl(var(--foreground))"/>}/>
                <Bar dataKey="explicit.userDifAvgNorm" className={"fill-green-500"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--fill-green-500))" stroke="hsl(var(--foreground))"/>}/>
                <Bar dataKey="implicit.userCountNorm" className={"fill-blue-500"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--fill-blue-500))" stroke="hsl(var(--foreground))"/>}/>
                <Bar dataKey="implicit.allDifAvgNorm" className={"fill-pink-500"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--fill-pink-500))" stroke="hsl(var(--foreground))"/>}/>
                <Bar dataKey="implicit.userDifAvgNorm" className={"fill-lime-500"} radius={[4, 4, 0, 0]}
                     activeBar={<Rectangle fill="hsl(var(--fill-lime-500))" stroke="hsl(var(--foreground))"/>}/>
            </BarChart>

        </ResponsiveContainer>
        </div>
            <ScrollBar orientation={"horizontal"}></ScrollBar>
        </ScrollArea>
    )
}

