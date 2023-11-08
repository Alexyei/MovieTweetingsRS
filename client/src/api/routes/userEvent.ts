import {ApiHelper} from "@/api/helpers/api_helper";
import {fetchWrapperT} from "@/types/fetch.types";
import {
    BestSellerT,
    EventsCountT,
    EventTypeT,
    MoviePurchasesT,
    PurchasesInfoT,
    RecentPurchasesT
} from "@/types/user_event.types";
import {MovieFullDataT} from "@/types/movie.types";

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

    async eventsCount() {
        const URL = this._API_URL + '/log/events-count'
        return this._fetchWrapper<{ status: 200, response: EventsCountT }, null>( URL, 'GET', null)
    }

    async purchasesInfo() {
        const URL = this._API_URL + '/log/purchases-info'
        return this._fetchWrapper<{ status: 200, response: PurchasesInfoT }, null>( URL, 'GET', null)
    }

    async bestsellers() {
        const URL = this._API_URL + '/log/bestsellers'
        return this._fetchWrapper<{ status: 200, response: BestSellerT[] }, null>( URL, 'GET', null)
    }

    async recentPurchases() {
        const URL = this._API_URL + '/log/recent-purchases'
        return this._fetchWrapper<{ status: 200, response: RecentPurchasesT[] }, null>( URL, 'GET', null)
    }

    async moviePurchases(movieID: string) {
        const URL = this._API_URL + '/log/purchases/'+movieID
        return this._fetchWrapper<{ status: 200, response: MoviePurchasesT[] }, null>( URL, 'GET')
    }
}


export function createUserEventApi(API_URL:string, fetchWrapper:fetchWrapperT){
    const api = new UserEventApi(API_URL,fetchWrapper)

    return {
        'create': api.create.bind(api),
        'eventsCount': api.eventsCount.bind(api),
        'purchasesInfo': api.purchasesInfo.bind(api),
        'bestsellers': api.bestsellers.bind(api),
        'recentPurchases':api.recentPurchases.bind(api),
        'moviePurchases':api.moviePurchases.bind(api)
    }
}