import {createAuthApi} from "@/api/routes/auth";
import {serverFetchWrapper} from "@/api/server_fetch_wrapper";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
class Client_api {
    _API_URL: string

    readonly #authAPI: ReturnType<typeof createAuthApi>
    constructor(API_URL:string) {
        this._API_URL = API_URL
        this.#authAPI = createAuthApi(this._API_URL, serverFetchWrapper)
    }

    get authAPI(){
        return this.#authAPI
    }
}

let clientSideAPIInstance:Client_api | null = null


export function getServerAPI() {
    if (clientSideAPIInstance) return clientSideAPIInstance;
    clientSideAPIInstance = new Client_api(API_URL!)
    return clientSideAPIInstance
}