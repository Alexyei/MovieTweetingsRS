import {
    calculateSimilarityForMoviesOtiai,
    calculateSimilarityForMoviesOtiaiByChunks,
    calculateSimilarityForMoviesOtiaiByChunksWithWorkers,
    calculateSimilarityForMoviesOtiaiByChunksWithWorkersAsyncConveyor,
} from "../similarity/otiai/calculations_movies";
import {SimilarityType} from "@prisma/client";
import {MovieSimilarityT} from "../types/similarity.types";
import {getDAO} from "../DAO/DAO";

const dao = getDAO(false)
async function flushDB(){
    await dao.movieSimilarity.deleteByType(SimilarityType.OTIAI)
}

async function getRatings(){
    return dao.priorityRating.all()
}

export async function getRatingsForChunk(movieIds: string[]) {
    return dao.priorityRating.getByMovieIds(movieIds)
}

async function getUsersAvg(){
    return dao.priorityRating.getAvgRatings()
}

async function getMoviesUniqueIds(){
    return dao.priorityRating.getUniqueMovieIds()
}


async function saveSimilarityForMoviesFromChunk(chunkMovieSims: MovieSimilarityT[]) {
    await dao.movieSimilarity.saveMany(chunkMovieSims,true)
}

export async function buildSimilarityForMoviesOtiai(minSims = 0.2, minOverlap = 4){
    await flushDB()
    const ratings = await getRatings()
    const similarities = calculateSimilarityForMoviesOtiai(ratings,minSims,minOverlap)
    await dao.movieSimilarity.saveMany(similarities,false)
    // await saveMoviesSimilarity(similarities,false,false)
}

export async function buildSimilarityForMoviesOtiaiByChunks(chunkSize = 100, minSims = 0.2, minOverlap = 4) {
    await flushDB()
    const usersData = await getUsersAvg()
    const uniqueMovieIds = await getMoviesUniqueIds()
    await calculateSimilarityForMoviesOtiaiByChunks(usersData, uniqueMovieIds, getRatingsForChunk, saveSimilarityForMoviesFromChunk, chunkSize, minSims, minOverlap)
}

export async function buildSimilarityForMoviesOtiaiByChunksWithWorkers(chunkSize = 100, maxThreads = 11, minSims = 0.2, minOverlap = 4) {
    try {
    await flushDB()
    const usersData = await getUsersAvg()
    const uniqueMovieIds = await getMoviesUniqueIds()
    await calculateSimilarityForMoviesOtiaiByChunksWithWorkers(usersData, uniqueMovieIds, getRatingsForChunk, saveSimilarityForMoviesFromChunk, chunkSize, maxThreads, minSims, minOverlap)
    } catch (err) {
        console.log(err)
    }
}

export async function buildSimilarityForMoviesOtiaiByChunksWithWorkersAsyncConveyor(chunkSize = 100, maxThreads = 11, minSims = 0.2, minOverlap = 4) {
    try {
        await flushDB()
        const usersData = await getUsersAvg()
        const uniqueMovieIds = await getMoviesUniqueIds()
        const start = Date.now()
        await calculateSimilarityForMoviesOtiaiByChunksWithWorkersAsyncConveyor(usersData, uniqueMovieIds, getRatingsForChunk, saveSimilarityForMoviesFromChunk, chunkSize, maxThreads, minSims, minOverlap)
        console.log(`Calculated for: ${(Date.now() - start) / 1000} seconds`);
    } catch (err) {
        console.log(err)
    }
}