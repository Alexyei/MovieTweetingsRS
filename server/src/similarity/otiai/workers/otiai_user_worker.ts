import {isMainThread, parentPort, workerData} from "worker_threads";
import {preprocessDataForChunkByUserIds} from "../../preprocess_data";
// import {calculateSimilarityForUsersOtiaiForChunk} from "../calculations_users";
import {getSimilarityCalculator} from "../../calculator";
const calculateSimilarityForUsersOtiaiForChunk = getSimilarityCalculator().users.otiai.calculateForChunk

if (!isMainThread) {
    (async () => {
        const {chunkUniqueIds, usersData, ratings, minSims, minOverlap, start} = workerData;
        const chunkUniqueUserIds = chunkUniqueIds
        const {ratingsTable, usersMean} = preprocessDataForChunkByUserIds(usersData, chunkUniqueUserIds, ratings)
        const chunkSims = calculateSimilarityForUsersOtiaiForChunk(ratingsTable, usersMean, chunkUniqueUserIds, minSims, minOverlap)
        parentPort!.postMessage({chunkSims, start});
    })()
}