'use client'
import React, {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {getClientAPI} from "@/api/client_api";


interface User {
    id: number,
    role: string,
    email: string | null,
    login: string | null,
}

interface AuthContextType {
    user: User | null;
    logout: () => Promise<void>;
}

const UserDataContext = createContext<AuthContextType>(
    {
        user: null,
        logout: async () => {
        }
    }
)

export const useUserData = () => {
    return useContext(UserDataContext);
};

interface UserDataProviderProps {
    children: React.ReactNode
}

const api = getClientAPI()
export function UserDataProvider({children}: UserDataProviderProps) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const [user, setUser] = useState<User | null>(null);
    const [isLoading,setLoading] = useState(true)
    const router = useRouter();
    const loadUser = async () => {
        // try {
        //     const response = await fetch(API_URL + '/api/v1.0.0/auth/data', {
        //         method: 'GET',
        //         mode: "cors",
        //         credentials: 'include',
        //         headers: {
        //             'Content-type': 'application/json',
        //         },
        //     })
        //
        //     const answer = await response.json()
        //     console.log(answer)
        //     if (response.ok) {
        //         setUser(answer)
        //     } else {
        //         console.log(answer)
        //     }
        // }finally {
        //     setLoading(false)
        //
        // }
        const response = await api.authAPI.userData()
        console.log(response.status)
        if (response.status == 200){
            setUser(response.response)
        }
        setLoading(false)


    }

    const logout = async () => {
        const response = await fetch(API_URL + '/api/v1.0.0/auth/logout', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
            },
        })

        const answer = await response.json()

        if (response.ok) {
            setUser(null)
        } else {
            console.log(answer)
        }
    }

    useEffect(() => {
        loadUser().then();
    }, []);


    return <UserDataContext.Provider value={{user, logout}}>
        {isLoading ? <p>loading...</p> : children}
        {/*{children}*/}
    </UserDataContext.Provider>
}