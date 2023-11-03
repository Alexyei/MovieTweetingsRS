import MovieCardsSlider from "@/components/MovieCardsSlider/MovieCardsSlider";
import {getServerAPI} from "@/api/server_api";

const api = getServerAPI()

type RecsTypeT = "pops"|"bestsellers"|"item-item"|"user-user"
export default async function RecsSlider({title,type}:{title:string,type:RecsTypeT}){

    const fetchMethods = {
        'pops':api.recs.popularityRecommenderPops,
        'bestsellers':api.recs.popularityRecommenderBestSellers,
        'item-item':api.recs.CFNBRecommenderItemItem,
        'user-user':api.recs.CFNBRecommenderUserUser
    }

    const response = await fetchMethods[type]()

    if (response.status != 200 || response.response.length == 0) return null;

    const moviesResponse = await api.movie.movies(response.response.map(r=>r.movieId))



    if (moviesResponse.status != 200) return moviesResponse.response.message;


    const sorted = response.response.map(m=>{const id = m.movieId
        return moviesResponse.response.find(mm=>mm.id==id)!
    })

    return <MovieCardsSlider title={title} movies={sorted}/>
}