export type MovieIdT = {id:string}
export type MovieIdWithRatingT = MovieIdT & {rating:number}
export type MovieFullDataT = {
    id: string,
    title:string,
    year:number
    description: string | null
    poster_path: string | null,
    mean_rating: number,
    genres: {name:string, id:number}[]
}

export type MovieOrderingT =  "year asc" | "year desc" | "title asc" | "title desc"

