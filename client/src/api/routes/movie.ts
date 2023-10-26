import {ApiHelper} from "@/api/helpers/api_helper";
import {fetchWrapperT} from "@/types/fetch.types";
import {MovieFullDataT} from "@/types/movie.types";

type MoviesPayloadT = {
    movieIDs: string[]
}
class MovieApi extends ApiHelper {

    async movies(movieIDs:string[]) {
        const URL = this._API_URL + '/movie/movies'
        return this._fetchWrapper<{ status: 200, response: MovieFullDataT[] }, MoviesPayloadT>( URL, 'GET', {movieIDs})
    }

    async movie(movieID: string) {
        const URL = this._API_URL + '/movie/movie/'+movieID
        return this._fetchWrapper<{ status: 200, response: MovieFullDataT }, null>( URL, 'GET')
    }
}


export function createMovieApi(API_URL:string, fetchWrapper:fetchWrapperT){
    const api = new MovieApi(API_URL,fetchWrapper)

    return {
        'movies': api.movies.bind(api),
        'movie': api.movie.bind(api),
    }
}