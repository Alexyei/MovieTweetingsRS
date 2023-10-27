'use client'
import MovieCardsSlider from "@/components/MovieCardsSlider/MovieCardsSlider";
import {getClientAPI} from "@/api/client_api";
import {useUserData} from "@/context/UserDataContext";
import {useEffect, useState} from "react";
import {MovieFullDataT} from "@/types/movie.types";
import MovieCardsSliderSkeleton from "@/components/MovieCardsSlider/MovieCardsSliderSkeleton";

const api = getClientAPI()

type MoviesTypeT = "purchased"|"liked"|"rated"
export default function UserMoviesSlider({title,type}:{title:string,type:MoviesTypeT}){
    const [isLoading, setIsLoading] = useState(true)
    const [movies,setMovies]=useState<MovieFullDataT[]>([])
    const user = useUserData()

    const moviesIds = user.userMovies[type].map(r=>r.id)



    useEffect(()=>{

            api.movie.movies(moviesIds).then(moviesResponse=>{
                if(moviesResponse.status == 200)
                    setMovies(moviesResponse.response)
            }).finally(()=>setIsLoading(false))
    },[])



    if (isLoading)
        return <MovieCardsSliderSkeleton/>

    return <MovieCardsSlider title={title} movies={movies}/>
}