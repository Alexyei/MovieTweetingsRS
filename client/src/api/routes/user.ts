import {ApiHelper} from "@/api/helpers/api_helper";
import {fetchWrapperT} from "@/types/fetch.types";
import {UserMoviesT} from "@/types/user.types";


class UserApi extends ApiHelper {

    async userFilms() {
        const URL = this._API_URL + '/user/films/'
        return this._fetchWrapper<{ status: 200, response: UserMoviesT }, null>( URL, 'GET')
    }
}


export function createUserApi(API_URL:string, fetchWrapper:fetchWrapperT){
    const api = new UserApi(API_URL,fetchWrapper)

    return {
        'userFilms': api.userFilms.bind(api),
    }
}