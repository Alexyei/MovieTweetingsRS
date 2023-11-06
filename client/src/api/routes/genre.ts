import {ApiHelper} from "@/api/helpers/api_helper";
import {fetchWrapperT} from "@/types/fetch.types";
import {GenreT, UserRatingsDataByGenresT} from "@/types/genre.types";


class GenreApi extends ApiHelper {

    async genres() {
        const URL = this._API_URL + '/genre/genres/'
        return this._fetchWrapper<{ status: 200, response: GenreT[] }, null>( URL, 'GET')
    }

    async genreData(name: string) {
        const URL = this._API_URL + '/genre/data/'+name
        return this._fetchWrapper<{ status: 200, response: GenreT }, null>( URL, 'GET')
    }

    async userRatingsDataByGenres(userID: number) {
        const URL = this._API_URL + '/genre/user-ratings-data/'+userID
        return this._fetchWrapper<{ status: 200, response: UserRatingsDataByGenresT }, null>( URL, 'GET')
    }
}


export function createGenreApi(API_URL:string, fetchWrapper:fetchWrapperT){
    const api = new GenreApi(API_URL,fetchWrapper)

    return {
        'genres': api.genres.bind(api),
        'genreData': api.genreData.bind(api),
        'userRatingsDataByGenres':api.userRatingsDataByGenres.bind(api)
    }
}