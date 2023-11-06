'use client'
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {movieCell} from "@/components/tables/BaseTable/base-columns";
import * as React from "react";
import UserBasedTable from "@/components/tables/UserBasedTable/UserBasedTable";
import {MovieFullDataT} from "@/types/movie.types";
import {UserT} from "@/types/user.types";


export default function UserBasedRecsAccordion({recsData}: {
    recsData: {
        movie: MovieFullDataT,
        predictedRating: number,
        recommendedByUsers: { user: UserT, similarity: number, rating: number }[]
    }[]
}) {


    // ВО ВЛОЖЕННОЙ ТАБЛИЦЕ ПОЛЯ user (Похожие пользователи), similarity (сходство фильмов), rating (Оценка схожего пользователя)
    return (
        <Accordion type="single" collapsible className={" px-2"}>
            {recsData.map(rec => {
                const movie = rec.movie
                const data = rec.recommendedByUsers
                return <AccordionItem key={movie.id} value={movie.id}>
                    <AccordionTrigger className={"hover:no-underline"}>
                        <div className={"w-full flex items-center justify-between gap-4 mr-4"}>
                            {movieCell(movie)}
                            <p>Прогнозируемая оценка: <span
                                className={"text-primary"}>{rec.predictedRating.toFixed(1)}</span></p>
                            <p>На основании ({data.length})</p>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <UserBasedTable data={data} header={movie.title}/>
                    </AccordionContent>
                </AccordionItem>
            })}
        </Accordion>
    )
}