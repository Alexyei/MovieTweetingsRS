'use client'
import {BaseTable} from "@/components/tables/BaseTable/BaseTable";
import {columns} from "@/components/tables/MovieSimilarity/columns";
import {getClientAPI} from "@/api/client_api";
import {useEffect, useState} from "react";
import {MovieFullDataT} from "@/types/movie.types";
import {UserT} from "@/types/user.types";
import TableSkeleton from "@/components/tables/TableSkeleton/TableSkeleton";


const api = getClientAPI()
async function getData(movieID:string) {
    try {
        const response = await api.movie.similaritiesForMovie(movieID)

        if (response.status != 200) return null

        const similarities = response.response

        const movieIds = similarities.map(s=>s.target)

        const moviesDataResponse = await api.movie.movies(movieIds)
        if (moviesDataResponse.status != 200) return null
        const movies = moviesDataResponse.response



        return similarities.map(s=>{
            return {
                similarity:s.similarity,
                type:s.type,
                movie: movies.find(m=>m.id==s.target)!,
            }
        })

    }catch (e) {
        return null
    }
}

export default function MovieSimilarityTable({movieID}:{movieID:string}) {
    const [data,setData] = useState<{similarity: number, type: "OTIAI", movie: MovieFullDataT}[] | null>()
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        getData(movieID).then(data=>{
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
            r.type,r.similarity,
        ].join(" ")}))

    return (
        // <div className="container mx-auto py-10">
        <BaseTable header={"Похожие фильмы"} filterPlaceholder={"Фильм, сходство, тип..."} columns={columns} data={dataWithFilterField} />
        // </div>
    )
}