import {
    MoviesSimilarity,
    TestMoviesSimilarity,
    TestUsersSimilarity,
    UsersSimilarity
} from "@prisma/client";

export type MovieSimilarityT = Omit<MoviesSimilarity | TestMoviesSimilarity, "createdAt" | "id">

export type UserSimilarityT = Omit<UsersSimilarity | TestUsersSimilarity, "createdAt" | "id">