import {MovieIdT, MovieIdWithRatingT} from "@/types/movie.types";

export type UserT = { login: string | null, id: number, email: string | null, role: "ADMIN" | "USER" }

export type UserMoviesT = {
    purchased: MovieIdT[],
    liked: MovieIdT[],
    rated: MovieIdWithRatingT[]
}