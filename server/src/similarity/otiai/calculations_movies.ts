const tf = require('@tensorflow/tfjs');
import {otiaiSimsForMovies, otiaiSimsForMoviesForChunk} from "./distance";
import {preprocessData, preprocessDataForChunk} from "../preprocess_data";
import {calculateOverlapUsersM} from "../overlap";
import {filterMoviesSimilarity} from "../filter_similarities";
import {SimilarityType} from "@prisma/client";
import {RatingT, UserAvgRatingT} from "../../types/rating.types";
import ProgressBar from "progress";
import {MovieSimilarityT} from "../../types/similarity.types";
import path from "path";
import {Worker} from "worker_threads";


export function calculateSimilarityForMoviesOtiai(data:RatingT[],minSims=0.2,minOverlap=4){
    if (data.length  == 0) return []
    const { uniqueUserIds, uniqueMovieIds, ratings } = preprocessData(data);

    const ratingsTensor = tf.tensor2d(ratings)
    const moviesSims = otiaiSimsForMovies(ratingsTensor)
    const overlap = calculateOverlapUsersM(ratingsTensor)
    return filterMoviesSimilarity(moviesSims, overlap,uniqueMovieIds,minSims,minOverlap, SimilarityType.OTIAI)
}
export function calculateSimilarityForMoviesOtiaiForChunk(ratingsTable: number[][], usersMean: number[], chunkUniqueMovieIds: string[], minSims = 0.2, minOverlap = 4) {
    const ratingsTensor = tf.tensor2d(ratingsTable)
    const moviesSims = otiaiSimsForMoviesForChunk(ratingsTensor, tf.tensor1d(usersMean))
    const overlap = calculateOverlapUsersM(ratingsTensor)

    return filterMoviesSimilarity(moviesSims, overlap, chunkUniqueMovieIds, minSims, minOverlap, SimilarityType.OTIAI)
}
export async function calculateSimilarityForMoviesOtiaiByChunks(usersData: UserAvgRatingT[], uniqueMovieIds: string[], getRatingsForChunk: (movieIds: string[]) => Promise<RatingT[]>, simsCalculatedCallback: (sims: MovieSimilarityT[]) => Promise<any>, chunkSize = 100, minSims = 0.2, minOverlap = 4) {
    if (usersData.length == 0) return;
    const nChunks = Math.ceil(uniqueMovieIds.length / chunkSize)
    const progressBar = new ProgressBar(":bar :current/:total", {total: nChunks * (nChunks - 1) / 2});
    for (let i = 0; i < nChunks - 1; ++i) {
        for (let j = i + 1; j < nChunks; ++j) {
            const chunkUniqueMovieIds = uniqueMovieIds.slice(i * chunkSize, (i + 1) * chunkSize).concat(uniqueMovieIds.slice(j * chunkSize, (j + 1) * chunkSize))
            const ratings = await getRatingsForChunk(chunkUniqueMovieIds)
            const {ratingsTable, usersMean} = preprocessDataForChunk(usersData, chunkUniqueMovieIds, ratings)
            const chunkSims = calculateSimilarityForMoviesOtiaiForChunk(ratingsTable, usersMean, chunkUniqueMovieIds, minSims, minOverlap)
            await simsCalculatedCallback(chunkSims)
            progressBar.tick()
        }
    }
}
async function runCalculationSimilarityForMoviesForChunk(workerFilename:string, progressBar:ProgressBar, workerData: {minSims:number,minOverlap:number, chunkUniqueMovieIds: string[],usersData: UserAvgRatingT[], ratings: RatingT[],simsCalculatedCallback: (sims: MovieSimilarityT[]) => Promise<any>}) {
    return new Promise<void>((resolve, reject) => {
        const {minSims,minOverlap, chunkUniqueMovieIds,ratings, usersData,simsCalculatedCallback} = workerData;
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
export async function calculateSimilarityForMoviesOtiaiByChunksWithWorkers(usersData: UserAvgRatingT[], uniqueMovieIds: string[], getChunkRatings: (movieIds: string[]) => Promise<RatingT[]>, simsCalculatedCallback: (sims: MovieSimilarityT[]) => Promise<any>, chunkSize = 100, maxThreads = 8, minSims = 0.2, minOverlap = 4) {
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
            workers.push(runCalculationSimilarityForMoviesForChunk(workerFilename, progressBar,{chunkUniqueMovieIds, ratings,usersData,minSims,minOverlap,simsCalculatedCallback}));
        }
    }
    await Promise.all(workers);
}
export async function calculateSimilarityForMoviesOtiaiByChunksWithWorkersAsyncConveyor(usersData: UserAvgRatingT[], uniqueMovieIds: string[], getChunkRatings: (movieIds: string[]) => Promise<RatingT[]>, simsCalculatedCallback: (sims: MovieSimilarityT[]) => Promise<any>, chunkSize = 100, maxThreads = 11, minSims = 0.2, minOverlap = 4) {
    if (usersData.length == 0) return;
    const nChunks = Math.ceil(uniqueMovieIds.length / chunkSize)
    const progressBar = new ProgressBar(":bar :current/:total", {total: nChunks * (nChunks - 1) / 2});
    let workers = [];
    const workersCount = maxThreads
    const workerFilename = path.join(__dirname + '/workers/otiai_movie_worker.js')
    const generator = generateSequence()
    for (let i = 0; i < workersCount; ++i) {
        workers.push(runThread(runCalculationSimilarityForMoviesForChunk, generator, i))
    }

    await Promise.all(workers);

    async function runThread(runCalculationChunk: typeof runCalculationSimilarityForMoviesForChunk, generator: ReturnType<typeof generateSequence>, threadId: number) {

        let done = false;

        while (!done) {
            const data = await generator.next();
            done = data.done!;

            if (!done) {
                await runCalculationChunk(workerFilename, progressBar,{chunkUniqueMovieIds:data.value!.chunkUniqueMovieIds, ratings:data.value!.ratings,usersData,minSims,minOverlap,simsCalculatedCallback})
                console.log({t: threadId, i: data.value!.i, j: data.value!.j})
            }
        }
    }

    async function* generateSequence() {
        for (let i = 0; i < nChunks - 1; ++i) {
            for (let j = i + 1; j < nChunks; ++j) {
                const chunkUniqueMovieIds = uniqueMovieIds
                    .slice(i * chunkSize, (i + 1) * chunkSize)
                    .concat(uniqueMovieIds.slice(j * chunkSize, (j + 1) * chunkSize));
                const ratings = await getChunkRatings(chunkUniqueMovieIds)

                yield {chunkUniqueMovieIds, ratings, i, j}
            }
        }

    }

}