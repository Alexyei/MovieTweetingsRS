import {ApiHelper} from "@/api/helpers/api_helper";
import {fetchWrapperT} from "@/types/fetch.types";
import {MovieFullDataT, MovieSimilarityT} from "@/types/movie.types";
import {SearchParamsT} from "@/components/MovieSearchPanel/MovieSearchPanel";

type MoviesPayloadT = {
    movieIDs: string[]
}

type SearchPayloadT = SearchParamsT & {take:number,skip:number}
class MovieApi extends ApiHelper {

    async movies(movieIDs:string[]) {
        const URL = this._API_URL + '/movie/movies'
        return this._fetchWrapper<{ status: 200, response: MovieFullDataT[] }, MoviesPayloadT>( URL, 'POST', {movieIDs})
    }

    async movie(movieID: string) {
        const URL = this._API_URL + '/movie/movie/'+movieID
        return this._fetchWrapper<{ status: 200, response: MovieFullDataT }, null>( URL, 'GET')
    }

    async search(searchParams:SearchParamsT,take:number,skip:number) {
        const URL = this._API_URL + '/movie/search'
        return this._fetchWrapper<{ status: 200, response: {data:MovieFullDataT[],count:number} }, SearchPayloadT>( URL, 'POST', {...searchParams,take,skip})
    }

    async similaritiesForMovie(movieID: string) {
        const URL = this._API_URL + '/movie/movie-similarities/'+movieID
        return this._fetchWrapper<{ status: 200, response: MovieSimilarityT[] }, null>( URL, 'GET')
    }
}


export function createMovieApi(API_URL:string, fetchWrapper:fetchWrapperT){
    const api = new MovieApi(API_URL,fetchWrapper)

    return {
        'movies': api.movies.bind(api),
        'movie': api.movie.bind(api),
        'search': api.search.bind(api),
        'similaritiesForMovie':api.similaritiesForMovie.bind(api)
    }
}