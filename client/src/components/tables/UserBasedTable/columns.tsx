"use client"
import { ColumnDef } from "@tanstack/react-table"
import {MovieFullDataT} from "@/types/movie.types";

import * as React from "react";
import {
    baseHeader,

    movieCell,
    movieHeader, ratingCell, similarityCell, typeSimilarityCell, userCell, userHeader,

} from "@/components/tables/BaseTable/base-columns";
import {UserT} from "@/types/user.types";


export type UserBasedTableT = { similarity:number,rating:number,user: UserT, }



export const columns: ColumnDef<UserBasedTableT & {filterField:string}>[] = [

    {
        accessorKey: "user.login",
        header: baseHeader("Схожий пользователь"),
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
        accessorKey: "rating",
        header: baseHeader("Оценка схожего пользователя"),
        cell: ratingCell
    },
    {
        accessorKey: "filterField",
        header: ()=>null,
        cell: ()=>null,
    },
]