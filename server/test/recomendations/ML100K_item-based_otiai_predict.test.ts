import {expect, test, beforeAll, describe} from "vitest";
import {deleteAllMoviesSimilarity, saveMoviesSimilarity} from "../../src/DAO/movie_similarity";
import {
    getRatingsByMovieIds,
    getUniqueMovieIdsFromRatings,
    getUsersAvgRatings,
    saveRatings
} from "../../src/DAO/ratings";
import {
    calculateSimilarityForMoviesOtiaiByChunksWithWorkersAsyncConveyor
} from "../../src/similarity/otiai/calculations_movies";
import {MovieSimilarityT} from "../../src/types/similarity.types";
import {ItemItemRecommender} from "../../src/recommenders/cf_nb_item_item_recommender";
import {getRatingsWithPriorityByUserId} from "../../src/DAO/priopity_ratings";

import {flushTestDB} from "../../src/utils/test";
import {readML100K} from "../../src/utils/csv";
import {saveUsers} from "../../src/DAO/user";
import {saveMovies} from "../../src/DAO/movie";

async function saveChunkSims(chunkSims: MovieSimilarityT[]) {
    await saveMoviesSimilarity(chunkSims, true)
}

async function getRatingsForChunk(movieIds: string[]) {
    return getRatingsByMovieIds(movieIds)
}
describe('item-based otiai predict', () => {
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

    await deleteAllMoviesSimilarity()
    const usersAvgData = await getUsersAvgRatings()
    const uniqueMovieIds = await getUniqueMovieIdsFromRatings()
    await calculateSimilarityForMoviesOtiaiByChunksWithWorkersAsyncConveyor(usersAvgData, uniqueMovieIds, getRatingsForChunk, saveChunkSims, 2000, 11, 0.2, 4)
})

test('recs NB i-i by userId',async ()=>{
    const recomender = new ItemItemRecommender(true)
    const recs = await recomender.recommendItems(101)
    expect(recs.length).toEqual(9)
    expect(recs[0].predictedRating).toBeCloseTo(4.528,2)
    expect(recs[0].movieId).toEqual("4815")
    expect(recs[0].recommendedByMovies.length).toEqual(2)
    expect(recs[0].recommendedByMovies[0].movieId).toEqual("3174")
    expect(recs[0].recommendedByMovies[1].movieId).toEqual("1127")
})

test('recs NB i-i by userId empty',async ()=>{
    const recomender = new ItemItemRecommender(true)
    const recs = await recomender.recommendItems(100100)
    expect(recs.length).toEqual(0)
})

test('predict NB i-i by userId',async ()=>{
    const recomender = new ItemItemRecommender(true)
    const score = await recomender.predictScore(101,"4378",2)
    expect(score).toBeCloseTo(4.496,2)
})

test('predict NB i-i by userId not in recs',async ()=>{
    const recomender = new ItemItemRecommender(true)
    const score = await recomender.predictScore(101,"4377")
    const userRatings = await getRatingsWithPriorityByUserId(101)
    const userMeanRating = userRatings.reduce((acc, rating) =>rating.rating + acc,0) / userRatings.length
    expect(score).toBeCloseTo(userMeanRating,2)
})})