import {Movie, TestMovie} from "@prisma/client";

export type MovieT = Omit<Movie| TestMovie, "createdAt" | "description" | "poster_path">
export type MovieDataT = {poster_path: string | null, id: string, title: string}

export type MovieOrderingT =  "year asc" | "year desc" | "title asc" | "title desc"