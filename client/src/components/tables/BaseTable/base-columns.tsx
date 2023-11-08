import Link from "next/link";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import * as React from "react";
import {UserT} from "@/types/user.types";
import MovieCard from "@/components/MovieCard/MovieCard";
import {ArrowUpDown, Star} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {MovieFullDataT} from "@/types/movie.types";
import {Button} from "@/components/ui/button";

export function baseHeader(title:string){
    return ({column}: any) => {

    return (
        <Button
            className={"w-full"}
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {title}
            <ArrowUpDown className="ml-2 h-4 w-4"/>
        </Button>
    )
}}
export const userHeader = baseHeader("Пользователь")

export const movieHeader = baseHeader("Фильм")

export const dateHeader = baseHeader("Дата")

export const userCell = (user:UserT,fullHeight:boolean = true) => {
    return (
        <Link href={`/analytics/user/${user.id}` }
              className={`flex items-center hover:bg-secondary p-2 rounded-md pl-2 ${fullHeight ? "h-[120px]":""}`}>
            <Avatar className="h-9 w-9">
                <AvatarImage
                    src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.login || user.id}`}
                    alt="@avatar"/>
                <AvatarFallback>AV</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1 w-full max-w-[140px]">
                <p className="text-sm font-medium leading-none">{user.login}</p>
                <p className="text-sm font-medium leading-none">id: {user.id}</p>
                <p className="text-sm text-muted-foreground break-words line-clamp-3">
                    {user.email}
                </p>
            </div>
        </Link>
    )
}

export const movieCell = (movie: MovieFullDataT) => {

    return (
        <Link href={`/analytics/movie/${movie.id}`}
              className={"grid grid-cols-[auto_1fr] gap-3 items-center hover:bg-secondary p-2 rounded-md"}>
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
                        return <Badge key={genre.id} className={"text-xs"}>{genre.name}</Badge>
                    })}
                </div>
            </div>
        </Link>
    )
}

export const dateCell = ({ row }:any) => {
    const date = new Date(row.getValue("date"));
    // const date = row.getValue("date");
    return <div className="text-md font-bold text-center w-full">{date.toLocaleDateString()}</div>
}

export const similarityCell = ({ row }:any) => {
    const similarity = row.getValue("similarity");
    return <div className="text-md font-bold text-center  w-full">{similarity.toFixed(2)}</div>
}

export const userEventCell = ({ row }:any) => {
    const event = row.getValue("event")
    return <div className={`text-md font-bold text-center ${event == 'BUY' ? 'text-primary': ""} ${event.startsWith('REMOVE') ? 'text-destructive': ''}`}>{event.split("_")[0]}</div>
}
export const userCollectionTypeCell = ({ row }:any) => {
    const type = row.getValue("type")
    return <div className={`text-md font-bold text-center ${type == 'BUY' ? 'text-primary': ''}`}>{type}</div>
}

export const userRatingTypeCell = ({ row }:any) => {
    const type = row.getValue("type")
    return <div className={`text-md font-bold text-center ${type == 'PRIORITY' ? 'text-primary': ''}`}>{type}</div>
}
export const typeSimilarityCell = ({ row }:any) => {
    return <div className="text-md font-bold text-center ">{row.getValue("type")}</div>
}

export const countCell = ({ row }:any) => {
    return <div className="text-md font-bold text-center ">{row.getValue("count")}</div>
}

export const ratingCell = ({ row }:any) => {
    return <div className="text-md font-bold text-center ">{row.getValue("rating").toFixed(1)}</div>
}

export const roleCell = ({ row }:any) => {
    const role = row.getValue("role")
    return <div className={`text-md font-bold text-center ${role == "ADMIN" ? 'text-primary': ""}`}>{role.toLowerCase()}</div>
}