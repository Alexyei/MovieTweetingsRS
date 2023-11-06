import {ApiHelper} from "@/api/helpers/api_helper";
import {fetchWrapperT} from "@/types/fetch.types";
import {UserMoviesT, UserT} from "@/types/user.types";
import {SearchParamsT} from "@/components/MovieSearchPanel/MovieSearchPanel";
import {MovieFullDataT} from "@/types/movie.types";


class UserApi extends ApiHelper {

    async userFilms() {
        const URL = this._API_URL + '/user/films/'
        return this._fetchWrapper<{ status: 200, response: UserMoviesT }, null>( URL, 'GET')
    }

    async search(searchInput:string) {
        const URL = this._API_URL + '/user/search'
        return this._fetchWrapper<{ status: 200, response: UserT[] }, {searchInput:string}>( URL, 'POST', {searchInput: searchInput})
    }
}


export function createUserApi(API_URL:string, fetchWrapper:fetchWrapperT){
    const api = new UserApi(API_URL,fetchWrapper)

    return {
        'userFilms': api.userFilms.bind(api),
        'search': api.search.bind(api)
    }
}