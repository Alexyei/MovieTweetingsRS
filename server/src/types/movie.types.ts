import {Movie, TestMovie} from "@prisma/client";

export type MovieT = Omit<Movie| TestMovie, "createdAt" | "description" | "poster_path">