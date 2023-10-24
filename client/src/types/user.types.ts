import {MovieT} from "@/types/movie.types";

export type UserT = { login: string | null, id: number, email: string | null, role: "ADMIN" | "USER" }

export type UserMoviesT = {
    purchased: MovieT[],
    liked: MovieT[],
}