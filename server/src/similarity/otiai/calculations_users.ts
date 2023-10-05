import {RatingT, UserAvgRatingT} from "../../types/rating.types";
import {preprocessData, preprocessDataForChunkByUserIds} from "../preprocess_data";
const tf = require('@tensorflow/tfjs');
import {otiaiSimsForUsers, otiaiSimsForUsersForChunk} from "./distance";
import {calculateOverlapMoviesM} from "../overlap";
import {filterUsersSimilarity} from "../filter_similarities";
import {SimilarityType} from "@prisma/client";
import {UserSimilarityT} from "../../types/similarity.types";
import ProgressBar from "progress";
import {Worker} from "worker_threads";
import path from "path";
import {createPinoLogger} from "../../logger/pino_basic_logger.js";

export function calculateSimilarityForUsersOtiai(data:RatingT[],minSims=0.2,minOverlap=4){
    if (data.length  == 0) return []
    const { uniqueUserIds, uniqueMovieIds, ratings } = preprocessData(data);
    const ratingsTensor = tf.tensor2d(ratings)
    const usersSims = otiaiSimsForUsers(ratingsTensor)
    const overlap = calculateOverlapMoviesM(ratingsTensor)

    return filterUsersSimilarity(usersSims, overlap,uniqueUserIds,minSims,minOverlap, SimilarityType.OTIAI)
}

export function calculateSimilarityForUsersOtiaiForChunk(ratingsTable: number[][], usersMean: number[], chunkUniqueUserIds: number[], minSims = 0.2, minOverlap = 4) {
    const ratingsTensor = tf.tensor2d(ratingsTable)
    const usersSims = otiaiSimsForUsersForChunk(ratingsTensor, tf.tensor1d(usersMean))
    const overlap = calculateOverlapMoviesM(ratingsTensor)

    return filterUsersSimilarity(usersSims, overlap, chunkUniqueUserIds, minSims, minOverlap, SimilarityType.OTIAI)
}

export async function calculateSimilarityForUsersOtiaiByChunks(usersData: UserAvgRatingT[], uniqueUserIds: number[], getRatingsForChunk: (userIds: number[]) => Promise<RatingT[]>, simsCalculatedCallback: (sims: UserSimilarityT[]) => Promise<any>, chunkSize = 100, minSims = 0.2, minOverlap = 4) {
    if (usersData.length == 0) return;
    const nChunks = Math.ceil(uniqueUserIds.length / chunkSize)
    const progressBar = new ProgressBar(":bar :current/:total", {total: nChunks * (nChunks - 1) / 2});
    for (let i = 0; i < nChunks - 1; ++i) {
        for (let j = i + 1; j < nChunks; ++j) {
            const chunkUniqueUserIds = uniqueUserIds.slice(i * chunkSize, (i + 1) * chunkSize).concat(uniqueUserIds.slice(j * chunkSize, (j + 1) * chunkSize))
            const ratings = await getRatingsForChunk(chunkUniqueUserIds)
            const {ratingsTable, usersMean} = preprocessDataForChunkByUserIds(usersData, chunkUniqueUserIds, ratings)
            const chunkSims = calculateSimilarityForUsersOtiaiForChunk(ratingsTable, usersMean, chunkUniqueUserIds, minSims, minOverlap)
            await simsCalculatedCallback(chunkSims)
            progressBar.tick()
        }
    }
}

async function runCalculationSimilarityForUsersForChunk(workerFilename:string, progressBar:ProgressBar, workerData: {minSims:number,minOverlap:number, chunkUniqueUserIds: number[],usersData: UserAvgRatingT[], ratings: RatingT[],simsCalculatedCallback: (sims: UserSimilarityT[]) => Promise<any>}) {
    return new Promise<void>((resolve, reject) => {
        const {minSims,minOverlap, chunkUniqueUserIds,ratings, usersData,simsCalculatedCallback} = workerData;
        const worker = new Worker(workerFilename, {
            workerData: {
                chunkUniqueUserIds,
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
            console.log(`Thread time: ${(Date.now() - start) / 1000} seconds`);
            worker.off('error', reject);
            // worker.off('exit', resolve);
            await worker.terminate(); // Завершаем worker после выполнения
            resolve()
        });

        worker.on('error',(error)=> reject(error));
        // worker.on('exit', resolve);
        // worker.postMessage(); // Передаем данные в worker
    });
}

export async function calculateSimilarityForUsersOtiaiByChunksWithWorkers(usersData: UserAvgRatingT[], uniqueUserIds: number[], getChunkRatings: (userIds: number[]) => Promise<RatingT[]>, simsCalculatedCallback: (sims: UserSimilarityT[]) => Promise<any>, chunkSize = 100, maxThreads = 8, minSims = 0.2, minOverlap = 4) {
    if (usersData.length == 0) return;
    const nChunks = Math.ceil(uniqueUserIds.length / chunkSize)
    const progressBar = new ProgressBar(":bar :current/:total", {total: nChunks * (nChunks - 1) / 2});
    let workers = [];
    const workersCount = maxThreads
    const workerFilename = path.join(__dirname + '/workers/otiai_user_worker.js')
    for (let i = 0; i < nChunks - 1; ++i) {
        for (let j = i + 1; j < nChunks; ++j) {
            if (workers.length >= workersCount) {
                await Promise.all(workers);
                workers = []
            }
            const chunkUniqueUserIds = uniqueUserIds
                .slice(i * chunkSize, (i + 1) * chunkSize)
                .concat(uniqueUserIds.slice(j * chunkSize, (j + 1) * chunkSize));
            const ratings = await getChunkRatings(chunkUniqueUserIds)
            workers.push(runCalculationSimilarityForUsersForChunk(workerFilename, progressBar,{chunkUniqueUserIds, ratings,usersData,minSims,minOverlap,simsCalculatedCallback}));
        }
    }
    await Promise.all(workers);
}

export async function calculateSimilarityForUsersOtiaiByChunksWithWorkersAsyncConveyor(usersData: UserAvgRatingT[], uniqueUserIds: number[], getChunkRatings: (userIds: number[]) => Promise<RatingT[]>, simsCalculatedCallback: (sims: UserSimilarityT[]) => Promise<any>, chunkSize = 100, maxThreads = 11, minSims = 0.2, minOverlap = 4) {
    if (usersData.length == 0) return;
    const nChunks = Math.ceil(uniqueUserIds.length / chunkSize)
    const progressBar = new ProgressBar(":bar :current/:total", {total: nChunks * (nChunks - 1) / 2});
    let workers = [];
    const workersCount = maxThreads
    const workerFilename = path.join(__dirname + '/workers/otiai_user_worker.js')
    const generator = generateSequence()
    const logger = createPinoLogger('otiai_user_sims')
    logger.child({'type':'asyncConveyor'})
    for (let i = 0; i < workersCount; ++i) {
        workers.push(runThread(runCalculationSimilarityForUsersForChunk, generator, i))
    }

    await Promise.all(workers);

    async function runThread(runCalculationChunk: typeof runCalculationSimilarityForUsersForChunk, generator: ReturnType<typeof generateSequence>, threadId: number) {

        let done = false;

        while (!done) {
            const data = await generator.next();
            done = data.done!;

            if (!done) {
                try {
                    await runCalculationChunk(workerFilename, progressBar, {
                        chunkUniqueUserIds: data.value!.chunkUniqueUserIds,
                        ratings: data.value!.ratings,
                        usersData,
                        minSims,
                        minOverlap,
                        simsCalculatedCallback
                    })
                    logger.info({msg:'success',thread: threadId, i: data.value!.i, j: data.value!.j})
                } catch (error) {
                    logger.error({msg:'error',thread: threadId, i: data.value!.i, j: data.value!.j})
                    logger.error(error)
                }

            }
        }
    }

    async function* generateSequence() {
        for (let i = 0; i < nChunks - 1; ++i) {
            for (let j = i + 1; j < nChunks; ++j) {
                const chunkUniqueUserIds = uniqueUserIds
                    .slice(i * chunkSize, (i + 1) * chunkSize)
                    .concat(uniqueUserIds.slice(j * chunkSize, (j + 1) * chunkSize));
                const ratings = await getChunkRatings(chunkUniqueUserIds)

                yield {chunkUniqueUserIds, ratings, i, j}
            }
        }

    }

}