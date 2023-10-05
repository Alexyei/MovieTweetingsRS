import {isMainThread, parentPort, workerData} from "worker_threads";
import {preprocessDataForChunkByMovieIds} from "../../preprocess_data";
import {calculateSimilarityForMoviesOtiaiForChunk} from "../calculations_movies";


if (!isMainThread) {
    (async () => {
        const {chunkUniqueMovieIds, usersData, ratings, minSims, minOverlap, start} = workerData;

        const {ratingsTable, usersMean} = preprocessDataForChunkByMovieIds(usersData, chunkUniqueMovieIds, ratings)
        const chunkSims = calculateSimilarityForMoviesOtiaiForChunk(ratingsTable, usersMean, chunkUniqueMovieIds, minSims, minOverlap)
        parentPort!.postMessage({chunkSims, start});
    })()
}