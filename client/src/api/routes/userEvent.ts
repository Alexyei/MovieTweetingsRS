import {ApiHelper} from "@/api/helpers/api_helper";
import {fetchWrapperT} from "@/types/fetch.types";
import {MovieFullDataT} from "@/types/movie.types";
import {EventTypeT} from "@/types/user_event.types";

type CreatePayloadT = {
    movieID:string | null
    genreID:number|null,
    type:EventTypeT
}
class UserEventApi extends ApiHelper {
    async create(movieID:string | null,genreID:number|null,type:EventTypeT) {
        const URL = this._API_URL + '/log/create'
        return this._fetchWrapper<{ status: 200, response: "success" }, CreatePayloadT>( URL, 'POST', {movieID,genreID,type})
    }
}


export function createUserEventApi(API_URL:string, fetchWrapper:fetchWrapperT){
    const api = new UserEventApi(API_URL,fetchWrapper)

    return {
        'create': api.create.bind(api),
    }
}