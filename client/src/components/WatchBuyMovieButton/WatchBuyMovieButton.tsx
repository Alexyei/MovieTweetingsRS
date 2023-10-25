'use client'
import {useUserData} from "@/context/UserDataContext";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {MovieT} from "@/types/movie.types";

const WatchBuyMovieButton = ({movieId}:{movieId:string})=>{
    const user = useUserData()

    if (user.isLoading)
        return <Skeleton className="h-12 w-[100px]" />

    if (user.userMovies.purchased.filter(m=>m.id === movieId).length)
        return <Button disabled={true} variant="destructive">Смотреть</Button>

    function onBuyHandler(){
        user.buy(movieId)
        console.log("bought",movieId)
    }

    return (
        <Button onClick={onBuyHandler}>Купить</Button>
    )
}

export default WatchBuyMovieButton