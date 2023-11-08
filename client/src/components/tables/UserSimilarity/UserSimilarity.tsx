'use client'
import {BaseTable} from "@/components/tables/BaseTable/BaseTable";
import {columns} from "@/components/tables/UserSimilarity/columns";
import {getClientAPI} from "@/api/client_api";
import {useEffect, useState} from "react";
import {UserT} from "@/types/user.types";
import TableSkeleton from "@/components/tables/TableSkeleton/TableSkeleton";


const api = getClientAPI()
async function getData(userID:number) {
    try {
        const response = await api.user.similaritiesForUser(userID)

        if (response.status != 200) return null

        const similarities = response.response
        const userIds = similarities.map(s=>s.target)
        const usersDataResponse = await api.user.users(userIds)
        if (usersDataResponse.status != 200) return null
        const users = usersDataResponse.response
        return similarities.map(s=>{
            return {
                type:s.type,
                similarity:s.similarity,
                user: users.find(u=>u.id==s.target)!
            }
        })

    }catch (e) {
        return null
    }
}



export default function UserSimilarityTable({userID}:{userID:number}) {
    const [data,setData] = useState<{type: "OTIAI", similarity: number, user: UserT}[] | null>()
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
            r.user.login,
            r.user.email,
            r.user.id,
            r.user.role,r.type,r.similarity
        ].join(" ")}))

    return (
        <BaseTable header={"Похожие пользователи"} filterPlaceholder={"Пользователь, сходство..."} columns={columns} data={dataWithFilterField} />
    )
}