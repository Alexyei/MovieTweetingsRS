export type EventTypeT = "DETAILS" | "MORE_DETAILS" | "ADD_TO_FAVORITES_LIST" | "BUY" | "REMOVE_FROM_FAVORITES_LIST"|"GENRE_VIEW"

export type EventsCountT = {event: string, buy: number, no_buy: number}[]

export type PurchasesInfoT = {purchases: {value: number, diff: number}, visitors: {value: number, diff: number},sessions: {value: number, diff: number}, conversion: {value: number, diff: number}}

export type BestSellerT = {movieId:string,count:number}
export type RecentPurchasesT = {userId:number,movieId:string,createdAt: string}
export type MoviePurchasesT = {userId:number,createdAt: string}

export type UserEventT = {userId: number, movieId: string | null, genreId: number | null, event: EventTypeT, createdAt: string}