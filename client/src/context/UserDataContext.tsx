'use client'
import React, {createContext, useContext, useEffect, useState} from "react";
import {getClientAPI} from "@/api/client_api";
import {UserMoviesT, UserT} from "@/types/user.types";
import {MovieT} from "@/types/movie.types";

const api = getClientAPI()


interface UserContextType {
    user: UserT | null;
    userMovies: UserMoviesT,
    addToList: (movie:MovieT)=>void
    removeFromList: (movie:MovieT)=>void,
    buy:(movie:MovieT)=>void,
    signIn: (values:{login:string, password:string})=>ReturnType<typeof api.authAPI.signIn>,
    signUp: (values:{login: string, email: string, password: string, confirmPassword: string})=>ReturnType<typeof api.authAPI.signUp>,
    logout: ()=>Promise<any>,
    isLoading: boolean
}

const UserDataContext = createContext<UserContextType>(
    {
        user: null,
        userMovies: {purchased:[],liked:[]},
        logout: ()=>new Promise<null>(()=>null),
        signIn: ()=>new Promise(()=>({status:400,message:""})),
        signUp: ()=>new Promise(()=>({status:400,message:""})),
        addToList: ()=>null,
        removeFromList: ()=>null,
        buy: ()=>null,
        isLoading: true
    }
)

export const useUserData = () => {
    return useContext(UserDataContext);
};

interface UserDataProviderProps {
    children: React.ReactNode
}

export function UserDataProvider({children}: UserDataProviderProps) {
    const [user, setUser] = useState<UserT | null>(null);
    const [userMovies, setUserMovies] = useState<UserMoviesT>({purchased:[],liked:[]})
    const [isLoading, setLoading] = useState(true)

    async function logout(){
        try {
            const response = await api.authAPI.logout()
            if (response.status == 200) {setUser(null)}
            console.log(response.response)
        }
        catch (e){console.log("user logout error")}
    }

    async function loadUser(){
        try {
            const response = await api.authAPI.userData()
            if (response.status == 200) {setUser(response.response)}
        }
        catch (e){console.log("user load error")}
    }

    async function loadUserMovies(){
        try {
            // const response = await api.authAPI.userData(100)
            // if (response.status == 200) {setUser(response.response)}
            setUserMovies({purchased:[],liked:[]})
        }
        catch (e){console.log("user-movies load error")}
    }

    async function addToList(movie:MovieT){
        try {
            // const response = await api.authAPI.userData(100)
            // if (response.status == 200) {setUser(response.response)}
            setUserMovies((prev)=>{
                return  {...prev,liked:[...prev.liked,movie]}
            })

            //try {api.authAPI.userData(100).then()}catch(e){}
        }
        catch (e){}
    }

    async function removeFromList(movie:MovieT){
        try {
            // const response = await api.authAPI.userData(100)
            // if (response.status == 200) {setUser(response.response)}
            setUserMovies((prev)=>{
                return  {...prev,liked:prev.liked.filter(m=>m.id!=movie.id)}
            })

            //try {api.authAPI.userData(100).then()}catch(e){}
        }
        catch (e){}
    }

    async function buy(movie:MovieT){
        try {
            // const response = await api.authAPI.userData(100)
            // if (response.status == 200) {setUser(response.response)}
            setUserMovies((prev)=>{
                return  {...prev,purchased:[...prev.purchased,movie]}
            })

            //try {api.authAPI.userData(100).then()}catch(e){}
        }
        catch (e){}
    }

    async function signIn(values:{login:string, password:string}){
        const response = await api.authAPI.signIn(values)

        if (response.status == 200){
            setUser(response.response)
            setLoading(true)
            loadUserMovies().then(()=>setLoading(false))
        }

        return response
    }

    async function signUp(values:{login: string, email: string, password: string, confirmPassword: string}){
        const response = await api.authAPI.signUp(values)

        if (response.status == 201){
            setUser(response.response)
            setLoading(true)
            loadUserMovies().then(()=>setLoading(false))
        }

        return response
    }


    useEffect(() => {
        loadUser().then(()=>loadUserMovies()).then(()=>setLoading(false))
    }, [])

    return <UserDataContext.Provider value={{user, userMovies, logout, signIn, addToList,removeFromList,buy, signUp, isLoading}}>
        {/*{isLoading ? <p>loading...</p> : children}*/}
        {children}
    </UserDataContext.Provider>
}