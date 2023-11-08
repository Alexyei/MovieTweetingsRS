export type RatingDistributionT = {
    explicit: { rating: number, count: number }[], implicit: { rating: number, count: number }[]
}

export type RatingT = {movieId: string, rating: number, date: string}

export type UserRatingsT = {explicit: RatingT[],implicit: RatingT[],priority:RatingT[]}