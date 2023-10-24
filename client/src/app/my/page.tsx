'use client'
import MovieCardsSlider from "@/components/MovieCardsSlider/MovieCardsSlider";
import {useUserData} from "@/context/UserDataContext";
import {useRouter} from "next/navigation";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import MovieCardsSliderSkeleton from "@/components/MovieCardsSlider/MovieCardsSliderSkeleton";

export default function Page(){
    const user = useUserData()
    const router = useRouter()



    if (user.isLoading) return (
        <>
            <MovieCardsSliderSkeleton/>
            <MovieCardsSliderSkeleton/>
        </>
    )

    if (user.user == null) router.push('/sign-in')

    return (
        <>
            <div id={"purchased"}>
                <MovieCardsSlider title={`Приобретённые фильмы: ${user.userMovies.purchased.length}`} movieData={Array.from({length:5}).fill(0)}/>
            </div>
            <div id={"liked"}>
                <MovieCardsSlider title={`Понравившиеся фильмы: ${user.userMovies.liked.length}`} movieData={Array.from({length:5}).fill(0)}/>
            </div>
        </>
    )
}