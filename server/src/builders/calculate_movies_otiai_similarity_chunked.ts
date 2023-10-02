import {zerosM} from "../utils/math";
import {otiaiSimsForMovies, otiaiSimsForMoviesForChunk} from "../similarity/otiai/distance";
import {PrismaClient,  SimilarityType} from "@prisma/client";
import {Tensor2D} from "@tensorflow/tfjs";
import ProgressBar from "progress";
import {Worker} from "worker_threads";
import path from "path";
import {createBasicLogger} from "../logger/basic_logger";

const logger = createBasicLogger("similarity_otiai")
const tf = require('@tensorflow/tfjs');
const prisma = new PrismaClient();

async function flushDB() {
    await prisma.moviesSimilarity.deleteMany({where: {type: 'OTIAI'}})
}


// количество пользователей оценивших ОБА фильма
export function calculateOverlapUsersM(ratings: Tensor2D) {
    const onesM = ratings.greater(0).toInt();
    return tf.matMul(tf.transpose(onesM), onesM).arraySync() as number[][]
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


    const ratingsTensor = tf.tensor2d(ratings)
    const moviesSims = otiaiSimsForMovies(ratingsTensor)
    const overlap = calculateOverlapUsersM(ratingsTensor)
    return filterMoviesSimilarity(moviesSims, overlap, uniqueMovieIds, minSims, minOverlap)
}


export function calculateMoviesOtiaiSimilarityForChunk(ratingsTable: number[][], usersMean: number[], chunkUniqueMovieIds: string[], minSims = 0.5, minOverlap = 1) {
    const ratingsTensor = tf.tensor2d(ratingsTable)
    const moviesSims = otiaiSimsForMoviesForChunk(ratingsTensor, tf.tensor1d(usersMean))
    const overlap = calculateOverlapUsersM(ratingsTensor)

    return filterMoviesSimilarity(moviesSims, overlap, chunkUniqueMovieIds, minSims, minOverlap,)
}

type RatingType = {
    movieId: string, authorId: number, rating: number
}

type UserMeanType = {
    authorId: number, _avg: { rating: number | null }
}

export function preprocessDataForChunk(usersData: UserMeanType[], chunkUniqueMovieIds: string[], ratings: RatingType[]) {
    const uniqueUserIds = Array.from(new Set(ratings.map(r => r.authorId))).sort((a, b) => a - b)

    const ratingsTable = createRatingsTable(ratings, uniqueUserIds, chunkUniqueMovieIds)

    const usersMean = usersData.filter(ud => uniqueUserIds.includes(ud.authorId)).sort((a, b) => a.authorId - b.authorId).map(ud => ud._avg.rating!)

    return {ratingsTable, usersMean}
}

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
    const progressBar = new ProgressBar(":bar :current/:total", {total: nChunks * (nChunks - 1) / 2});
    for (let i = 0; i < nChunks - 1; ++i) {
        for (let j = i + 1; j < nChunks; ++j) {
            const chunkUniqueMovieIds = uniqueMovieIds.slice(i * chunkSize, (i + 1) * chunkSize).concat(uniqueMovieIds.slice(j * chunkSize, (j + 1) * chunkSize))
            const ratings = await getChunkRatings(chunkUniqueMovieIds)
            // const uniqueUserIds = Array.from(new Set(ratings.map(r => r.authorId))).sort((a, b) => a - b)
            //
            // const ratingsTable = createRatingsTable(ratings, uniqueUserIds, chunkUniqueMovieIds)
            //
            // const usersMean = usersData.filter(ud => uniqueUserIds.includes(ud.authorId)).sort((a, b) => a.authorId - b.authorId).map(ud => ud._avg.rating!)
            const {ratingsTable, usersMean} = preprocessDataForChunk(usersData, chunkUniqueMovieIds, ratings)
            const chunkSims = calculateMoviesOtiaiSimilarityForChunk(ratingsTable, usersMean, chunkUniqueMovieIds, minSims, minOverlap)
            await simsCalculatedCallback(chunkSims)
            progressBar.tick()
        }
    }

}

export async function calculateMoviesOtiaiSimilarityChunkedWithWorkers(usersData: {
    authorId: number,
    _avg: { rating: number | null }
}[], uniqueMovieIds: string[], getChunkRatings: (movieIds: string[]) => Promise<{
    movieId: string,
    authorId: number,
    rating: number
}[]>, simsCalculatedCallback: (sims: ReturnType<typeof filterMoviesSimilarity>) => Promise<any>, chunkSize = 100, maxThreads = 8, minSims = 0.5, minOverlap = 1) {
    if (usersData.length == 0) return;
    const nChunks = Math.ceil(uniqueMovieIds.length / chunkSize)
    const progressBar = new ProgressBar(":bar :current/:total", {total: nChunks * (nChunks - 1) / 2});
    let workers = [];
    const workersCount = maxThreads
    const workerFilename = path.join(__dirname + '/workers/otiai_movie_worker.js')
    for (let i = 0; i < nChunks - 1; ++i) {
        for (let j = i + 1; j < nChunks; ++j) {
            if (workers.length >= workersCount) {
                await Promise.all(workers);
                workers = []
            }
            const chunkUniqueMovieIds = uniqueMovieIds
                .slice(i * chunkSize, (i + 1) * chunkSize)
                .concat(uniqueMovieIds.slice(j * chunkSize, (j + 1) * chunkSize));
            const ratings = await getChunkRatings(chunkUniqueMovieIds)
            workers.push(runCalculationChunk(i, j, chunkUniqueMovieIds, ratings));
        }
    }
    await Promise.all(workers);


    async function runCalculationChunk(i: number, j: number, chunkUniqueMovieIds: string[], ratings: any) {
        return new Promise<void>((resolve, reject) => {

            const worker = new Worker(workerFilename, {
                workerData: {
                    chunkUniqueMovieIds,
                    usersData,
                    ratings,
                    minSims,
                    minOverlap,
                    start: Date.now()
                }
            }); // Создаем нового worker

            worker.on('message', async (answer: any) => {
                const {chunkSims, start} = answer
                await simsCalculatedCallback(chunkSims);
                progressBar.tick();
                console.log(`Поток выполнился за: ${(Date.now() - start) / 1000} секунд`);
                worker.off('error', reject);
                // worker.off('exit', resolve);
                await worker.terminate(); // Завершаем worker после выполнения
                resolve()
            });

            worker.on('error', reject);
            // worker.on('exit', resolve);
            // worker.postMessage(); // Передаем данные в worker
        });
    }
}

export async function calculateMoviesOtiaiSimilarityChunkedWithWorkersAsyncConveyor(usersData: {
    authorId: number,
    _avg: { rating: number | null }
}[], uniqueMovieIds: string[], getChunkRatings: (movieIds: string[]) => Promise<{
    movieId: string,
    authorId: number,
    rating: number
}[]>, simsCalculatedCallback: (sims: ReturnType<typeof filterMoviesSimilarity>) => Promise<any>, chunkSize = 100, maxThreads = 8, minSims = 0.5, minOverlap = 1) {
    if (usersData.length == 0) return;
    const nChunks = Math.ceil(uniqueMovieIds.length / chunkSize)
    const progressBar = new ProgressBar(":bar :current/:total", {total: nChunks * (nChunks - 1) / 2});
    let workers = [];
    const workersCount = maxThreads
    const workerFilename = path.join(__dirname + '/workers/otiai_movie_worker.js')
    const generator = generateSequence()
    for (let i = 0; i < workersCount; ++i) {
        workers.push(runThread(runCalculationChunk, generator, i))
    }

    await Promise.all(workers);

    async function runThread(runCalculationChunk: (chunkUniqueMovieIds: string[], ratings: any) => Promise<any>, generator: ReturnType<typeof generateSequence>, threadId: number) {

        let done = false;

        while (!done) {
            const data = await generator.next();
            done = data.done!;

            if (!done) {
                await runCalculationChunk(data.value!.chunkUniqueMovieIds, data.value!.ratings)
                logger.log('info', {t: threadId, i: data.value!.i, j: data.value!.j})
                console.log({t: threadId, i: data.value!.i, j: data.value!.j})
            }
        }
    }

    async function* generateSequence() {
        for (let i = 24; i < nChunks - 1; ++i) {
            for (let j = i + 1; j < nChunks; ++j) {
                const chunkUniqueMovieIds = uniqueMovieIds
                    .slice(i * chunkSize, (i + 1) * chunkSize)
                    .concat(uniqueMovieIds.slice(j * chunkSize, (j + 1) * chunkSize));
                const ratings = await getChunkRatings(chunkUniqueMovieIds)

                yield {chunkUniqueMovieIds, ratings, i, j}
            }
        }

    }

    async function runCalculationChunk(chunkUniqueMovieIds: string[], ratings: any) {
        return new Promise<void>((resolve, reject) => {

            const worker = new Worker(workerFilename, {
                workerData: {
                    chunkUniqueMovieIds,
                    usersData,
                    ratings,
                    minSims,
                    minOverlap,
                    start: Date.now()
                }
            }); // Создаем нового worker

            worker.on('message', async (answer: any) => {
                const {chunkSims, start} = answer
                await simsCalculatedCallback(chunkSims);
                progressBar.tick();
                console.log(`Поток выполнился за: ${(Date.now() - start) / 1000} секунд`);
                logger.log('info', `Thread time: ${(Date.now() - start) / 1000} seconds`)
                worker.off('error', reject);
                // worker.off('exit', resolve);
                await worker.terminate(); // Завершаем worker после выполнения
                resolve()
            });

            worker.on('error', (error) => {
                logger.log('error', error)
                reject(error)
            });
            // worker.on('exit', resolve);
            // worker.postMessage(); // Передаем данные в worker
        });
    }
}


export async function getChunkRatings(movieIds: string[]) {
    return prisma.rating.findMany({where: {movieId: {in: movieIds}}})
}

async function saveChunkSims(chunkSims: ReturnType<typeof filterMoviesSimilarity>) {
    await prisma.moviesSimilarity.createMany({
        data: chunkSims,
        skipDuplicates: true
    })
}

export async function buildMoviesOtiaiSimilarityChunked(chunkSize = 100, minSims = 0.2, minOverlap = 4) {
    await flushDB()
    const usersData = await prisma.rating.groupBy({by: 'authorId', _avg: {rating: true}, orderBy: {authorId: 'asc'}})
    const uniqueMovieIds = (await prisma.rating.findMany({
        distinct: ['movieId'],
        orderBy: {movieId: 'asc',},
        select: {movieId: true},
    })).map(mid => mid.movieId);
    // await calculateMoviesOtiaiSimilarityChunked(usersData, getUniqueMovieIds, getChunkRatings, saveChunkSims, chunkSize, minSims, minOverlap)
    await calculateMoviesOtiaiSimilarityChunked(usersData, uniqueMovieIds, getChunkRatings, saveChunkSims, chunkSize, minSims, minOverlap)
}

export async function buildMoviesOtiaiSimilarityChunkedWithWorkers(chunkSize = 100, maxThreads = 8, minSims = 0.2, minOverlap = 4) {
    // await flushDB()
    const usersData = await prisma.rating.groupBy({by: 'authorId', _avg: {rating: true}, orderBy: {authorId: 'asc'}})
    const uniqueMovieIds = (await prisma.rating.findMany({
        distinct: ['movieId'],
        orderBy: {movieId: 'asc',},
        select: {movieId: true},
    })).map(mid => mid.movieId);
    // await calculateMoviesOtiaiSimilarityChunked(usersData, getUniqueMovieIds, getChunkRatings, saveChunkSims, chunkSize, minSims, minOverlap)
    await calculateMoviesOtiaiSimilarityChunkedWithWorkers(usersData, uniqueMovieIds, getChunkRatings, saveChunkSims, chunkSize, maxThreads, minSims, minOverlap)
}

export async function buildMoviesOtiaiSimilarityChunkedWithWorkersAsyncConveyor(chunkSize = 100, maxThreads = 8, minSims = 0.2, minOverlap = 4) {
    // await flushDB()
    try {
        const usersData = await prisma.rating.groupBy({
            by: 'authorId',
            _avg: {rating: true},
            orderBy: {authorId: 'asc'}
        })
        const uniqueMovieIds = (await prisma.rating.findMany({
            distinct: ['movieId'],
            orderBy: {movieId: 'asc',},
            select: {movieId: true},
        })).map(mid => mid.movieId);
        // await calculateMoviesOtiaiSimilarityChunked(usersData, getUniqueMovieIds, getChunkRatings, saveChunkSims, chunkSize, minSims, minOverlap)
        await calculateMoviesOtiaiSimilarityChunkedWithWorkersAsyncConveyor(usersData, uniqueMovieIds, getChunkRatings, saveChunkSims, chunkSize, maxThreads, minSims, minOverlap)
    } catch (err) {
        logger.log('error', 'Error in promise')
        logger.log('error', err)
    }
}