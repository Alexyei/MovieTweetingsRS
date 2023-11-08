"use client"
import { ColumnDef } from "@tanstack/react-table"
import {MovieFullDataT} from "@/types/movie.types";

import * as React from "react";
import {
    baseHeader, dateCell, dateHeader,

    movieCell,
    movieHeader, ratingCell, similarityCell, typeSimilarityCell, userCollectionTypeCell, userRatingTypeCell,

} from "@/components/tables/BaseTable/base-columns";


export type UserRatingT = { type:"EXPLICIT"|"IMPLICIT"|"PRIORITY",rating:number,movie: MovieFullDataT,date:string }



export const columns: ColumnDef<UserRatingT & {filterField:string}>[] = [

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
        cell: userRatingTypeCell
    },
    {
        accessorKey: "rating",
        header: baseHeader("Оценка"),
        cell: ratingCell
    },
    {
        accessorKey: "date",
        header: dateHeader,
        cell: dateCell
    },
    {
        accessorKey: "filterField",
        header: ()=>null,
        cell: ()=>null,
    },
]