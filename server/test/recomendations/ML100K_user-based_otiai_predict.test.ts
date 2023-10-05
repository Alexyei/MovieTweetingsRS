import {beforeAll, describe, expect, test} from "vitest";
import {
    getRatingsByUserIds,
    getUniqueUserIdsFromRatings,
    getUsersAvgRatings, saveRatings
} from "../../src/DAO/ratings";

import {UserSimilarityT} from "../../src/types/similarity.types";
import {getRatingsWithPriorityByUserId} from "../../src/DAO/priopity_ratings";
import {deleteAllUsersSimilarity, saveUsersSimilarity} from "../../src/DAO/user_similarity";
import {
    calculateSimilarityForUsersOtiaiByChunksWithWorkersAsyncConveyor
} from "../../src/similarity/otiai/calculations_users";
import {UserUserRecommender} from "../../src/recommenders/cf_nb_user_user_recommender";
import {flushTestDB} from "../../src/utils/test";
import {readML100K} from "../../src/utils/csv";
import {saveUsers} from "../../src/DAO/user";
import {saveMovies} from "../../src/DAO/movie";

async function saveChunkSims(chunkSims: UserSimilarityT[]) {
    await saveUsersSimilarity(chunkSims, true)
}

async function getRatingsForChunk(userIds: number[]) {
    return getRatingsByUserIds(userIds)
}
describe('user-based otiai predict', () => {
beforeAll(async () => {
    await flushTestDB()

    const ratingsData = await readML100K('./test/mocks/ML100K_ratings.csv')
    const usersData = Array.from(new Set(ratingsData.map(r => r.authorId))).map(el => ({id: el}))
    const moviesData = Array.from(new Set(ratingsData.map(r => r.movieId))).map(id => ({
        id,
        title: id + "title",
        year: 2010
    }))

    await saveUsers(usersData, true);
    await saveMovies(moviesData, true)
    await saveRatings(ratingsData, true)

    await deleteAllUsersSimilarity()
    const usersAvgData = await getUsersAvgRatings()
    const uniqueUserIds = await getUniqueUserIdsFromRatings()
    await calculateSimilarityForUsersOtiaiByChunksWithWorkersAsyncConveyor(usersAvgData, uniqueUserIds, getRatingsForChunk, saveChunkSims, 300, 11, 0.2, 4)

})

test('recs NB u-u by userId',async ()=>{
    const recomender = new UserUserRecommender()
    const recs = await recomender.recommendItems(35,10,5,0)
    expect(recs.length).toEqual(10)
    expect(recs[0].predictedRating).toBeCloseTo(5,2)
    expect(recs[0].movieId).toEqual("356")
    expect(recs[0].recommendedByUsers.length).toEqual(3)
    expect([444,485,584].includes(recs[0].recommendedByUsers[0].userId)).toBe(true)
    expect([444,485,584].includes(recs[0].recommendedByUsers[1].userId)).toBe(true)
    expect([444,485,584].includes(recs[0].recommendedByUsers[2].userId)).toBe(true)
})

test('recs NB u-u by userId empty',async ()=>{
    const recomender = new UserUserRecommender()
    const recs = await recomender.recommendItems(100100,10,5,0)
    expect(recs.length).toEqual(0)
})

test('predict NB i-i by userId',async ()=>{
    const recomender = new UserUserRecommender()
    const score = await recomender.predictScore(35,"161",5,0)
    expect(score).toBeCloseTo(4.78796,2)
})

test('predict NB i-i by userId not in recs',async ()=>{
    const recomender = new UserUserRecommender()
    const score = await recomender.predictScore(35,"4377",5,0)
    const userRatings = await getRatingsWithPriorityByUserId(35)
    const userMeanRating = userRatings.reduce((acc, rating) =>rating.rating + acc,0) / userRatings.length
    expect(score).toBeCloseTo(userMeanRating,2)
})})