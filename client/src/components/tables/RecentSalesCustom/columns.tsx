"use client"

import { ColumnDef } from "@tanstack/react-table"
import {Button} from "@/components/ui/button";
import {ArrowUpDown, MoreHorizontal, Star} from "lucide-react";
import {UserT} from "@/types/user.types";
import {MovieFullDataT} from "@/types/movie.types";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";
import MovieCard from "@/components/MovieCard/MovieCard";
import * as React from "react";
import {Badge} from "@/components/ui/badge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SalesT = { user: UserT, movie: MovieFullDataT,date:string }

export const columns: ColumnDef<SalesT & {filterField:string}>[] = [
    {
        accessorKey: "user.login",
        header: ({ column }) => {

            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Пользователь
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({row})=>{
            const data = row.original
            const user = data.user
            return (
                <Link href={`/analytics/user/${user.id}`} className="flex items-center hover:bg-secondary p-2 rounded-md h-[128px]">
                    <Avatar className="h-9 w-9">
                        <AvatarImage
                            src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.login || user.id}`}
                            alt="@avatar"/>
                        <AvatarFallback>AV</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1 w-[100px]">
                        <p className="text-sm font-medium leading-none">{user.login}</p>
                        <p className="text-sm text-muted-foreground break-words line-clamp-3">
                            {user.email}
                        </p>
                    </div>
                </Link>
            )
        }
    },
    {
        accessorKey: "movie.title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Фильм
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({row})=>{
            const data = row.original
            const movie = data.movie
            return (
                <Link href={`/analytics/movie/${movie.id}`} className={"grid grid-cols-[auto_1fr] gap-3 items-center hover:bg-secondary p-2 rounded-md"}>
                    <MovieCard link={false} movie={movie} hover={false} className={`w-20`}></MovieCard>
                    <div className={"w-[150px] "}>
                        <h4 className={"text-primary scroll-m-20 text-sm font-semibold tracking-tight line-clamp-3 leading-none mb-2"}>{movie.title}</h4>
                        <div className={"flex items-center mb-1 text-foreground"}>
                            <Star className={"h-3 w-3 fill-foreground  mr-1"}/>
                            <p className={"text-xs  leading-none line-clamp-5 mr-1"}>{movie.mean_rating.toFixed(1)} / 10.0</p>
                            <p className={"text-xs  leading-none line-clamp-5"}>| {movie.year}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {movie.genres.map((genre, i) => {
                                return <Badge className={"text-xs"}>{genre.name}</Badge>
                            })}
                        </div>
                    </div>
                </Link>
            )
        }
    },
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Дата
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("date"));
            return <div className="text-md font-bold text-center">{date.toLocaleDateString()}</div>
        },
    },
    {
        accessorKey: "filterField",
        header: ()=>null,
        cell: ()=>null,
    },
]