import {createAuthApi} from "@/api/routes/auth";
import {clientFetchWrapper} from "@/api/helpers/client_fetch_wrapper";
import {createMovieApi} from "@/api/routes/movie";
import {createRecsApi} from "@/api/routes/recs";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
class Client_api {
    _API_URL: string

    readonly #authAPI: ReturnType<typeof createAuthApi>
    readonly #movieAPI: ReturnType<typeof createMovieApi>
    readonly #recsAPI: ReturnType<typeof createRecsApi>
    constructor(API_URL:string) {
        this._API_URL = API_URL
        this.#authAPI = createAuthApi(this._API_URL, clientFetchWrapper)
        this.#movieAPI = createMovieApi(this._API_URL,clientFetchWrapper)
        this.#recsAPI = createRecsApi(this._API_URL,clientFetchWrapper)
    }

    get auth(){
        return this.#authAPI
    }

    get movie(){
        return this.#movieAPI
    }

    get recs(){
        return this.#recsAPI
    }
}

let clientSideAPIInstance:Client_api | null = null


export function getClientAPI() {
    if (clientSideAPIInstance) return clientSideAPIInstance;
    clientSideAPIInstance = new Client_api( API_URL!)
    return clientSideAPIInstance
}