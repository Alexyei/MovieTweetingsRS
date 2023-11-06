'use client'
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {movieCell} from "@/components/tables/BaseTable/base-columns";
import * as React from "react";
import ItemBasedTable from "@/components/tables/ItemBasedTable/ItemBasedTable";
import {MovieFullDataT} from "@/types/movie.types";



export default function ItemBasedRecsAccordion( {recsData}:{recsData: {movie: MovieFullDataT, predictedRating: number, recommendedByMovies: {movie: MovieFullDataT, similarity: number, rating: number}[]}[]}){
    // ВО ВЛОЖЕННОЙ ТАБЛИЦЕ ПОЛЯ movie (Мои фильмы), similarity (сходство фильмов), rating (Моя оценка)
    return (
        <Accordion type="single" collapsible className={" px-2"}>
            {recsData.map(rec=>{
                const movie = rec.movie
                const data = rec.recommendedByMovies
                return <AccordionItem key={movie.id} value={movie.id}  >
                    <AccordionTrigger className={"hover:no-underline"}>
                        <div className={"w-full flex items-center justify-between gap-4 mr-4"}>
                            {movieCell(movie)}
                            <p>Прогнозируемая оценка: <span className={"text-primary"}>{rec.predictedRating.toFixed(1)}</span></p>
                            <p>На основании ({data.length})</p>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <ItemBasedTable data={data} header={movie.title}/>
                    </AccordionContent>
                </AccordionItem>
            })}

        </Accordion>
    )
}