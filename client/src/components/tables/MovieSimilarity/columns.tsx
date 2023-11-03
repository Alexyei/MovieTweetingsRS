"use client"
import { ColumnDef } from "@tanstack/react-table"
import {MovieFullDataT} from "@/types/movie.types";

import * as React from "react";
import {
    baseHeader,

    movieCell,
    movieHeader, similarityCell, typeSimilarityCell,

} from "@/components/tables/BaseTable/base-columns";


export type MovieSimilarityT = { similarity:number,type:string,movie: MovieFullDataT, }



export const columns: ColumnDef<MovieSimilarityT & {filterField:string}>[] = [

    {
        accessorKey: "movie.title",
        header: movieHeader,
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