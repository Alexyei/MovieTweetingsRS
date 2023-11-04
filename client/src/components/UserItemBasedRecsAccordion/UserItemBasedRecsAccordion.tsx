import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {movieCell} from "@/components/tables/BaseTable/base-columns";
import UserLogsTable from "@/components/tables/UserLogs/UserLogs";
import * as React from "react";

export default async function UserItemBasedRecsAccordion(){
    const movie = {id:"12345",count_ratings:10,title:"Длинное название длинного фильма",mean_rating:7.7,year:2010,description:"dd",poster_path:null,genres:[{id:1,name:'Comedy'},{id:2,name:'Drama'}]}

    // ВО ВЛОЖЕННОЙ ТАБЛИЦЕ ПОЛЯ movie (Мои фильмы), similarity (сходство фильмов), rating (Моя оценка)
    return (
        <Card>
            <CardHeader>
                <CardTitle>Item-based рекомендации</CardTitle>
            </CardHeader>

            <CardContent >
                <ScrollArea className=" rounded-lg border bg-card text-card-foreground shadow-sm">
                    <Accordion type="single" collapsible className={" px-2"}>
                        <AccordionItem value="item-1"  >
                            <AccordionTrigger className={"hover:no-underline"}>
                                <div className={"w-full flex items-center justify-between gap-4 mr-4"}>
                                    {movieCell(movie)}
                                    <p>Прогнозируемая оценка: <span className={"text-primary"}>7.7</span></p>
                                    <p>На основании (3)</p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <UserLogsTable/>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className={"hover:no-underline"}>
                                <div className={"w-full flex items-center justify-between gap-4 mr-4"}>
                                    {movieCell(movie)}
                                    <p>Прогнозируемая оценка: <span className={"text-primary"}>7.7</span></p>
                                    <p>На основании (3)</p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <UserLogsTable/>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </CardContent>


        </Card>
    )
}