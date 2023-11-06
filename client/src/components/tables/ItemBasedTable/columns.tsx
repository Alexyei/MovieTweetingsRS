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


export type ItemBasedTableT = { similarity:number,rating:number,movie: MovieFullDataT, }



export const columns: ColumnDef<ItemBasedTableT & {filterField:string}>[] = [

    {
        accessorKey: "movie.title",
        header: baseHeader("Оценка пользователя"),
        cell: ({row}: any) => {
            const data = row.original
            const movie = data.movie as MovieFullDataT
            return movieCell(movie)
        }
    },
    {
        accessorKey: "similarity",
        header: baseHeader("Сходство"),
        cell: similarityCell
    },
    {
        accessorKey: "rating",
        header: baseHeader("Оценка"),
        cell: ratingCell
    },
    {
        accessorKey: "filterField",
        header: ()=>null,
        cell: ()=>null,
    },
]