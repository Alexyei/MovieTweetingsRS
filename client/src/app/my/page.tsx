'use client'
import {useUserData} from "@/context/UserDataContext";
import {useRouter} from "next/navigation";
import MovieCardsSliderSkeleton from "@/components/MovieCardsSlider/MovieCardsSliderSkeleton";
import UserMoviesSlider from "@/components/UserMoviesSlider/UserMoviesSlider";

export default function Page(){
    const user = useUserData()
    const router = useRouter()



    if (user.isLoading) return (
        <>
            <MovieCardsSliderSkeleton/>
            <MovieCardsSliderSkeleton/>
            <MovieCardsSliderSkeleton/>
        </>
    )

    if (user.user == null) router.push('/sign-in')

    return (
        <>
            <div id={"purchased"}>
                <UserMoviesSlider title={`Приобретённые фильмы: ${user.userMovies.purchased.length}`} type={"purchased"}/>
            </div>
            <div id={"liked"}>
                <UserMoviesSlider title={`Понравившиеся фильмы: ${user.userMovies.liked.length}`} type={"liked"}/>
            </div>
            <div id={"rated"}>
                <UserMoviesSlider title={`Оцененные фильмы: ${user.userMovies.rated.length}`} type={"rated"}/>
            </div>
        </>
    )
}