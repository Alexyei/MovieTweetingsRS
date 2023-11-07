export type EventTypeT = "DETAILS" | "MORE_DETAILS" | "ADD_TO_FAVORITES_LIST" | "BUY" | "REMOVE_FROM_FAVORITES_LIST"|"GENRE_VIEW"

export type EventsCountT = {event: string, buy: number, no_buy: number}[]