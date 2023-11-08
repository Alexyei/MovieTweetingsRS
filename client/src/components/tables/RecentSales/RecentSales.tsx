'use client'
import {SalesT} from "@/components/tables/RecentSales/columns";
import {columns} from "@/components/tables/RecentSales/columns";
import {BaseTable} from "@/components/tables/BaseTable/BaseTable";
import {getClientAPI} from "@/api/client_api";
import {useEffect, useState} from "react";
import {MovieFullDataT} from "@/types/movie.types";
import TableSkeleton from "@/components/tables/TableSkeleton/TableSkeleton";
import {UserT} from "@/types/user.types";


const api = getClientAPI()
async function getData() {
    try {
        const response = await api.userEvent.recentPurchases()

        if (response.status != 200) return null

        const purchases = response.response

        const movieIds = purchases.map(p=>p.movieId)
        const userIds = purchases.map(p=>p.userId)

        const moviesDataResponse = await api.movie.movies(movieIds)
        if (moviesDataResponse.status != 200) return null
        const movies = moviesDataResponse.response

        const usersDataResponse = await api.user.users(userIds)
        if (usersDataResponse.status != 200) return null
        const users = usersDataResponse.response

        return purchases.map(p=>{
            return {
                date:p.createdAt,
                movie: movies.find(m=>m.id==p.movieId)!,
                user: users.find(u=>u.id==p.userId)!
            }
        })

    }catch (e) {
        return null
    }
}

// async function getData(): Promise<SalesT[]> {
//     return [
//         {user:{id:1,login:"длинный_логин",email:"Длинное_email@email.ru",role:"USER"}, date: "2023-10-02T07:41:47.267Z", movie:{id:"12345",count_ratings:10,title:"Длинное название длинного фильма",mean_rating:7.7,year:2010,description:"dd",poster_path:null,genres:[{id:1,name:'Comedy'},{id:2,name:'Drama'}]}},
//         {user:{id:1,login:"длинный_логин",email:"Длинное_email@email.ru",role:"USER"}, date: "2023-10-02T07:41:47.267Z", movie:{id:"12345",count_ratings:10,title:"Длинное название длинного фильма",mean_rating:7.7,year:2010,description:"dd",poster_path:null,genres:[{id:1,name:'Comedy'},{id:3,name:'Action'}]}},
//     ]
// }

export default function RecentSalesTable() {
    // const data = await getData()
    const [data,setData] = useState<{date: string, movie: MovieFullDataT, user: UserT}[] | null>()
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        getData().then(data=>{
            setData(data)
        }).finally(()=>setLoading(false))
    },[])

    if (loading) return <TableSkeleton/>
    if(data == null || data.length == 0) return <TableSkeleton/>

    const dataWithFilterField = data.map(r=>({...r,
        filterField:[
            r.user.login,
            r.user.email,
            r.movie.year,
            r.movie.title,
            ...r.movie.genres.map(g=>g.name),
        ].join(" ")}))

    return (
        // <div className="container mx-auto py-10">
        <BaseTable header={"Недавние продажи"} filterPlaceholder={"Пользователь, фильм..."} columns={columns} data={dataWithFilterField} />
        // </div>
    )
}