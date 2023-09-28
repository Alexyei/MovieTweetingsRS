import {toOnesM, zerosM} from "../utils/math";
import {otiaiSimsForMovies} from "../similarity/otiai_similarity";
// import {map, matrix, multiply, transpose} from "mathjs";
import {Rating, SimilarityType} from "@prisma/client";
import {Tensor2D} from "@tensorflow/tfjs";
const tf = require('@tensorflow/tfjs');
async function flushDB(){
    console.log(1)
}

export async function loadRatings():Promise<{movieId: string, authorId: number, rating: number}[]>{
    return []
}

// количество пользователей оценивших ОБА фильма
export function calculateOverlapUsersM(ratings:Tensor2D) {
    const onesM = ratings.greater(0).toInt();
    return tf.matMul(tf.transpose(onesM), onesM).arraySync() as number[][]
    // const onesM = toOnesM(ratings)
    //
    // return multiply(transpose(matrix(onesM)), matrix(onesM)).toArray() as number[][]
}

function filterMoviesSimilarity(moviesSims:number[][], overlapUsers:number[][],uniqueMovieIds:string[], minSims:number,minOverlap:number){
    const simsData = []
    for (let i = 0; i < moviesSims.length - 1; ++i) {
        for (let j = i + 1; j < moviesSims.length; ++j) {
            if (moviesSims[i][j] > minSims && overlapUsers[i][j] > minOverlap) {
                simsData.push({
                    "source": uniqueMovieIds[i],
                    "target": uniqueMovieIds[j],
                    "similarity": moviesSims[i][j],
                    "type": SimilarityType.OTIAI
                })
                simsData.push({
                    "source": uniqueMovieIds[j],
                    "target": uniqueMovieIds[i],
                    "similarity": moviesSims[i][j],
                    "type": SimilarityType.OTIAI
                })
            }
        }
    }
    return simsData
}

export function preprocessData(data: { movieId: string, authorId: number, rating: number }[]) {
    const uniqueUserIds = Array.from(new Set(data.map(item => item.authorId)));
    const uniqueMovieIds = Array.from(new Set(data.map(item => item.movieId)));

    const ratings = zerosM(uniqueUserIds.length,uniqueMovieIds.length,);
    for (const row of data) {
        // if (row.authorId == 15)
        //     console.log()
        const movieIndex = uniqueMovieIds.findIndex(el => el == row.movieId);
        const userIndex = uniqueUserIds.findIndex(el => el == row.authorId);
        ratings[userIndex][movieIndex] = row.rating;
    }

    return { uniqueUserIds, uniqueMovieIds, ratings };
}

export function calculateMoviesOtiaiSimilarity(data:{movieId: string, authorId: number, rating: number}[],minSims=0.5,minOverlap=1){
    if (data.length  == 0) return []
    const { uniqueUserIds, uniqueMovieIds, ratings } = preprocessData(data);

    // const filteredElement = ratings[14].filter(el => el > 0)

    const ratingsTensor = tf.tensor2d(ratings)
    const moviesSims = otiaiSimsForMovies(ratingsTensor)
    const overlap = calculateOverlapUsersM(ratingsTensor)
    return filterMoviesSimilarity(moviesSims, overlap,uniqueMovieIds,minSims,minOverlap)
}

async function saveMoviesSimilarity(data: {source: string, target: string, similarity: number}[]){

}

export async function createMoviesOtiaiSimilarity(ratings:{movieId: string, authorId: number, rating: number}[]|Rating[]){
    await flushDB()
    const similarities = calculateMoviesOtiaiSimilarity(ratings)
    await saveMoviesSimilarity(similarities)
}

// flushDB().then(loadRatings).then(data=>calculateMoviesSimilarity(data)).then(saveMoviesSimilarity)