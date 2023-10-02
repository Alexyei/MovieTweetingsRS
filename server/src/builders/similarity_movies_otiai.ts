import {
    calculateSimilarityForMoviesOtiai,
    calculateSimilarityForMoviesOtiaiByChunks,
    calculateSimilarityForMoviesOtiaiByChunksWithWorkers,
    calculateSimilarityForMoviesOtiaiByChunksWithWorkersAsyncConveyor,
} from "../similarity/otiai/calculations_movies";
import {PrismaClient, SimilarityType} from "@prisma/client";
import {MovieSimilarityType} from "../types/similarity.types";
const prisma = new PrismaClient();
async function flushDB(){
    prisma.moviesSimilarity.deleteMany({where:{type:SimilarityType.OTIAI}})
}

async function getRatings(){
    return prisma.rating.findMany()
}

export async function getRatingsForChunk(movieIds: string[]) {
    return prisma.rating.findMany({where: {movieId: {in: movieIds}}})
}

async function getUsersAvg(){
    return prisma.rating.groupBy({by: 'authorId', _avg: {rating: true}, orderBy: {authorId: 'asc'}})
}

async function getMoviesUniqueIds(){
    return prisma.rating.findMany({
        distinct: ['movieId'],
        orderBy: {movieId: 'asc',},
        select: {movieId: true},
    })
}

async function saveSimilarityForMovies(movieSims: MovieSimilarityType[]){
    await prisma.moviesSimilarity.createMany({
        data: movieSims
    })
}

async function saveSimilarityForMoviesFromChunk(chunkMovieSims: MovieSimilarityType[]) {
    await prisma.moviesSimilarity.createMany({
        data: chunkMovieSims,
        skipDuplicates: true
    })
}

export async function buildSimilarityForMoviesOtiai(minSims = 0.2, minOverlap = 4){
    await flushDB()
    const ratings = await getRatings()
    const similarities = calculateSimilarityForMoviesOtiai(ratings,minSims,minOverlap)
    await saveSimilarityForMovies(similarities)
}

export async function buildSimilarityForMoviesOtiaiByChunks(chunkSize = 100, minSims = 0.2, minOverlap = 4) {
    await flushDB()
    const usersData = await getUsersAvg()
    const uniqueMovieIds = (await getMoviesUniqueIds()).map(mid => mid.movieId);
    await calculateSimilarityForMoviesOtiaiByChunks(usersData, uniqueMovieIds, getRatingsForChunk, saveSimilarityForMoviesFromChunk, chunkSize, minSims, minOverlap)
}

export async function buildSimilarityForMoviesOtiaiByChunksWithWorkers(chunkSize = 100, maxThreads = 11, minSims = 0.2, minOverlap = 4) {
    try {
    await flushDB()
    const usersData = await getUsersAvg()
    const uniqueMovieIds = (await getMoviesUniqueIds()).map(mid => mid.movieId);
    await calculateSimilarityForMoviesOtiaiByChunksWithWorkers(usersData, uniqueMovieIds, getRatingsForChunk, saveSimilarityForMoviesFromChunk, chunkSize, maxThreads, minSims, minOverlap)
    } catch (err) {
        console.log(err)
    }
}

export async function buildSimilarityFprMoviesOtiaiByChunksWithWorkersAsyncConveyor(chunkSize = 100, maxThreads = 11, minSims = 0.2, minOverlap = 4) {
    try {
        await flushDB()
        const usersData = await getUsersAvg()
        const uniqueMovieIds = (await getMoviesUniqueIds()).map(mid => mid.movieId);
        await calculateSimilarityForMoviesOtiaiByChunksWithWorkersAsyncConveyor(usersData, uniqueMovieIds, getRatingsForChunk, saveSimilarityForMoviesFromChunk, chunkSize, maxThreads, minSims, minOverlap)
    } catch (err) {
        console.log(err)
    }
}