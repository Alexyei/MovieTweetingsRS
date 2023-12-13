import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {notFound} from "next/navigation";
import MovieCard from "@/components/MovieCard/MovieCard";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import WatchBuyMovieButton from "@/components/WatchBuyMovieButton/WatchBuyMovieButton";
import LikeUnlikeButton from "@/components/LikeUnlikeButton/LikeUnlikeButton";
import StarRating from "@/components/StarRating/StarRating";
import {MovieFullDataT} from "@/types/movie.types";
import AssociationRulesSlider from "@/components/AssociationRulesSlider/AssociationRulesSlider";

import {getServerAPI} from "@/api/server_api";

const api = getServerAPI()




export default async function Page({params}: { params: { id: string } }) {
    
    const movieID = params.id
    const response = await api.movie.movie(movieID)
    if (response.status == 400){
        notFound()
    }

    const movie = response.response as MovieFullDataT


    try{
        const response = await api.userEvent.create(movie.id,null,"MORE_DETAILS")
    }catch (e){
        
    }

    return (
        <>
        <Card>
            <CardHeader><CardTitle>{movie.title}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-5 sm:grid-cols-[300px_1fr] mx-auto">
                    <div className="relative max-w-[300px]">
                        <MovieCard link={false} className="w-full max-w-[300px]  justify-self-center" movie={movie}
                                   hover={false}/>
                        <div className="absolute top-4 right-4">
                            <LikeUnlikeButton movieId={movie.id}/>
                        </div>
                    </div>

                    <div className="max-w-[500px] space-y-4">
                        <div>
                            <small className='text-sm font-medium leading-none'>Год выпуска</small>
                            <p className="text-sm text-muted-foreground">{movie.year}</p>
                        </div>
                        <div>
                            <small className='text-sm font-medium leading-none'>Жанры: {movie.genres.length}</small>
                            <div className="flex flex-wrap gap-2">
                                {movie.genres.map((genre, i) => {
                                    return <Link key={genre.id} href={`/genre/${genre.name}`}><Badge>{genre.name}</Badge></Link>
                                })}
                            </div>
                        </div>
                        <div>
                            <small className='text-sm font-medium leading-none'>Средняя оценка ({movie.count_ratings}): <span
                                className="text-lg font-semibold text-primary">{movie.mean_rating.toFixed(1)} / 10.0</span></small>
                            <StarRating movieId={movie.id}/>
                        </div>
                        <div>
                            <WatchBuyMovieButton movieId={movie.id}/>
                        </div>
                    </div>
                </div>
                <div>
                    <small className='text-sm font-medium leading-none'>Описание</small>
                    <p className="text-sm text-muted-foreground">{movie.description || "Описание отсутствует" }</p>
                </div>
            </CardContent>
        </Card>
        <AssociationRulesSlider title={"С этим фильмом смотрят"} movieID={movieID}/></>
    )
}