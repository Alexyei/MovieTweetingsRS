'use client'
import {BaseTable} from "@/components/tables/BaseTable/BaseTable";
import {columns} from "@/components/tables/TopSales/columns";
import {getClientAPI} from "@/api/client_api";
import {useEffect, useState} from "react";
import {MovieFullDataT} from "@/types/movie.types";
import TableSkeleton from "@/components/tables/TableSkeleton/TableSkeleton";


const api = getClientAPI()
async function getData() {
    try {
        const response = await api.userEvent.bestsellers()

        if (response.status != 200) return null

        const bestsellers = response.response

        const movieIds = bestsellers.map(b=>b.movieId)

        const movieDataResponse = await api.movie.movies(movieIds)

        if (movieDataResponse.status != 200) return null
        const movies = movieDataResponse.response
        return bestsellers.map(b=>{
            return {
                count:b.count,
                movie: movies.find(m=>m.id==b.movieId)!
            }
        })

    }catch (e) {
        return null
    }
}
export default function TopSalesTable() {
    const [data,setData] = useState<{count: number, movie: MovieFullDataT}[] | null>()
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        getData().then(data=>{
            setData(data)
        }).finally(()=>setLoading(false))
    },[])

    if (loading) return <TableSkeleton/>
    if(data == null) return <TableSkeleton/>



    const dataWithFilterField = data.map(r=>({...r,
        filterField:[
            r.movie.year,
            r.movie.title,
            r.count,
            ...r.movie.genres.map(g=>g.name),
        ].join(" ")}))

    return (
        // <div className="container mx-auto py-10">
        <BaseTable header={"Топ продаж"} filterPlaceholder={"Фильм..."} columns={columns} data={dataWithFilterField} />
        // </div>
    )
}