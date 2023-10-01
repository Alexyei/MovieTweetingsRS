import {normalizeRatings, otiaiSimsForUsers} from "../similarity/otiai_similarity";
import {map, matrix, multiply, transpose} from "mathjs";
import {preprocessData} from "./calculate_movies_otiai_similarity";
import {Tensor2D} from "@tensorflow/tfjs";
import {RatingType, SimilarityType} from "@prisma/client";
const tf = require('@tensorflow/tfjs');

async function flushDB(){

}

async function loadRatings():Promise<{movieId: string, authorId: number, rating: number}[]>{
    return []
}
// количество ОБЩИХ фильмов между пользователями
// export function calculateOverlapMoviesM(ratings:number[][]) {
//     const onesM = map(matrix(ratings),el => el > 0 ? 1 : 0)
//     return multiply(onesM, transpose(onesM)).toArray() as number[][]
//     // const onesM = toOnesM(ratings)
//
//     // return multiply(matrix(onesM), transpose(matrix(onesM))).toArray() as number[][]
// }

export function calculateOverlapMoviesM(ratings:Tensor2D) {
    // const onesM = map(matrix(ratings),el => el > 0 ? 1 : 0)
    // return multiply(onesM, transpose(onesM)).toArray() as number[][]
    const onesM = ratings.greater(0).toInt();
    return tf.matMul(onesM, tf.transpose(onesM)).arraySync() as number[][]
    // const onesM = toOnesM(ratings)

    // return multiply(matrix(onesM), transpose(matrix(onesM))).toArray() as number[][]
}

function filterUsersSimilarity(usersSims:number[][], overlapMovies:number[][],uniqueUserIds:number[], minSims:number,minOverlap:number){
    const simsData = []

    for (let i = 0; i < usersSims.length - 1; ++i) {
        for (let j = i + 1; j < usersSims.length; ++j) {
            if (usersSims[i][j] > minSims && overlapMovies[i][j] > minOverlap) {
                simsData.push({
                    "source": uniqueUserIds[i],
                    "target": uniqueUserIds[j],
                    "similarity": usersSims[i][j],
                    "type":SimilarityType.OTIAI
                })
                simsData.push({
                    "source": uniqueUserIds[j],
                    "target": uniqueUserIds[i],
                    "similarity": usersSims[i][j],
                    "type":SimilarityType.OTIAI
                })
            }
        }
    }

    return simsData
}



export function calculateUsersOtiaiSimilarity(data:{movieId: string, authorId: number, rating: number}[],minSims=0.5,minOverlap=1){
    if (data.length  == 0) return []
    const { uniqueUserIds, uniqueMovieIds, ratings } = preprocessData(data);
    const ratingsTensor = tf.tensor2d(ratings)
    const usersSims = otiaiSimsForUsers(ratingsTensor)
    const overlap = calculateOverlapMoviesM(ratingsTensor)

    return filterUsersSimilarity(usersSims, overlap,uniqueUserIds,minSims,minOverlap)
}

async function saveUsersSimilarity(data: {source: number, target: number, similarity: number}[]){

}

export async function buildUsersOtiaiSimilarity(){
    await flushDB()
    const ratings = await loadRatings()
    const similarities = calculateUsersOtiaiSimilarity(ratings)
    await saveUsersSimilarity(similarities)
}

// flushDB().then(loadRatings).then(data=>calculateUsersSimilarity(data)).then(saveUsersSimilarity)