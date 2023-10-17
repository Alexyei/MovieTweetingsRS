'use client'
import React, {createContext, useContext, useEffect, useState} from "react";
import {getClientAPI} from "@/api/client_api";

const api = getClientAPI()


interface User {
    id: number,
    role: string,
    email: string | null,
    login: string | null,
}

interface UserContextType {
    user: User | null;
    logout: typeof api.authAPI.logout,
    isLoading: boolean
}

const UserDataContext = createContext<UserContextType>(
    {
        user: null,
        logout: api.authAPI.logout,
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
    const [user, setUser] = useState<User | null>(null);
    const [isLoading,setLoading] = useState(true)
    const loadUser = async () => {

        try {
            const response = await api.authAPI.userData(100)
            console.log(response.status)
            if (response.status == 200){
                setUser(response.response)
            }
        }finally {
            setLoading(false)
        }

    }
    const logout = api.authAPI.logout

    useEffect(()=>{
        loadUser().then()
    },[])

    return <UserDataContext.Provider value={{user, logout, isLoading}}>
        {/*{isLoading ? <p>loading...</p> : children}*/}
        {children}
    </UserDataContext.Provider>
}