import {MovieSimilarityT} from "../../src/types/similarity.types";
import {ItemItemRecommender} from "../../src/recommenders/cf_nb_item_item_recommender";

import {flushTestDB, loadML100KDataSet} from "../../src/utils/test";
import {getDAO} from "../../src/DAO/DAO";
import {getSimilarityCalculator} from "../../src/similarity/calculator";

const dao = getDAO(true);
const similarityCalculator = getSimilarityCalculator().movies.otiai
async function saveChunkSims(chunkSims: MovieSimilarityT[]) {
    await dao.movieSimilarity.saveMany(chunkSims,true)
}

async function getRatingsForChunk(movieIds: string[]) {
    return dao.rating.getByMovieIds(movieIds)
}
describe('item-based otiai predict', () => {
beforeAll(async () => {
    await flushTestDB()

    await loadML100KDataSet()

    await dao.movieSimilarity.deleteAll()
    const usersAvgData = await dao.rating.getAvgRatings()
    const uniqueMovieIds = await dao.rating.getUniqueMovieIds()
    await similarityCalculator.calculateByChunksWithWorkersAsyncConveyor(usersAvgData, uniqueMovieIds, getRatingsForChunk, saveChunkSims, 2000, 11, 0.2, 4)
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
    const userRatings = await dao.rating.getByUserId(101)
    const userMeanRating = userRatings.reduce((acc, rating) =>rating.rating + acc,0) / userRatings.length
    expect(score).toBeCloseTo(userMeanRating,2)
})})