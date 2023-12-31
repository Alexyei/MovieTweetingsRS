import {Rating, TestRating} from "@prisma/client";

export type NormalizedRatingT = RatingWithTypeT & {normalizedRating: number}
export type RatingWithTypeT = Omit<Rating | TestRating,'createdAt' | 'id'>
export type RatingT = Omit<RatingWithTypeT, "type">

export type UserAvgRatingT = { authorId: number, _avg: number }