import {SimilarityType} from "@prisma/client";
import {
    calculateSimilarityForUsersOtiai,
    calculateSimilarityForUsersOtiaiByChunks,
    calculateSimilarityForUsersOtiaiByChunksWithWorkers,
    calculateSimilarityForUsersOtiaiByChunksWithWorkersAsyncConveyor
} from "../similarity/otiai/calculations_users";
import {UserSimilarityT} from "../types/similarity.types";
import {deleteUsersSimilarityByType, saveUsersSimilarity} from "../DAO/user_similarity";
import {
    getRatingsWithPriority,
    getRatingsWithPriorityByUserIds,
    getUsersAvgRatingsWithPriority
} from "../DAO/priopity_ratings";

import {getUniqueUserIdsFromRatings} from "../DAO/ratings";

async function flushDB(){
    await deleteUsersSimilarityByType(SimilarityType.OTIAI,false)
}

async function getRatings(){
    return getRatingsWithPriority(false)
}

async function saveSimilarityForUsersFromChunk(chunkUserSims: UserSimilarityT[]) {
    await saveUsersSimilarity(chunkUserSims, true,false)
}
async function getUsersAvg(){
    // return prisma.rating.groupBy({by: 'authorId', _avg: {rating: true}, orderBy: {authorId: 'asc'}})
    // return  getUsersAvgRatings()
    return getUsersAvgRatingsWithPriority(false)
}

async function getUsersUniqueIds(){
    return getUniqueUserIdsFromRatings(false)
}
export async function getRatingsForChunk(userIds: number[]) {
    return getRatingsWithPriorityByUserIds(userIds,false)
    // return prisma.rating.findMany({where: {movieId: {in: movieIds}}})
}
export async function buildSimilarityForUsersOtiai(minSims=0.2,minOverlap=4){
    await flushDB()
    const ratings = await getRatings()
    const similarities = calculateSimilarityForUsersOtiai(ratings,minSims,minOverlap)
    await saveUsersSimilarity(similarities,false,false)
}

export async function buildSimilarityForUsersOtiaiByChunks(chunkSize = 100, minSims = 0.2, minOverlap = 4) {
    await flushDB()
    const usersData = await getUsersAvg()
    const uniqueUserIds = await getUsersUniqueIds()
    await calculateSimilarityForUsersOtiaiByChunks(usersData, uniqueUserIds, getRatingsForChunk, saveSimilarityForUsersFromChunk, chunkSize, minSims, minOverlap)
}

export async function buildSimilarityForUsersOtiaiByChunksWithWorkers(chunkSize = 100, maxThreads = 11, minSims = 0.2, minOverlap = 4) {
    try {
        await flushDB()
        const usersData = await getUsersAvg()
        const uniqueUserIds = await getUsersUniqueIds()
        await calculateSimilarityForUsersOtiaiByChunksWithWorkers(usersData, uniqueUserIds, getRatingsForChunk, saveSimilarityForUsersFromChunk, chunkSize, maxThreads, minSims, minOverlap)
    } catch (err) {
        console.log(err)
    }
}

export async function buildSimilarityForUsersOtiaiByChunksWithWorkersAsyncConveyor(chunkSize = 100, maxThreads = 11, minSims = 0.2, minOverlap = 4) {
    try {
        await flushDB()
        const usersData = await getUsersAvg()
        const uniqueUserIds = await getUsersUniqueIds()
        const start = Date.now()
        await calculateSimilarityForUsersOtiaiByChunksWithWorkersAsyncConveyor(usersData, uniqueUserIds, getRatingsForChunk, saveSimilarityForUsersFromChunk, chunkSize, maxThreads, minSims, minOverlap)
        console.log(`Calculated for: ${(Date.now() - start) / 1000} seconds`);
    } catch (err) {
        console.log(err)
    }
}