'use client'
import React, {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";

interface User {
    id: string,
    role: string,
    email: string,
    login: string,
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

export function UserDataProvider({children}: UserDataProviderProps) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const loadUser = async () => {

        const response = await fetch(API_URL + '/api/v1.0.0/auth/data', {
            method: 'GET',
            mode: "cors",
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
            },
        })

        const answer = await response.json()

        if (response.ok) {
            setUser(answer)
        } else {
            console.log(answer)
        }
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
        {/*{loading ? <FullScreenLoading/> : children}*/}
        {children}
    </UserDataContext.Provider>
}