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
    movieHeader, roleCell,
    userCell,
    userHeader
} from "@/components/tables/BaseTable/base-columns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.




export const columns: ColumnDef<UserT & {filterField:string}>[] = [
    {
        accessorKey: "login",
        header: userHeader,
        cell: ({row}: any) => {
            const data = row.original
            const user = data as UserT
            return userCell(user,false)
        }
    },
    {
        accessorKey: "role",
        header: baseHeader("Полномочия"),
        cell: roleCell
    },
    {
        accessorKey: "filterField",
        header: ()=>null,
        cell: ()=>null,
    },
]