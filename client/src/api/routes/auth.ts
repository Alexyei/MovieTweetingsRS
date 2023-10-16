import {clientFetchWrapper} from "@/api/client_fetch_wrapper";
import {serverFetchWrapper} from "@/api/server_fetch_wrapper";
import {ApiHelper} from "@/api/api_helper";
import {fetchWrapperT} from "@/types/fetch.types";

type SignUpPayloadT = {
    login: string, email: string, password: string, confirmPassword: string
}

type ErrorResponse = {
    status: 400 | 401 | 403,
    response: { message: string }
}

type UserDataT = { login: string | null, id: number, email: string | null, role: "ADMIN" | "USER" }
class AuthApi extends ApiHelper {

    async SignUp(payload: SignUpPayloadT) {
        const URL = this._API_URL + '/api/v1.0.0/auth/signup'
        return this._fetchWrapper<{ status: 201, response: UserDataT }, SignUpPayloadT>( URL, 'POST', payload)
    }

    async UserData(userId?: number){

        let URL = this._API_URL + '/api/v1.0.0/auth/data'

        if (userId)
            URL += userId

        return this._fetchWrapper<{ status: 200, response: UserDataT} ,null>( URL, 'GET')

    }
}


export function createAuthApi(API_URL:string, fetchWrapper:fetchWrapperT){
    const api = new AuthApi(API_URL,fetchWrapper)

    return {
        'signUp': api.SignUp.bind(api),
        'userData':api.UserData.bind(api),
    }
}