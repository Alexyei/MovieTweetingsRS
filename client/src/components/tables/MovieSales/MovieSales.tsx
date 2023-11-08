'use client'
import {BaseTable} from "@/components/tables/BaseTable/BaseTable";
import {columns, MovieSalesT} from "@/components/tables/MovieSales/columns";
import {getClientAPI} from "@/api/client_api";
import {useEffect, useState} from "react";
import {MovieFullDataT} from "@/types/movie.types";
import {UserT} from "@/types/user.types";
import TableSkeleton from "@/components/tables/TableSkeleton/TableSkeleton";

const api = getClientAPI()
async function getData(movieID:string) {
    try {
        const response = await api.userEvent.moviePurchases(movieID)

        if (response.status != 200) return null

        const purchases = response.response

        const userIds = purchases.map(p=>p.userId)



        const usersDataResponse = await api.user.users(userIds)
        if (usersDataResponse.status != 200) return null
        const users = usersDataResponse.response

        return purchases.map(p=>{
            return {
                date:p.createdAt,
                user: users.find(u=>u.id==p.userId)!
            }
        })

    }catch (e) {
        return null
    }
}

export default function MovieSalesTable({movieID}:{movieID:string}) {
    const [data,setData] = useState<{date: string,  user: UserT}[] | null>()
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        getData(movieID).then(data=>{
            setData(data)
        }).finally(()=>setLoading(false))
    },[])

    if (loading) return <TableSkeleton/>
    if(data == null || data.length == 0) return <TableSkeleton/>

    const dataWithFilterField = data.map(r=>({...r,
        filterField:[
            r.user.login,
            r.user.email,
        ].join(" ")}))

    return (
        // <div className="container mx-auto py-10">
        <BaseTable header={`Продажи ${data.length}`} filterPlaceholder={"Пользователь..."} columns={columns} data={dataWithFilterField} />
        // </div>
    )
}