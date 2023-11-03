'use client'
import {BaseTable} from "@/components/tables/BaseTable/BaseTable";
import Search from "@/components/MovieSearchPanel/components/Search";
import {useEffect, useRef, useState} from "react";
import {UserT} from "@/types/user.types";
import {columns} from "@/components/tables/UserSearch/columns";

export default function UserSearch() {
    const [data, setData] = useState<UserT[]>([])
    const input = useRef(<Search placeholder={"Login, email, id..."} className={"max-w-sm"} onInputChanged={onSearchInputChanged}/>)
    function search(input:string) {
        new Promise<UserT[]>((resolve, reject) => {
            setTimeout(() => resolve([
                {
                    id: 1,
                    login: "login",
                    "email": null,
                    role: "USER"
                },
                {
                    id: 2,
                    login: "login2",
                    "email": "admin@email.ru",
                    role: "ADMIN"
                }
            ]), 2000)
        }).then(users=>setData(users))
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