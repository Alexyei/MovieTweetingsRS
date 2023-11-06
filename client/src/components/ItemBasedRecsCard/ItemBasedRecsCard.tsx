import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import * as React from "react";
import {getServerAPI} from "@/api/server_api";
import ItemBasedRecsAccordion from "@/components/accordions/ItemBasedRecsAccordion/ItemBasedRecsAccordion";

const api = getServerAPI()

export default async function ItemBasedRecsCard({userID}:{userID:number}){
    const recsResponse = await api.recs.CFNBRecommenderItemItem(userID)
    if (recsResponse.status != 200) return null;

    const recs = recsResponse.response
    const moviesIDs = new Set<string>()

    recs.forEach(rec=>{
        moviesIDs.add(rec.movieId)
        rec.recommendedByMovies.forEach(m=>moviesIDs.add(m.movieId))
    })

    const moviesDataResponse = await api.movie.movies(Array.from(moviesIDs))

    if (moviesDataResponse.status != 200) return null;

    const moviesData = moviesDataResponse.response

    const recsData = recs.map(rec=> {
        const movie = moviesData.find(m => m.id == rec.movieId)!
        const data = rec.recommendedByMovies.map(r => {
            const m = moviesData.find(m => m.id == r.movieId)!

            return {
                movie: m,
                similarity: r.similarity,
                rating: r.rating
            }
        })

        return {
            movie,
            predictedRating:rec.predictedRating,
            recommendedByMovies: data
        }
    })

    // ВО ВЛОЖЕННОЙ ТАБЛИЦЕ ПОЛЯ movie (Мои фильмы), similarity (сходство фильмов), rating (Моя оценка)
    return (
        <Card>
            <CardHeader>
                <CardTitle>Item-based рекомендации</CardTitle>
            </CardHeader>

            <CardContent >
                <ScrollArea className=" rounded-lg border bg-card text-card-foreground shadow-sm">
                    <ItemBasedRecsAccordion recsData={recsData}/>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </CardContent>


        </Card>
    )
}