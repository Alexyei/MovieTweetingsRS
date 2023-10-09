import {UserSimilarityT} from "../../src/types/similarity.types";
import {
    calculateSimilarityForUsersOtiaiByChunksWithWorkersAsyncConveyor
} from "../../src/similarity/otiai/calculations_users";
import {UserUserRecommender} from "../../src/recommenders/cf_nb_user_user_recommender";
import {flushTestDB, loadML100KDataSet} from "../../src/utils/test";
import {getDAO} from "../../src/DAO/DAO";
const dao = getDAO(true)
async function saveChunkSims(chunkSims: UserSimilarityT[]) {
    await dao.userSimilarity.saveMany(chunkSims, true)
}

async function getRatingsForChunk(userIds: number[]) {
    return dao.rating.getByUserIds(userIds)
}
describe('user-based otiai predict', () => {
beforeAll(async () => {
    await flushTestDB()
    await loadML100KDataSet()

    await dao.userSimilarity.deleteAll()
    const usersAvgData = await dao.rating.getAvgRatings()
    const uniqueUserIds = await dao.rating.getUniqueUserIds()
    await calculateSimilarityForUsersOtiaiByChunksWithWorkersAsyncConveyor(usersAvgData, uniqueUserIds, getRatingsForChunk, saveChunkSims, 300, 11, 0.2, 4)

})

test('recs NB u-u by userId',async ()=>{
    const recomender = new UserUserRecommender(true,5,0)
    const recs = await recomender.recommendItems(35,10,)
    expect(recs.length).toEqual(10)
    expect(recs[0].predictedRating).toBeCloseTo(5,2)
    expect(recs[0].movieId).toEqual("356")
    expect(recs[0].recommendedByUsers.length).toEqual(3)
    expect([444,485,584].includes(recs[0].recommendedByUsers[0].userId)).toBe(true)
    expect([444,485,584].includes(recs[0].recommendedByUsers[1].userId)).toBe(true)
    expect([444,485,584].includes(recs[0].recommendedByUsers[2].userId)).toBe(true)
})

test('recs NB u-u by userId empty',async ()=>{
    const recomender = new UserUserRecommender(true, 5,0)
    const recs = await recomender.recommendItems(100100,10,)
    expect(recs.length).toEqual(0)
})

test('predict NB i-i by userId',async ()=>{
    const recomender = new UserUserRecommender(true,5,0)
    const score = await recomender.predictScore(35,"161",)
    expect(score).toBeCloseTo(4.78796,2)
})

test('predict NB i-i by userId not in recs',async ()=>{
    const recomender = new UserUserRecommender(true,5,0)
    const score = await recomender.predictScore(35,"4377",)
    const userRatings = await dao.rating.getByUserId(35)
    const userMeanRating = userRatings.reduce((acc, rating) =>rating.rating + acc,0) / userRatings.length
    expect(score).toBeCloseTo(userMeanRating,2)
})})