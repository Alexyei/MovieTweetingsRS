import {createAuthApi} from "@/api/routes/auth";
import {serverFetchWrapper} from "@/api/helpers/server_fetch_wrapper";
import {createMovieApi} from "@/api/routes/movie";
import {createRecsApi} from "@/api/routes/recs";
import {createGenreApi} from "@/api/routes/genre";
import {createRatingApi} from "@/api/routes/rating";
import {createUserEventApi} from "@/api/routes/userEvent";
import {createUserApi} from "@/api/routes/user";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
class Server_api {
    _API_URL: string

    readonly #authAPI: ReturnType<typeof createAuthApi>
    readonly #movieAPI: ReturnType<typeof createMovieApi>
    readonly #recsAPI: ReturnType<typeof createRecsApi>
    readonly #genreAPI: ReturnType<typeof createGenreApi>
    readonly #ratingAPI: ReturnType<typeof createRatingApi>
    readonly #userEventAPI: ReturnType<typeof createUserEventApi>
    readonly #userAPI:ReturnType<typeof createUserApi>
    constructor(API_URL:string) {
        this._API_URL = API_URL
        this.#authAPI = createAuthApi(this._API_URL, serverFetchWrapper)
        this.#movieAPI = createMovieApi(this._API_URL,serverFetchWrapper)
        this.#recsAPI = createRecsApi(this._API_URL,serverFetchWrapper)
        this.#genreAPI = createGenreApi(this._API_URL,serverFetchWrapper)
        this.#ratingAPI = createRatingApi(this._API_URL,serverFetchWrapper)
        this.#userEventAPI = createUserEventApi(this._API_URL,serverFetchWrapper)
        this.#userAPI = createUserApi(this._API_URL,serverFetchWrapper)
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

    get genre(){
        return this.#genreAPI
    }

    get rating(){
        return this.#ratingAPI
    }

    get userEvent(){
        return this.#userEventAPI
    }

    get user(){
        return this.#userAPI
    }
}

let serverSideAPIInstance:Server_api | null = null


export function getServerAPI() {
    if (serverSideAPIInstance) return serverSideAPIInstance;
    serverSideAPIInstance = new Server_api(API_URL!)
    return serverSideAPIInstance
}