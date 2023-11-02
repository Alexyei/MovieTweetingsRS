"use client"
import { ColumnDef } from "@tanstack/react-table"
import {UserT} from "@/types/user.types";
import {MovieFullDataT} from "@/types/movie.types";

import * as React from "react";
import {
    dateCell,
    dateHeader,
    movieCell,
    movieHeader,
    userCell,
    userHeader
} from "@/components/tables/BaseTable/base-columns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SalesT = { user: UserT, movie: MovieFullDataT,date:string }



export const columns: ColumnDef<SalesT & {filterField:string}>[] = [
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