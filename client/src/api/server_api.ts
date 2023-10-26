import {createAuthApi} from "@/api/routes/auth";
import {serverFetchWrapper} from "@/api/helpers/server_fetch_wrapper";
import {createMovieApi} from "@/api/routes/movie";
import {createRecsApi} from "@/api/routes/recs";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
class Server_api {
    _API_URL: string

    readonly #authAPI: ReturnType<typeof createAuthApi>
    readonly #movieAPI: ReturnType<typeof createMovieApi>
    readonly #recsAPI: ReturnType<typeof createRecsApi>
    constructor(API_URL:string) {
        this._API_URL = API_URL
        this.#authAPI = createAuthApi(this._API_URL, serverFetchWrapper)
        this.#movieAPI = createMovieApi(this._API_URL,serverFetchWrapper)
        this.#recsAPI = createRecsApi(this._API_URL,serverFetchWrapper)
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

let serverSideAPIInstance:Server_api | null = null


export function getServerAPI() {
    if (serverSideAPIInstance) return serverSideAPIInstance;
    serverSideAPIInstance = new Server_api(API_URL!)
    return serverSideAPIInstance
}