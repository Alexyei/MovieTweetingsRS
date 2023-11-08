import {ApiHelper} from "@/api/helpers/api_helper";
import {fetchWrapperT} from "@/types/fetch.types";
import {GenreT, ShortGenreT, UserGenreCountT, UserRatingsDataByGenresT} from "@/types/genre.types";


class GenreApi extends ApiHelper {

    async genres() {
        const URL = this._API_URL + '/genre/genres/'
        return this._fetchWrapper<{ status: 200, response: GenreT[] }, null>( URL, 'GET')
    }

    async all() {
        const URL = this._API_URL + '/genre/all/'
        return this._fetchWrapper<{ status: 200, response: ShortGenreT[] }, null>( URL, 'GET')
    }

    async genreData(name: string) {
        const URL = this._API_URL + '/genre/data/'+name
        return this._fetchWrapper<{ status: 200, response: GenreT }, null>( URL, 'GET')
    }

    async userRatingsDataByGenres(userID: number) {
        const URL = this._API_URL + '/genre/user-ratings-data/'+userID
        return this._fetchWrapper<{ status: 200, response: UserRatingsDataByGenresT }, null>( URL, 'GET')
    }

    async userGenreCount(userID: number) {
        const URL = this._API_URL + '/genre/user-genres-count/'+userID
        return this._fetchWrapper<{ status: 200, response: UserGenreCountT[] }, null>( URL, 'GET')
    }
}


export function createGenreApi(API_URL:string, fetchWrapper:fetchWrapperT){
    const api = new GenreApi(API_URL,fetchWrapper)

    return {
        'all':api.all.bind(api),
        'genres': api.genres.bind(api),
        'genreData': api.genreData.bind(api),
        'userRatingsDataByGenres':api.userRatingsDataByGenres.bind(api),
        'userGenreCount':api.userGenreCount.bind(api)
    }
}