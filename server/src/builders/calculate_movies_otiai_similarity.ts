import {toOnesM, zerosM} from "../utils/math";
import {otiaiSimsForMovies} from "../similarity/otiai_similarity";
import {map, matrix, multiply, transpose} from "mathjs";

async function flushDB(){
    console.log(1)
}

async function loadRatings():Promise<{movieId: string, userId: number, rating: number}[]>{
    return []
}

// количество пользователей оценивших ОБА фильма
export function calculateOverlapUsersM(ratings:number[][]) {
    const onesM = map(matrix(ratings),el => el > 0 ? 1 : 0)
    return multiply(transpose(onesM), onesM).toArray() as number[][]
    // const onesM = toOnesM(ratings)
    //
    // return multiply(transpose(matrix(onesM)), matrix(onesM)).toArray() as number[][]
}

function filterMoviesSimilarity(moviesSims:number[][], overlapUsers:number[][],uniqueMovieIds:string[], minSims:number,minOverlap:number){
    const simsData = []

    for (let i = 0; i < moviesSims.length - 1; ++i) {
        for (let j = i + 1; j < moviesSims.length; ++j) {
            if (moviesSims[i][j] >= minSims && overlapUsers[i][j] >= minOverlap) {
                simsData.push({
                    "source": uniqueMovieIds[i],
                    "target": uniqueMovieIds[j],
                    "similarity": moviesSims[i][j]
                })
                simsData.push({
                    "source": uniqueMovieIds[j],
                    "target": uniqueMovieIds[i],
                    "similarity": moviesSims[i][j]
                })
            }
        }
    }

    return simsData
}

export function preprocessData(data: { movieId: string, userId: number, rating: number }[]) {
    const uniqueUserIds = Array.from(new Set(data.map(item => item.userId)));
    const uniqueMovieIds = Array.from(new Set(data.map(item => item.movieId)));

    const ratings = zerosM(uniqueMovieIds.length, uniqueUserIds.length);
    for (const row of data) {
        const movieIndex = uniqueMovieIds.findIndex(el => el == row.movieId);
        const userIndex = uniqueUserIds.findIndex(el => el == row.userId);
        ratings[userIndex][movieIndex] = row.rating;
    }

    return { uniqueUserIds, uniqueMovieIds, ratings };
}

export function calculateMoviesOtiaiSimilarity(data:{movieId: string, userId: number, rating: number}[],minSims=0.5,minOverlap=1){
    if (data.length  == 0) return []
    const { uniqueUserIds, uniqueMovieIds, ratings } = preprocessData(data);

    const moviesSims = otiaiSimsForMovies(ratings)
    const overlap = calculateOverlapUsersM(ratings)

    return filterMoviesSimilarity(moviesSims, overlap,uniqueMovieIds,minSims,minOverlap)
}

async function saveMoviesSimilarity(data: {source: string, target: string, similarity: number}[]){

}

export async function createMoviesOtiaiSimilarity(){
    await flushDB()
    const ratings = await loadRatings()
    const similarities = calculateMoviesOtiaiSimilarity(ratings)
    await saveMoviesSimilarity(similarities)
}

// flushDB().then(loadRatings).then(data=>calculateMoviesSimilarity(data)).then(saveMoviesSimilarity)