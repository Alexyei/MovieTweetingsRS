'use client'
import {BaseTable} from "@/components/tables/BaseTable/BaseTable";
import {columns} from "@/components/tables/UserCollection/columns";
import {getClientAPI} from "@/api/client_api";
import {useEffect, useState} from "react";
import {MovieFullDataT} from "@/types/movie.types";
import TableSkeleton from "@/components/tables/TableSkeleton/TableSkeleton";


const api = getClientAPI()
async function getData(userID:number) {
    try {
        const response = await api.user.userFilms(userID)

        if (response.status != 200) return null

        const films = response.response

        const movieIds = Array.from(new Set([...films.liked.map(m=>m.id),...films.purchased.map(m=>m.id)]))


        const movieDataResponse = await api.movie.movies(movieIds)

        if (movieDataResponse.status != 200) return null
        const movies = movieDataResponse.response

        return [
        ...films.liked.map(f=>{
                return {
                    type: "IN LIST" as "IN LIST",
                    movie: movies.find(m=>m.id==f.id)!
                }
            }),
            ...films.purchased.map(f=>{
                return {
                    type: "BUY" as "BUY",
                    movie: movies.find(m=>m.id==f.id)!
                }
            })
        ]

    }catch (e) {
        return null
    }
}

export default function UserCollectionTable({userID}:{userID:number}) {
    const [data,setData] = useState<{type: "IN LIST" | "BUY", movie: MovieFullDataT}[] | null>()
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        getData(userID).then(data=>{
            setData(data)
        }).finally(()=>setLoading(false))
    },[])

    if (loading) return <TableSkeleton/>
    if(data == null) return <TableSkeleton/>

    const dataWithFilterField = data.map(r=>({...r,
        filterField:[
            r.movie.year,
            r.movie.title,
            ...r.movie.genres.map(g=>g.name),
            r.type,
        ].join(" ")}))

    return (
        // <div className="container mx-auto py-10">
        <BaseTable header={"Фильмы пользователя"} filterPlaceholder={"Фильм, тип..."} columns={columns} data={dataWithFilterField} />
        // </div>
    )
}