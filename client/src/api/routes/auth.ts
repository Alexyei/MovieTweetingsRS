import {ApiHelper} from "@/api/api_helper";
import {fetchWrapperT} from "@/types/fetch.types";
import {UserDataT} from "@/types/user.types";

type SignUpPayloadT = {
    login: string, email: string, password: string, confirmPassword: string
}

type SignInPayloadT = {
    login: string, password: string,
}




class AuthApi extends ApiHelper {

    async SignUp(payload: SignUpPayloadT) {
        const URL = this._API_URL + '/auth/signup'
        return this._fetchWrapper<{ status: 201, response: UserDataT }, SignUpPayloadT>( URL, 'POST', payload)
    }

    async SignIn(payload: SignInPayloadT) {
        const URL = this._API_URL + '/auth/login'
        return this._fetchWrapper<{ status: 200, response: UserDataT }, SignInPayloadT>( URL, 'POST', payload)
    }

    async UserData(userId?: number){

        let URL = this._API_URL + '/auth/data/'

        if (userId)
            URL += userId

        return this._fetchWrapper<{ status: 200, response: UserDataT} ,null>( URL, 'GET')

    }

    async Logout(userId?: number){

        let URL = this._API_URL + '/auth/logout/'

        if (userId)
            URL += userId

        return this._fetchWrapper<{ status: 200, response: any} ,null>( URL, 'DELETE')

    }
}


export function createAuthApi(API_URL:string, fetchWrapper:fetchWrapperT){
    const api = new AuthApi(API_URL,fetchWrapper)

    return {
        'signUp': api.SignUp.bind(api),
        'signIn': api.SignIn.bind(api),
        'logout': api.Logout.bind(api),
        'userData':api.UserData.bind(api),
    }
}