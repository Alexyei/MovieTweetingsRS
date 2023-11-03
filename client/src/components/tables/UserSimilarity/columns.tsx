"use client"
import { ColumnDef } from "@tanstack/react-table"
import {MovieFullDataT} from "@/types/movie.types";

import * as React from "react";
import {
    baseHeader,

    movieCell,
    movieHeader, similarityCell, typeSimilarityCell, userCell, userHeader,

} from "@/components/tables/BaseTable/base-columns";
import {UserT} from "@/types/user.types";


export type UserSimilarityT = { similarity:number,type:string,user: UserT, }



export const columns: ColumnDef<UserSimilarityT & {filterField:string}>[] = [

    {
        accessorKey: "user.login",
        header: userHeader,
        cell: ({row}: any) => {
            const data = row.original
            const user = data.user as UserT
            return userCell(user)
        }
    },
    {
        accessorKey: "similarity",
        header: baseHeader("Сходство"),
        cell: similarityCell
    },
    {
        accessorKey: "type",
        header: baseHeader("Тип"),
        cell: typeSimilarityCell
    },
    {
        accessorKey: "filterField",
        header: ()=>null,
        cell: ()=>null,
    },
]