"use client"
import { ColumnDef } from "@tanstack/react-table"
import {MovieFullDataT} from "@/types/movie.types";

import * as React from "react";
import {
    baseHeader,

    movieCell,
    movieHeader, similarityCell, typeSimilarityCell, userCollectionTypeCell,

} from "@/components/tables/BaseTable/base-columns";


export type UserCollectionT = { type:"BUY"|"IN LIST",movie: MovieFullDataT, }



export const columns: ColumnDef<UserCollectionT & {filterField:string}>[] = [

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
        accessorKey: "type",
        header: baseHeader("Тип"),
        cell: userCollectionTypeCell
    },
    {
        accessorKey: "filterField",
        header: ()=>null,
        cell: ()=>null,
    },
]