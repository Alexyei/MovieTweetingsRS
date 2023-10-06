import {
    calculateSimilarityForMoviesOtiai,
    calculateSimilarityForMoviesOtiaiByChunks,
    calculateSimilarityForMoviesOtiaiByChunksWithWorkers,
    calculateSimilarityForMoviesOtiaiByChunksWithWorkersAsyncConveyor,
} from "../similarity/otiai/calculations_movies";
import {SimilarityType} from "@prisma/client";
import {MovieSimilarityT} from "../types/similarity.types";
import {
    getRatingsWithPriority,
    getRatingsWithPriorityByMovieIds,
    getUsersAvgRatingsWithPriority
} from "../DAO/priopity_ratings";
import {getUniqueMovieIdsFromRatings, getUsersAvgRatings} from "../DAO/ratings";
import {deleteMoviesSimilarityByType, saveMoviesSimilarity} from "../DAO/movie_similarity";
async function flushDB(){
    // prisma.moviesSimilarity.deleteMany({where:{type:SimilarityType.OTIAI}})
    await deleteMoviesSimilarityByType(SimilarityType.OTIAI,false)
}

async function getRatings(){
    return getRatingsWithPriority(false)
    // return prisma.rating.findMany()
}

export async function getRatingsForChunk(movieIds: string[]) {
    return getRatingsWithPriorityByMovieIds(movieIds,false)
    // return prisma.rating.findMany({where: {movieId: {in: movieIds}}})
}

async function getUsersAvg(){
    // return prisma.rating.groupBy({by: 'authorId', _avg: {rating: true}, orderBy: {authorId: 'asc'}})
    // return  getUsersAvgRatings()
    return getUsersAvgRatingsWithPriority(false)
}

async function getMoviesUniqueIds(){
    return getUniqueMovieIdsFromRatings(false)
}


async function saveSimilarityForMoviesFromChunk(chunkMovieSims: MovieSimilarityT[]) {
    await saveMoviesSimilarity(chunkMovieSims, true,false)
}

export async function buildSimilarityForMoviesOtiai(minSims = 0.2, minOverlap = 4){
    await flushDB()
    const ratings = await getRatings()
    const similarities = calculateSimilarityForMoviesOtiai(ratings,minSims,minOverlap)
    await saveMoviesSimilarity(similarities,false,false)
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