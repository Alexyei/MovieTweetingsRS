'use client'
import {BaseTable} from "@/components/tables/BaseTable/BaseTable";

import {getClientAPI} from "@/api/client_api";
import {useEffect, useState} from "react";
import {MovieFullDataT} from "@/types/movie.types";
import TableSkeleton from "@/components/tables/TableSkeleton/TableSkeleton";
import { TableAssociationRuleT, columns } from "./columns";


const api = getClientAPI()
async function getData(movieID:string) {
    try {
        const response = await api.recs.associationRules(movieID)

        if (response.status != 200) return null

        const rules = response.response

        const movieIds = rules.map(r=>r.target)

        const moviesDataResponse = await api.movie.movies(movieIds)
        if (moviesDataResponse.status != 200) return null
        const movies = moviesDataResponse.response



        return rules.map(r=>{
            return {
                confidence:r.confidence,
                support:r.support,
                movie: movies.find(m=>m.id==r.target)!,
            }
        })

    }catch (e) {
        return null
    }
}

export default function AssociationRulesTable({movieID}:{movieID:string}) {
    const [data,setData] = useState<TableAssociationRuleT[] | null>()
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
            r.confidence,r.support,
        ].join(" ")}))

    return (
        // <div className="container mx-auto py-10">
        <BaseTable header={"Ассоциативные правила"} filterPlaceholder={"Фильм, сходство, тип..."} columns={columns} data={dataWithFilterField} />
        // </div>
    )
}