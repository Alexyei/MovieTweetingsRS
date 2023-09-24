import {toOnesM, zerosM} from "../utils/math";
import {otiaiSimsForMovies} from "../similarity/otiai_similarity";
import {matrix, multiply, transpose} from "mathjs";

async function flushDB(){
    console.log(1)
}

async function loadRatings():Promise<{movieId: string, userId: number, rating: number}[]>{
    return []
}

function calculateOverlapUsersM(ratings:number[][]) {
    const onesM = toOnesM(ratings)

    return multiply(transpose(matrix(onesM)), matrix(onesM)).toArray() as number[][]
}

function filterMoviesSimilarity(moviesSims:number[][], overlapUsers:number[][],uniqueMovieIds:string[], minSims:number,minOverlap:number){
    const simsData = []

    for (let i = 0; i < moviesSims.length - 1; ++i) {
        for (let j = i + 1; j < moviesSims.length; ++j) {
            if (moviesSims[i][j] >= minSims && overlapUsers[i][j] >= minOverlap) {
                simsData.push({
                    "movieId1": uniqueMovieIds[i],
                    "movieId2": uniqueMovieIds[j],
                    "similarity": moviesSims[i][j]
                })
            }
        }
    }

    return simsData
}
export function calculateMoviesSimilarity(data:{movieId: string, userId: number, rating: number}[],minSims=0.5,minOverlap=1){
    const uniqueUserIds = Array.from(new Set(data.map(item => item.userId)));
    const uniqueMovieIds = Array.from(new Set(data.map(item => item.movieId)));

    const ratings = zerosM(uniqueMovieIds.length, uniqueUserIds.length)
    for (const row of data) {
        const movieIndex = uniqueMovieIds.findIndex(el => el == row.movieId)
        const userIndex = uniqueUserIds.findIndex(el => el == row.userId)
        ratings[userIndex][movieIndex] = row.rating
    }

    const moviesSims = otiaiSimsForMovies(ratings)
    const overlap = calculateOverlapUsersM(ratings)

    return filterMoviesSimilarity(moviesSims, overlap,uniqueMovieIds,minSims,minOverlap)
}

async function saveMoviesSimilarity(data: {movieId1: string, movieId2: string, similarity: number}[]){

}

// flushDB().then(loadRatings).then(data=>calculateMoviesSimilarity(data)).then(saveMoviesSimilarity)