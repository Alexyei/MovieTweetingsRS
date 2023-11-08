import {ApiHelper} from "@/api/helpers/api_helper";
import {fetchWrapperT} from "@/types/fetch.types";
import {UserMoviesT, UserSimilarityT, UserT} from "@/types/user.types";
import {MovieSimilarityT} from "@/types/movie.types";

class UserApi extends ApiHelper {

    async userFilms() {
        const URL = this._API_URL + '/user/films/'
        return this._fetchWrapper<{ status: 200, response: UserMoviesT }, null>( URL, 'GET')
    }

    async search(searchInput:string) {
        const URL = this._API_URL + '/user/search'
        return this._fetchWrapper<{ status: 200, response: UserT[] }, {searchInput:string}>( URL, 'POST', {searchInput: searchInput})
    }

    async users(userIDs:number[]) {
        const URL = this._API_URL + '/user/users'
        return this._fetchWrapper<{ status: 200, response: UserT[] },{userIDs:number[]}>( URL, 'POST', {userIDs})
    }

    async similaritiesForUser(userID: number) {
        const URL = this._API_URL + '/user/user-similarities/'+userID
        return this._fetchWrapper<{ status: 200, response: UserSimilarityT[] }, null>( URL, 'GET')
    }
}


export function createUserApi(API_URL:string, fetchWrapper:fetchWrapperT){
    const api = new UserApi(API_URL,fetchWrapper)

    return {
        'userFilms': api.userFilms.bind(api),
        'search': api.search.bind(api),
        'users':api.users.bind(api),
        'similaritiesForUser': api.similaritiesForUser.bind(api)
    }
}