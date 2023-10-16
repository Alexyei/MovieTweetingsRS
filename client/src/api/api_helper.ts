import {fetchWrapperT} from "@/types/fetch.types";

export class ApiHelper{
    _API_URL: string;
    _fetchWrapper: fetchWrapperT

    constructor(API_URL:string,fetchWrapper:fetchWrapperT) {
        this._API_URL = API_URL
        this._fetchWrapper = fetchWrapper
    }
}