import {isMainThread, parentPort, workerData} from "worker_threads";
import {preprocessDataForChunkByUserIds} from "../../preprocess_data";
import {calculateSimilarityForUsersOtiaiForChunk} from "../calculations_users";

if (!isMainThread) {
    (async () => {
        const {chunkUniqueUserIds, usersData, ratings, minSims, minOverlap, start} = workerData;

        const {ratingsTable, usersMean} = preprocessDataForChunkByUserIds(usersData, chunkUniqueUserIds, ratings)
        const chunkSims = calculateSimilarityForUsersOtiaiForChunk(ratingsTable, usersMean, chunkUniqueUserIds, minSims, minOverlap)
        parentPort!.postMessage({chunkSims, start});
    })()
}