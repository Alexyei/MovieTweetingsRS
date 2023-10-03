import {zerosM} from "../utils/math";
import {RatingT, UserAvgRatingT} from "../types/rating.types";


export function createRatingsTable(data: RatingT[], uniqueUserIds: number[], uniqueMovieIds: string[]) {
    const ratings = zerosM(uniqueUserIds.length, uniqueMovieIds.length,);
    for (const row of data) {
        const movieIndex = uniqueMovieIds.findIndex(el => el == row.movieId);
        const userIndex = uniqueUserIds.findIndex(el => el == row.authorId);
        ratings[userIndex][movieIndex] = row.rating;
    }

    return ratings
}
export function preprocessData(data: RatingT[]) {
    const uniqueUserIds = Array.from(new Set(data.map(item => item.authorId)));
    const uniqueMovieIds = Array.from(new Set(data.map(item => item.movieId)));

    const ratings = createRatingsTable(data, uniqueUserIds, uniqueMovieIds)
    return { uniqueUserIds, uniqueMovieIds, ratings };
}



export function preprocessDataForChunk(usersData: UserAvgRatingT[], chunkUniqueMovieIds: string[], ratings: RatingT[]) {
    const uniqueUserIds = Array.from(new Set(ratings.map(r => r.authorId))).sort((a, b) => a - b)

    const ratingsTable = createRatingsTable(ratings, uniqueUserIds, chunkUniqueMovieIds)

    const usersMean = usersData.filter(ud => uniqueUserIds.includes(ud.authorId)).sort((a, b) => a.authorId - b.authorId).map(ud => ud._avg)

    return {ratingsTable, usersMean}
}