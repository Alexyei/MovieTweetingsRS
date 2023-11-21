import MovieCardsSlider from "@/components/MovieCardsSlider/MovieCardsSlider";
import {getServerAPI} from "@/api/server_api";

const api = getServerAPI()


export default async function AssociationRulesSlider({title,movieID}:{title:string,movieID:string}){



    const response = await api.recs.associationRules(movieID,10)

    if (response.status != 200 || response.response.length == 0) return null;

    const moviesResponse = await api.movie.movies(response.response.map(r=>r.target))



    if (moviesResponse.status != 200) return moviesResponse.response.message;


    const sorted = response.response.map(m=>moviesResponse.response.find(mm=>mm.id==m.target)!)
  

    return <MovieCardsSlider title={title} movies={sorted}/>
}