import {ApiHelper} from "@/api/helpers/api_helper";
import {fetchWrapperT} from "@/types/fetch.types";
import {MovieFullDataT} from "@/types/movie.types";
import {
    CFNBRecsItemItemT,
    CFNBRecsUserUserT,
    PopularityRecsBestsellersT,
    PopularityRecsPopsT
} from "@/types/recs.types";


class RecsApi extends ApiHelper {

    async popularityRecommenderPops(userID?: number) {
        let URL = this._API_URL + '/rec/pop/pops/'
        if (userID)
            URL += userID

        URL +='?take=11'

        return this._fetchWrapper<{ status: 200, response: PopularityRecsPopsT[] }, null>( URL, 'GET')
    }

    async popularityRecommenderBestSellers(userID?: number) {
        let URL = this._API_URL + '/rec/pop/bestsellers/'
        if (userID)
            URL += userID
        return this._fetchWrapper<{ status: 200, response: PopularityRecsBestsellersT[] }, null>( URL, 'GET')
    }

    async CFNBRecommenderItemItem(userID?: number) {
        let URL = this._API_URL + '/rec/cf/nb/item-item/'

        if (userID)
            URL += userID

        return this._fetchWrapper<{ status: 200, response: CFNBRecsItemItemT[] }, null>( URL, 'GET')
    }

    async CFNBRecommenderUserUser(userID?: number) {
        let URL = this._API_URL + '/rec/cf/nb/user-user/'

        if (userID)
            URL += userID

        return this._fetchWrapper<{ status: 200, response: CFNBRecsUserUserT[] }, null>( URL, 'GET')
    }
}


export function createRecsApi(API_URL:string, fetchWrapper:fetchWrapperT){
    const api = new RecsApi(API_URL,fetchWrapper)

    return {
        'popularityRecommenderPops': api.popularityRecommenderPops.bind(api),
        'popularityRecommenderBestSellers': api.popularityRecommenderBestSellers.bind(api),
        'CFNBRecommenderItemItem': api.CFNBRecommenderItemItem.bind(api),
        'CFNBRecommenderUserUser': api.CFNBRecommenderUserUser.bind(api),

    }
}