import MovieCardsSlider from "@/components/MovieCardsSlider/MovieCardsSlider";
import {getServerAPI} from "@/api/server_api";

const api = getServerAPI()

export default async function CFNBItemItemRecsSlider({title}:{title:string}){
    const response = await api.recs.CFNBRecommenderItemItem()

    if (response.status != 200 || response.response.length == 0) return null;

    const moviesResponse = await api.movie.movies(response.response.map(r=>r.movieId))

    if (moviesResponse.status != 200) return null;

    return <MovieCardsSlider title={title} movies={moviesResponse.response}/>
}