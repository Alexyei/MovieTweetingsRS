import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {notFound} from "next/navigation";
import MovieCard from "@/components/MovieCard/MovieCard";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import WatchBuyMovieButton from "@/components/WatchBuyMovieButton/WatchBuyMovieButton";
import LikeUnlikeButton from "@/components/LikeUnlikeButton/LikeUnlikeButton";
import StarRating from "@/components/StarRating/StarRating";
import {getServerAPI} from "@/api/server_api";
import {MovieFullDataT} from "@/types/movie.types";

// function getData(id: string) {
//     return new Promise((resolve, reject) => {
//         if (id != "2") setTimeout(() => resolve(
//             {
//                 'title': 'dfd',
//                 'year': 2011,
//                 'id': '100',
//                 'description': 'lorem',
//                 'poster_path': 'http://',
//                 'mean_rating': 9.1
//             }), 2000)
//         else setTimeout(() => reject(new Error()))
//     })
// }

const api = getServerAPI()
export default async function Page({params}: { params: { id: string } }) {

    const response = await api.movie.movie(params.id)
    if (response.status == 400){
        notFound()
    }

    const movie = response.response as MovieFullDataT

    // let data: any
    // try {
    //     data = await getData(params.id)
    // } catch (e) {
    //     notFound()
    // }


    return (
        <Card>
            <CardHeader><CardTitle>{movie.title}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-5 sm:grid-cols-[300px_1fr] mx-auto">
                    <div className="relative">
                        <MovieCard className="w-full max-w-[300px]  justify-self-center" movie={movie}
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
                                    return <Link key={genre.id} href={"/"}><Badge>{genre.name}</Badge></Link>
                                })}
                            </div>
                        </div>
                        <div>
                            <small className='text-sm font-medium leading-none'>Средняя оценка: <span
                                className="text-lg font-semibold text-primary">{movie.mean_rating.toFixed(1)} / 10.0</span></small>
                            <StarRating movieId={movie.id}/>
                        </div>
                        <div>
                            {/*<Button>Купить</Button>*/}
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
    )
}