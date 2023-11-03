"use client"
import { ColumnDef } from "@tanstack/react-table"
import {UserT} from "@/types/user.types";
import {MovieFullDataT} from "@/types/movie.types";

import * as React from "react";
import {
    baseHeader,
    dateCell,
    dateHeader,
    movieCell,
    movieHeader, similarityCell, typeSimilarityCell,
    userCell,
    userHeader
} from "@/components/tables/BaseTable/base-columns";


export type MovieSalesT = { date:string,user: UserT, }



export const columns: ColumnDef<MovieSalesT & {filterField:string}>[] = [

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