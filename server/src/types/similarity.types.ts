import {SimilarityType} from "@prisma/client";

export type MovieSimilarityType = {
    source: string, target: string, similarity: number, type:SimilarityType
}

export type UserSimilarityType = {
    source: number, target: number, similarity: number, type:SimilarityType
}