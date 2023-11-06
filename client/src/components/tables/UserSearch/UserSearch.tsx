'use client'
import {BaseTable} from "@/components/tables/BaseTable/BaseTable";
import Search from "@/components/MovieSearchPanel/components/Search";
import {useEffect, useRef, useState} from "react";
import {UserT} from "@/types/user.types";
import {columns} from "@/components/tables/UserSearch/columns";
import {getClientAPI} from "@/api/client_api";

const api =getClientAPI()

export default function UserSearch() {
    const [data, setData] = useState<UserT[]>([])
    const input = useRef(<Search placeholder={"Login, email, id..."} className={"max-w-sm"} onInputChanged={onSearchInputChanged}/>)
    function search(searchInput:string) {
        api.user.search(searchInput).then(response=>{
            if (response.status == 200){
                const users = response.response
                setData(users)
            }
        }).catch()
    }



    const dataWithFilterField = data.map(r => ({
        ...r,
        filterField: [
            r.login,
            r.email,
        ].join(" ")
    }))

    function onSearchInputChanged(input: string) {
        search(input)
    }

    return (
        // <div className="container mx-auto py-10">
        <BaseTable input={input.current}
                   header={"Найти пользователя"} filterPlaceholder={""} columns={columns}
                   data={dataWithFilterField}/>
        // </div>
    )
}