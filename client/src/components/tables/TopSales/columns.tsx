"use client"
import { ColumnDef } from "@tanstack/react-table"
import {UserT} from "@/types/user.types";
import {MovieFullDataT} from "@/types/movie.types";

import * as React from "react";
import {
    baseHeader, countCell,
    dateCell,
    dateHeader,
    movieCell,
    movieHeader,
    userCell,
    userHeader
} from "@/components/tables/BaseTable/base-columns";


export type TopSalesT = { movie: MovieFullDataT,count:number }



export const columns: ColumnDef<TopSalesT & {filterField:string}>[] = [
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
        accessorKey: "count",
        header: baseHeader("Продано"),
        cell: countCell
    },
    {
        accessorKey: "filterField",
        header: ()=>null,
        cell: ()=>null,
    },
]