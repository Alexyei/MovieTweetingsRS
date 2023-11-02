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


export type TopSalesT = { user: UserT, movie: MovieFullDataT,count:number }



export const columns: ColumnDef<TopSalesT & {filterField:string}>[] = [
    {
        accessorKey: "user.login",
        header: userHeader,
        cell: userCell
    },
    {
        accessorKey: "movie.title",
        header: movieHeader,
        cell: movieCell
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