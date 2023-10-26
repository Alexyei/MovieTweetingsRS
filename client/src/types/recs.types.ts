export type PopularityRecsPopsT =
    {
        predictedRating: number,
        usersCount: number,
        movieId: string,
        purchasesCount: number
    }

export type PopularityRecsBestsellersT = PopularityRecsPopsT & {purchasesCount: number}


export type CFNBRecsItemItemT =
    {movieId: string,
        predictedRating: number,
        recommendedByMovies: {movieId: string, rating: number}[]
    }

export type CFNBRecsUserUserT =
    {
        movieId: string,
        predictedRating: number,
        recommendedByUsers: {userId: number, login: string | null, similarity: number, rating: number}[]}