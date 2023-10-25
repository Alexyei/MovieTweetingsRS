export type MovieIdT = {id:string}

export type MovieT = {
    id: string,
    title:string,
    year:number
    description: string | null
    poster_path: string | null,
    mean_rating: number
}

export type MovieIdWithRatingT = MovieIdT & {rating:number}