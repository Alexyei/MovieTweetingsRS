'use client'
import {BaseTable} from "@/components/tables/BaseTable/BaseTable";
import {UserRatingT,columns} from "@/components/tables/UserRatings/columns";
import {getClientAPI} from "@/api/client_api";
import {useEffect, useState} from "react";
import {MovieFullDataT} from "@/types/movie.types";
import TableSkeleton from "@/components/tables/TableSkeleton/TableSkeleton";


const api = getClientAPI()
async function getData(userID:number) {
    try {
        const response = await api.rating.userRatings(userID)

        if (response.status != 200) return null

        const ratings = response.response

        const movieIds = Array.from(new Set([
            ...ratings.explicit.map(r=>r.movieId),
            ...ratings.implicit.map(r=>r.movieId),
            ...ratings.priority.map(r=>r.movieId)
        ]))

        const movieDataResponse = await api.movie.movies(movieIds)

        if (movieDataResponse.status != 200) return null
        const movies = movieDataResponse.response

        const allRatings= [
        ...ratings.explicit.map(r=>({type:'EXPLICIT' as 'EXPLICIT',rating:r.rating,date:r.date,movie: movies.find(m=>m.id==r.movieId)!})),
        ...ratings.implicit.map(r=>({type:'IMPLICIT' as 'IMPLICIT',rating:r.rating,date:r.date,movie: movies.find(m=>m.id==r.movieId)!})),
        ...ratings.priority.map(r=>({type:'PRIORITY' as 'PRIORITY',rating:r.rating,date:r.date,movie: movies.find(m=>m.id==r.movieId)!})),
        ]

        allRatings.sort((a,b)=>b.date.localeCompare(a.date))

        return allRatings

    }catch (e) {
        return null
    }
}

export default function UserRatingTable({userID}:{userID:number}) {
    const [data,setData] = useState<{type: "EXPLICIT" | "IMPLICIT" | "PRIORITY", rating: number, date: string, movie: MovieFullDataT}[] | null>()
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
            r.rating
        ].join(" ")}))

    return (
        // <div className="container mx-auto py-10">
        <BaseTable header={"Оценки пользователя"} filterPlaceholder={"Фильм, тип, оценка..."} columns={columns} data={dataWithFilterField} />
        // </div>
    )
}