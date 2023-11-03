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
    movieHeader,
    userCell, userEventCell,
    userHeader
} from "@/components/tables/BaseTable/base-columns";
import {EventTypeT} from "@/types/user_event.types";
import {GenreT} from "@/types/genre.types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type UserLogsT = {  movie: MovieFullDataT | null,genre:Omit<GenreT,"moviesCount"> | null,date:string,event:EventTypeT }



export const columns: ColumnDef<UserLogsT & {filterField:string}>[] = [
    {
        accessorKey: "genre.name",
        header: baseHeader("Жанр"),
        cell: ({row}: any) => {
            const data = row.original
            const genre = data.genre as GenreT | null

            return genre ? <div className="text-md font-bold text-center ">{genre.name}</div> : null
        }
    },
    {
        accessorKey: "movie.title",
        header: movieHeader,
        cell: ({row}: any) => {
            const data = row.original
            const movie = data.movie as MovieFullDataT | null

            return movie ? movieCell(movie) : null
        }
    },
    {
        accessorKey: "date",
        header: dateHeader,
        cell: dateCell
    },
    {
        accessorKey: "event",
        header: baseHeader("Событие"),
        cell: userEventCell
    },
    {
        accessorKey: "filterField",
        header: ()=>null,
        cell: ()=>null,
    },
]