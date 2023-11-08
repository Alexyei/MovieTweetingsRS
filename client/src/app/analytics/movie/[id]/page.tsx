import {getServerAPI} from "@/api/server_api";
import ServerAdminRoute from "@/components/routes/ServerAdminRoute/ServerAdminRoute";
import MovieSalesTable from "@/components/tables/MovieSales/MovieSales";
import MovieSimilarityTable from "@/components/tables/MovieSimilarity/MovieSimilarity";
import {notFound} from "next/navigation";
import {MovieFullDataT} from "@/types/movie.types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import MovieCard from "@/components/MovieCard/MovieCard";
import LikeUnlikeButton from "@/components/LikeUnlikeButton/LikeUnlikeButton";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import StarRating from "@/components/StarRating/StarRating";
import WatchBuyMovieButton from "@/components/WatchBuyMovieButton/WatchBuyMovieButton";

const api = getServerAPI()
export default async function Page({params}: { params: { id: string } }){
    const movieID = params.id
    const response = await api.movie.movie(movieID)
    if (response.status == 400){
        notFound()
    }

    const movie = response.response as MovieFullDataT

    return (
        <ServerAdminRoute>
            <Card>
                <CardHeader><CardTitle>{movie.title}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-5 sm:grid-cols-[300px_1fr] mx-auto">
                        <div className="relative">
                            <MovieCard link={false} className="w-full max-w-[300px]  justify-self-center" movie={movie}
                                       hover={false}/>

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
                            </div>
                        </div>
                    </div>
                    <div>
                        <small className='text-sm font-medium leading-none'>Описание</small>
                        <p className="text-sm text-muted-foreground">{movie.description || "Описание отсутствует" }</p>
                    </div>
                </CardContent>
            </Card>
            <div className="grid  w-full gap-4 lg:grid-cols-2">
                <MovieSalesTable movieID={movieID}/>
                <MovieSimilarityTable/>
            </div>
        </ServerAdminRoute>
    )
}