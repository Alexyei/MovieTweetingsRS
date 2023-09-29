import {toOnesM, zerosM} from "../utils/math";
import {otiaiSimsForMovies, otiaiSimsForMoviesChunked} from "../similarity/otiai_similarity";
// import {map, matrix, multiply, transpose} from "mathjs";
import {PrismaClient, Rating, SimilarityType} from "@prisma/client";
import {Tensor2D} from "@tensorflow/tfjs";
import ProgressBar from "progress";

const tf = require('@tensorflow/tfjs');
const prisma = new PrismaClient();

async function flushDB() {
    await prisma.moviesSimilarity.deleteMany({where: {type:'OTIAI'}})
}

export async function loadRatings(): Promise<{ movieId: string, authorId: number, rating: number }[]> {
    return []
}

// количество пользователей оценивших ОБА фильма
export function calculateOverlapUsersM(ratings: Tensor2D) {
    const onesM = ratings.greater(0).toInt();
    return tf.matMul(tf.transpose(onesM), onesM).arraySync() as number[][]
    // const onesM = toOnesM(ratings)
    //
    // return multiply(transpose(matrix(onesM)), matrix(onesM)).toArray() as number[][]
}

function filterMoviesSimilarity(moviesSims: number[][], overlapUsers: number[][], uniqueMovieIds: string[], minSims: number, minOverlap: number) {
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

    const ratings = zerosM(uniqueUserIds.length, uniqueMovieIds.length,);
    for (const row of data) {
        // if (row.authorId == 15)
        //     console.log()
        const movieIndex = uniqueMovieIds.findIndex(el => el == row.movieId);
        const userIndex = uniqueUserIds.findIndex(el => el == row.authorId);
        ratings[userIndex][movieIndex] = row.rating;
    }

    return {uniqueUserIds, uniqueMovieIds, ratings};
}

export function createRatingsTable(data: {
    movieId: string,
    authorId: number,
    rating: number
}[], uniqueUserIds: number[], uniqueMovieIds: string[]) {
    const ratings = zerosM(uniqueUserIds.length, uniqueMovieIds.length,);
    for (const row of data) {
        const movieIndex = uniqueMovieIds.findIndex(el => el == row.movieId);
        const userIndex = uniqueUserIds.findIndex(el => el == row.authorId);
        ratings[userIndex][movieIndex] = row.rating;
    }

    return ratings
}

export function calculateMoviesOtiaiSimilarity(data: {
    movieId: string,
    authorId: number,
    rating: number
}[], minSims = 0.5, minOverlap = 1) {
    if (data.length == 0) return []
    const {uniqueUserIds, uniqueMovieIds, ratings} = preprocessData(data);

    // const filteredElement = ratings[14].filter(el => el > 0)

    const ratingsTensor = tf.tensor2d(ratings)
    const moviesSims = otiaiSimsForMovies(ratingsTensor)
    const overlap = calculateOverlapUsersM(ratingsTensor)
    return filterMoviesSimilarity(moviesSims, overlap, uniqueMovieIds, minSims, minOverlap)
}

async function saveMoviesSimilarity(data: { source: string, target: string, similarity: number }[]) {

}

function calculateMoviesOtiaiSimilarityForChunk(ratingsTable: number[][], usersMean: number[], chunkUniqueMovieIds: string[], minSims = 0.5, minOverlap = 1) {
    const ratingsTensor = tf.tensor2d(ratingsTable)
    const moviesSims = otiaiSimsForMoviesChunked(ratingsTensor, tf.tensor1d(usersMean))
    const overlap = calculateOverlapUsersM(ratingsTensor)

    return filterMoviesSimilarity(moviesSims, overlap, chunkUniqueMovieIds, minSims, minOverlap,)
}

// export async function calculateMoviesOtiaiSimilarityChunked(usersData: {authorId:number, _avg: {rating: number | null}}[],getUniqueMoviesIds:(skip:number,take:number)=>Promise<{movieId:string}[]>,getChunkRatings: (movieIds:string[])=>Promise<{movieId: string, authorId: number, rating: number}[]>, simsCalculatedCallback: (sims:ReturnType<typeof filterMoviesSimilarity>)=>Promise<any> ,chunkSize=100,minSims=0.5,minOverlap=1){
//     if (usersData.length  == 0) return;
//
//     const progressBar = new ProgressBar(":bar :current/:total", { total: 98 });
//     for (let i=0;true;++i){
//         const chunkUniqueMovieIds = (await getUniqueMoviesIds(i*chunkSize, chunkSize)).map(mid=>mid.movieId)
//         if (chunkUniqueMovieIds.length == 0) return;
//         const ratings = await getChunkRatings(chunkUniqueMovieIds)
//         const uniqueUserIds = Array.from(new Set(ratings.map(r=>r.authorId))).sort((a, b) => a - b)
//
//         const ratingsTable = createRatingsTable(ratings, uniqueUserIds, chunkUniqueMovieIds)
//
//         const usersMean = usersData.filter(ud=> uniqueUserIds.includes(ud.authorId)).sort((a, b)=>a.authorId - b.authorId).map(ud=>ud._avg.rating!)
//
//         const chunkSims = calculateMoviesOtiaiSimilarityForChunk(ratingsTable,usersMean,chunkUniqueMovieIds,minSims,minOverlap)
//         await simsCalculatedCallback(chunkSims)
//         progressBar.tick()
//     }
//
// }

export async function calculateMoviesOtiaiSimilarityChunked(usersData: {
    authorId: number,
    _avg: { rating: number | null }
}[], uniqueMovieIds: string[], getChunkRatings: (movieIds: string[]) => Promise<{
    movieId: string,
    authorId: number,
    rating: number
}[]>, simsCalculatedCallback: (sims: ReturnType<typeof filterMoviesSimilarity>) => Promise<any>, chunkSize = 100, minSims = 0.5, minOverlap = 1) {
    if (usersData.length == 0) return;
    const nChunks = Math.ceil(uniqueMovieIds.length / chunkSize)
    const progressBar = new ProgressBar(":bar :current/:total", {total: nChunks* (nChunks -1) /2});
    for (let i = 0; i < nChunks-1; ++i) {
        for (let j = i+1; j < nChunks; ++j) {
            const chunkUniqueMovieIds = uniqueMovieIds.slice(i*chunkSize,(i+1)*chunkSize).concat(uniqueMovieIds.slice(j*chunkSize,(j+1)*chunkSize))
            const ratings = await getChunkRatings(chunkUniqueMovieIds)
            const uniqueUserIds = Array.from(new Set(ratings.map(r => r.authorId))).sort((a, b) => a - b)

            const ratingsTable = createRatingsTable(ratings, uniqueUserIds, chunkUniqueMovieIds)

            const usersMean = usersData.filter(ud => uniqueUserIds.includes(ud.authorId)).sort((a, b) => a.authorId - b.authorId).map(ud => ud._avg.rating!)

            const chunkSims = calculateMoviesOtiaiSimilarityForChunk(ratingsTable, usersMean, chunkUniqueMovieIds, minSims, minOverlap)
            await simsCalculatedCallback(chunkSims)
            progressBar.tick()
        }
    }

}

async function getUniqueMovieIds(skip: number, take: number) {
    return prisma.rating.findMany({
        distinct: ['movieId'],
        orderBy: {movieId: 'asc',},
        select: {movieId: true},
        skip: skip,
        take: take
    });
}

async function getChunkRatings(movieIds: string[]) {
    return prisma.rating.findMany({where: {movieId: {in: movieIds}}})
}

async function saveChunkSims(chunkSims: ReturnType<typeof filterMoviesSimilarity>) {
    await prisma.moviesSimilarity.createMany({
        data: chunkSims,
        skipDuplicates: true
    })
}

export async function createMoviesOtiaiSimilarityChunked(chunkSize = 100, minSims = 0.2, minOverlap = 4) {
    await flushDB()
    const usersData = await prisma.rating.groupBy({by: 'authorId', _avg: {rating: true}, orderBy: {authorId: 'asc'}})
    const uniqueMovieIds =  (await prisma.rating.findMany({
        distinct: ['movieId'],
        orderBy: {movieId: 'asc',},
        select: {movieId: true},
    })).map(mid=>mid.movieId);
    // await calculateMoviesOtiaiSimilarityChunked(usersData, getUniqueMovieIds, getChunkRatings, saveChunkSims, chunkSize, minSims, minOverlap)
    await calculateMoviesOtiaiSimilarityChunked(usersData, uniqueMovieIds, getChunkRatings, saveChunkSims, chunkSize, minSims, minOverlap)

    // if (usersData.length  == 0) return []
    // const uniqueMovieIds = await prisma.rating.findMany({distinct: ['movieId'], orderBy: {movieId: 'asc',}, select: {movieId: true}});


    // for (let i = 0; i < uniqueMovieIds.length; i += chunkSize) {
    //     const chunkUniqueMovieIds = uniqueMovieIds.slice(i, i + chunkSize).map(mi=>mi.movieId);
    //
    //     const ratings = await prisma.rating.findMany({where: {movieId: {in: chunkUniqueMovieIds}},select:{authorId:true,movieId:true,rating:true}})
    //     // const usersMean = await prisma.rating.groupBy({by: 'authorId',where: {movieId: {in: chunkMovieIds}},_avg: {rating:true},orderBy: {authorId: 'asc'}})
    //     const  uniqueUserIds = Array.from(new Set(ratings.map(r=>r.authorId))).sort((a, b) => a - b)
    //     const usersMean = usersData.filter(ud=> uniqueUserIds.includes(ud.authorId)).sort((a, b)=>a.authorId - b.authorId).map(ud=>ud._avg.rating!)
    //
    //     const ratingsTable = createRatingsTable(ratings, uniqueUserIds, chunkUniqueMovieIds)
    //
    //     const ratingsTensor = tf.tensor2d(ratingsTable)
    //     const moviesSims = otiaiSimsForMoviesSliced(ratingsTensor,tf.tensor1d(usersMean))
    //     const overlap = calculateOverlapUsersM(ratingsTensor)
    //
    //     const filtered = filterMoviesSimilarity(moviesSims, overlap,chunkUniqueMovieIds,0.2,4)
    //
    //     //callback
    // }
    // for slice in unique_movies_ids
    // ratings(slice)
    // norm_rating(slice,u_mean)
    // sims(norm_rating)
    // overlap(norm_rating)
    // filter
    // callback(slice) -> save(slice_sims)


    // const similarities = calculateMoviesOtiaiSimilarity(ratings)
    // await saveMoviesSimilarity(similarities)
}

// flushDB().then(loadRatings).then(data=>calculateMoviesSimilarity(data)).then(saveMoviesSimilarity)