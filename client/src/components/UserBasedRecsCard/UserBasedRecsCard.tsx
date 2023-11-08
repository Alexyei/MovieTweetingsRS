import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import * as React from "react";
import {getServerAPI} from "@/api/server_api";
import UserBasedRecsAccordion from "@/components/accordions/UserBasedRecsAccordion/UserBasedRecsAccordion";

const api = getServerAPI()

export default async function UserBasedRecsCard({userID}: { userID: number }) {
    const recsResponse = await api.recs.CFNBRecommenderUserUser(userID)
    if (recsResponse.status != 200) return null;

    const recs = recsResponse.response
    const moviesIDs = recs.map(rec => rec.movieId)

    const moviesDataResponse = await api.movie.movies(moviesIDs)

    if (moviesDataResponse.status != 200) return null;

    const moviesData = moviesDataResponse.response

    const recsData = recs.map(rec => {
        const movie = moviesData.find(m => m.id == rec.movieId)!

        return {
            movie,
            predictedRating: rec.predictedRating,
            recommendedByUsers: rec.recommendedByUsers
        }
    })
    // ВО ВЛОЖЕННОЙ ТАБЛИЦЕ ПОЛЯ user (Похожие пользователи), similarity (сходство фильмов), rating (Оценка схожего пользователя)

    return (
        <Card>
            <CardHeader>
                <CardTitle>User-based рекомендации</CardTitle>
            </CardHeader>

            <CardContent>
                {recsData.length != 0 ?
                    <ScrollArea className=" rounded-lg border bg-card text-card-foreground shadow-sm">
                        <UserBasedRecsAccordion recsData={recsData}/>
                        <ScrollBar orientation="horizontal"/>
                    </ScrollArea> : <div
                        className={"font-bold flex items-center justify-center h-32 rounded-lg border bg-card text-card-foreground shadow-sm"}>
                        Нет рекомендаций
                    </div>
                }
            </CardContent>


        </Card>
    )
}