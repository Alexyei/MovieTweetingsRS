import {toOnesM, zerosM} from "../utils/math";
import {otiaiSimsForUsers} from "../similarity/otiai_similarity";
import {matrix, multiply, transpose} from "mathjs";

async function flushDB(){

}

async function loadRatings():Promise<{movieId: string, userId: number, rating: number}[]>{
    return []
}

function calculateOverlapMoviesM(ratings:number[][]) {
    const onesM = toOnesM(ratings)

    return multiply(matrix(onesM), transpose(matrix(onesM))).toArray() as number[][]
}

function filterMoviesSimilarity(usersSims:number[][], overlapMovies:number[][],uniqueUserIds:number[], minSims:number,minOverlap:number){
    const simsData = []

    for (let i = 0; i < usersSims.length - 1; ++i) {
        for (let j = i + 1; j < usersSims.length; ++j) {
            if (usersSims[i][j] > minSims && overlapMovies[i][j] > minOverlap) {
                simsData.push({
                    "userId1": uniqueUserIds[i],
                    "userId2": uniqueUserIds[j],
                    "similarity": usersSims[i][j]
                })
            }
        }
    }

    return simsData
}
export function calculateUsersSimilarity(data:{movieId: string, userId: number, rating: number}[],minSims=0.5,minOverlap=1){
    const uniqueUserIds = Array.from(new Set(data.map(item => item.userId)));
    const uniqueMovieIds = Array.from(new Set(data.map(item => item.movieId)));

    const ratings = zerosM(uniqueMovieIds.length, uniqueUserIds.length)
    for (const row of data) {
        const movieIndex = uniqueMovieIds.findIndex(el => el == row.movieId)
        const userIndex = uniqueUserIds.findIndex(el => el == row.userId)
        ratings[userIndex][movieIndex] = row.rating
    }

    const moviesSims = otiaiSimsForUsers(ratings)
    const overlap = calculateOverlapMoviesM(ratings)

    return filterMoviesSimilarity(moviesSims, overlap,uniqueUserIds,minSims,minOverlap)
}

async function saveUsersSimilarity(data: {movieId1: string, movieId2: string, similarity: number}[]){

}

// flushDB().then(loadRatings).then(data=>calculateUsersSimilarity(data)).then(saveUsersSimilarity)