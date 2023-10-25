import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {notFound} from "next/navigation";
import MovieCard from "@/components/MovieCard/MovieCard";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import WatchBuyMovieButton from "@/components/WatchBuyMovieButton/WatchBuyMovieButton";
import LikeUnlikeButton from "@/components/LikeUnlikeButton/LikeUnlikeButton";
import StarRating from "@/components/StarRating/StarRating";

function getData(id: string) {
    return new Promise((resolve, reject) => {
        if (id != "2") setTimeout(() => resolve(
            {
                'title': 'dfd',
                'year': 2011,
                'id': '100',
                'description': 'lorem',
                'poster_path': 'http://',
                'mean_rating': 9.1
            }), 2000)
        else setTimeout(() => reject(new Error()))
    })
}

export default async function Page({params}: { params: { id: string } }) {
    let data: any
    try {
        data = await getData(params.id)
    } catch (e) {
        notFound()
    }


    return (
        <Card>
            <CardHeader><CardTitle>{data.title}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-5 sm:grid-cols-[300px_1fr] mx-auto">
                    <div className="relative">
                        <MovieCard className="w-full max-w-[300px]  justify-self-center" movieData={data}
                                   hover={false}/>
                        <div className="absolute top-4 right-4">
                            <LikeUnlikeButton movieId={data.id}/>
                        </div>
                    </div>

                    <div className="max-w-[500px] space-y-4">
                        <div>
                            <small className='text-sm font-medium leading-none'>Год выпуска</small>
                            <p className="text-sm text-muted-foreground">{data.year}</p>
                        </div>
                        <div>
                            <small className='text-sm font-medium leading-none'>Жанры: 3</small>
                            <div className="flex flex-wrap gap-2">
                                {Array.from({length: 10}).map((_, i) => {
                                    return <Link href={"/"}><Badge>Комедия</Badge></Link>
                                })}
                            </div>
                        </div>
                        <div>
                            <small className='text-sm font-medium leading-none'>Средняя оценка: <span
                                className="text-lg font-semibold text-primary">9.1</span></small>
                            <StarRating movieId={data.id}/>
                        </div>
                        <div>
                            {/*<Button>Купить</Button>*/}
                            <WatchBuyMovieButton movieId={data.id}/>
                        </div>
                    </div>
                </div>
                <div>
                    <small className='text-sm font-medium leading-none'>Описание</small>
                    <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Beatae consequuntur, dolores, ex iste mollitia neque numquam perferendis quos ratione
                        repellat rerum sed suscipit velit. Ab asperiores blanditiis eum quia ratione.lorem</p>
                </div>
            </CardContent>
        </Card>
    )
}