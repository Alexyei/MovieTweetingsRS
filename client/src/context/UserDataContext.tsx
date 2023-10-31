'use client'
import React, {createContext, useContext, useEffect, useState} from "react";
import {getClientAPI} from "@/api/client_api";
import {UserMoviesT, UserT} from "@/types/user.types";

const api = getClientAPI()


interface UserContextType {
    user: UserT | null;
    userMovies: UserMoviesT,
    addToList: (movieId: string) => void
    removeFromList: (movieId: string) => void,
    buy: (movieId: string) => Promise<"success"| "error">,
    rate: (movieId: string, rating: number) => Promise<"success"| "error">,
    signIn: (values: { login: string, password: string }) => ReturnType<typeof api.auth.signIn>,
    signUp: (values: {
        login: string,
        email: string,
        password: string,
        confirmPassword: string
    }) => ReturnType<typeof api.auth.signUp>,
    logout: () => Promise<any>,
    isLoading: boolean
}

const UserDataContext = createContext<UserContextType>(
    {
        user: null,
        userMovies: {purchased: [], liked: [], rated: []},
        logout: () => new Promise<null>(() => null),
        signIn: () => new Promise(() => ({status: 400, message: ""})),
        signUp: () => new Promise(() => ({status: 400, message: ""})),
        addToList: () => null,
        removeFromList: () => null,
        buy: () => new Promise<"success"| "error">(() => null),
        rate: () => new Promise<"success"| "error">(() => null),
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
    const [userMovies, setUserMovies] = useState<UserMoviesT>({purchased: [], liked: [], rated: []})
    const [isLoading, setLoading] = useState(true)

    async function logout() {
        try {
            const response = await api.auth.logout()
            if (response.status == 200) {
                setUser(null)
            }
            console.log(response.response)
        } catch (e) {
            console.log("user logout error")
        }
    }

    async function loadUser() {
        try {
            const response = await api.auth.userData()
            if (response.status == 200) {
                setUser(response.response)
            }
        } catch (e) {
            console.log("user load error")
        }
    }

    async function loadUserMovies() {
        try {
            const response = await api.user.userFilms()
            if (response.status == 200) {
                setUserMovies(response.response)
            }
        } catch (e) {
            console.log("user-movies load error")
        }
    }

    async function addToList(movieId: string) {
        try {
            // const response = await api.authAPI.userData(100)
            // if (response.status == 200) {setUser(response.response)}
            setUserMovies((prev) => {
                return {...prev, liked: [...prev.liked, {id: movieId}]}
            })

            //try {api.authAPI.userData(100).then()}catch(e){}
        } catch (e) {
        }
    }

    async function removeFromList(movieId: string) {
        try {
            // const response = await api.authAPI.userData(100)
            // if (response.status == 200) {setUser(response.response)}
            setUserMovies((prev) => {
                return {...prev, liked: prev.liked.filter(m => m.id != movieId)}
            })

            //try {api.authAPI.userData(100).then()}catch(e){}
        } catch (e) {
        }
    }

    async function buy(movieId: string) {
        try {
            const response = await api.userEvent.create(movieId,null,"BUY")
            if (response.status == 200) {
                setUserMovies((prev) => {
                    return {...prev, purchased: [...prev.purchased, {id: movieId}]}
                })

                return "success"
            }
            return "error"
        } catch (e) {
            return "error"
        }
    }

    async function rate(movieId: string, rating: number) {
        try {
            const response = await api.rating.rate(movieId,rating)

            if (response.status == 200){

            setUserMovies((prev) => {
                let movie = prev.rated.filter(m => m.id == movieId)[0]
                if (movie) movie.rating = rating
                else movie = {id: movieId, rating}

                return {...prev, rated: [...prev.rated.filter(m => m.id != movieId), movie]}
            })
                return "success"
            }

            return "error"
        } catch (e) {
            return "error"
        }
    }

    async function signIn(values: { login: string, password: string }) {
        const response = await api.auth.signIn(values)

        if (response.status == 200) {
            setUser(response.response)
            setLoading(true)
            loadUserMovies().then(() => setLoading(false))
        }

        return response
    }

    async function signUp(values: { login: string, email: string, password: string, confirmPassword: string }) {
        const response = await api.auth.signUp(values)

        if (response.status == 201) {
            setUser(response.response)
            setLoading(true)
            loadUserMovies().then(() => setLoading(false))
        }

        return response
    }


    useEffect(() => {
        loadUser().then(() => loadUserMovies()).then(() => setLoading(false))
    }, [])

    return <UserDataContext.Provider
        value={{user, userMovies, logout, signIn, addToList, removeFromList, buy, signUp, rate, isLoading}}>
        {/*{isLoading ? <p>loading...</p> : children}*/}
        {children}
    </UserDataContext.Provider>
}