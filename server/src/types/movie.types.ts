import {Movie, TestMovie} from "@prisma/client";
import {createMovieGetDAOMixin} from "../DAO/tables/movie/mixins/movie_get_mixin";

export type MovieT = Omit<Movie| TestMovie, "createdAt" | "description" | "poster_path">
export type MovieDataT = {poster_path: string | null, id: string, title: string}