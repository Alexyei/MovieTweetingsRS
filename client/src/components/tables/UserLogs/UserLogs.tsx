'use client'
import {BaseTable} from "@/components/tables/BaseTable/BaseTable";
import {columns} from "@/components/tables/UserLogs/columns";
import {getClientAPI} from "@/api/client_api";
import {useEffect, useState} from "react";
import {MovieFullDataT} from "@/types/movie.types";
import TableSkeleton from "@/components/tables/TableSkeleton/TableSkeleton";
import {ShortGenreT} from "@/types/genre.types";
import {EventTypeT} from "@/types/user_event.types";

const api = getClientAPI()
async function getData(userID:number) {
    try {
        const response = await api.userEvent.recentUserEvents(userID)

        if (response.status != 200) return null

        const events = response.response

        const movieIds = events.filter(e=>e.movieId !=null).map(b=>b.movieId!)
        const movieDataResponse = await api.movie.movies(movieIds)
        if (movieDataResponse.status != 200) return null
        const movies = movieDataResponse.response

        const genresResponse = await api.genre.all()
        if (genresResponse.status != 200) return null
        const genres = genresResponse.response


        return events.map(e=>{
            return {
                date: e.createdAt,
                event: e.event,
                genre: genres.find(g=>g.id==e.genreId) || null,
                movie: movies.find(m=>m.id==e.movieId) || null
            }
        })



    }catch (e) {
        return null
    }
}



export default function UserLogsTable({userID}:{userID:number}) {
    const [data,setData] = useState<{date: string, event: EventTypeT, genre: ShortGenreT | null, movie: MovieFullDataT | null}[] | null>()
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
            r.event,
        ...(r.movie ? [
            r.movie.year,
            r.movie.title,
            ...r.movie.genres.map(g=>g.name)] : [r.genre?.name, r.genre?.id])
        ].join(" ")}))

    return (
        // <div className="container mx-auto py-10">
        <BaseTable header={"Действия пользователя"} filterPlaceholder={"Фильм, жанр, событие..."} columns={columns} data={dataWithFilterField} />
        // </div>
    )
}