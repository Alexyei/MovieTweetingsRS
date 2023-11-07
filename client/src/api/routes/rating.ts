import {ApiHelper} from "@/api/helpers/api_helper";
import {fetchWrapperT} from "@/types/fetch.types";
import {RatingDistributionT} from "@/types/rating.types";

type RatePayloadT = {
    movieID: string,
    rating: number
}
class RatingApi extends ApiHelper {
    async rate(movieID:string,rating:number) {
        const URL = this._API_URL + '/rating/rate'
        return this._fetchWrapper<{ status: 200, response: any }, RatePayloadT>( URL, 'POST', {movieID,rating})
    }

    async distribution() {
        const URL = this._API_URL + '/rating/distribution'
        return this._fetchWrapper<{ status: 200, response: RatingDistributionT }, null>( URL, 'GET', null)
    }
}


export function createRatingApi(API_URL:string, fetchWrapper:fetchWrapperT){
    const api = new RatingApi(API_URL,fetchWrapper)

    return {
        'rate': api.rate.bind(api),
        'distribution':api.distribution.bind(api)
    }
}