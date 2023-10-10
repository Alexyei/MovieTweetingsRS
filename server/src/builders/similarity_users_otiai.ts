import {SimilarityType} from "@prisma/client";
import {UserSimilarityT} from "../types/similarity.types";
import {getDAO} from "../DAO/DAO";
import {getSimilarityCalculator} from "../similarity/calculator";
const dao = getDAO(false)
const similarityCalculator = getSimilarityCalculator().users.otiai
async function flushDB(){
    await dao.movieSimilarity.deleteByType(SimilarityType.OTIAI)
}

async function getRatings(){
    return dao.priorityRating.all()
}

async function saveSimilarityForUsersFromChunk(chunkUserSims: UserSimilarityT[]) {
    await dao.userSimilarity.saveMany(chunkUserSims,true)
}
async function getUsersAvg(){

    return dao.priorityRating.getAvgRatings()
}

async function getUsersUniqueIds(){
    return dao.priorityRating.getUniqueUserIds()
}
export async function getRatingsForChunk(userIds: number[]) {
    return dao.priorityRating.getByUserIds(userIds)
}
export async function buildSimilarityForUsersOtiai(minSims=0.2,minOverlap=4){
    await flushDB()
    const ratings = await getRatings()
    const similarities = similarityCalculator.calculate(ratings,minSims,minOverlap)
    await dao.userSimilarity.saveMany(similarities,false)
}

export async function buildSimilarityForUsersOtiaiByChunks(chunkSize = 100, minSims = 0.2, minOverlap = 4) {
    await flushDB()
    const usersData = await getUsersAvg()
    const uniqueUserIds = await getUsersUniqueIds()
    await similarityCalculator.calculateByChunks(usersData, uniqueUserIds, getRatingsForChunk, saveSimilarityForUsersFromChunk, chunkSize, minSims, minOverlap)
}

export async function buildSimilarityForUsersOtiaiByChunksWithWorkers(chunkSize = 100, maxThreads = 11, minSims = 0.2, minOverlap = 4) {
    try {
        await flushDB()
        const usersData = await getUsersAvg()
        const uniqueUserIds = await getUsersUniqueIds()
        await similarityCalculator.calculateByChunksWithWorkers(usersData, uniqueUserIds, getRatingsForChunk, saveSimilarityForUsersFromChunk, chunkSize, maxThreads, minSims, minOverlap)
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
        await similarityCalculator.calculateByChunksWithWorkersAsyncConveyor(usersData, uniqueUserIds, getRatingsForChunk, saveSimilarityForUsersFromChunk, chunkSize, maxThreads, minSims, minOverlap)
        console.log(`Calculated for: ${(Date.now() - start) / 1000} seconds`);
    } catch (err) {
        console.log(err)
    }
}