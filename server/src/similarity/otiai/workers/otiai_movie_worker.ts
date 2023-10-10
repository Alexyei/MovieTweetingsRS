import {isMainThread, parentPort, workerData} from "worker_threads";
import {preprocessDataForChunkByMovieIds} from "../../preprocess_data";
// import {calculateSimilarityForMoviesOtiaiForChunk} from "../calculations_movies";
import {getSimilarityCalculator} from "../../calculator";
const calculateSimilarityForMoviesOtiaiForChunk = getSimilarityCalculator().movies.otiai.calculateForChunk

if (!isMainThread) {
    (async () => {
        const {chunkUniqueIds, usersData, ratings, minSims, minOverlap, start} = workerData;
        const chunkUniqueMovieIds = chunkUniqueIds
        const {ratingsTable, usersMean} = preprocessDataForChunkByMovieIds(usersData, chunkUniqueMovieIds, ratings)
        const chunkSims = calculateSimilarityForMoviesOtiaiForChunk(ratingsTable, usersMean, chunkUniqueMovieIds, minSims, minOverlap)
        parentPort!.postMessage({chunkSims, start});
    })()
}