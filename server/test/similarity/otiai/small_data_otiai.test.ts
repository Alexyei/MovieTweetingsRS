import {beforeAll, expect, test} from "vitest";
import {normalizeRatings, otiaiSimsForMovies, otiaiSimsForUsers} from "../../../src/similarity/otiai/distance";
import {shortDataRatings} from "../../mocks/short_dataset_ratings";
import {preprocessData} from "../../../src/similarity/preprocess_data";
import {calculateSimilarityForMoviesOtiai} from "../../../src/similarity/otiai/calculations_movies";
import {calculateSimilarityForUsersOtiai} from "../../../src/similarity/otiai/calculations_users";
const tf = require('@tensorflow/tfjs-node');
beforeAll(async () => {

})

const data = shortDataRatings

test('otiai normalize',()=>{
    const { uniqueUserIds, uniqueMovieIds, ratings } = preprocessData(data)
    const normRatings = normalizeRatings(tf.tensor2d(ratings)).arraySync()
    expect(normRatings.length).toBe(ratings.length)
    expect(normRatings[0][0]).toBeCloseTo(2.2, 2)
    expect(normRatings[0][2]).toBeCloseTo(0, 2)
})

test('otiai sims movies',()=>{
    const { uniqueUserIds, uniqueMovieIds, ratings } = preprocessData(data)
    const sims = otiaiSimsForMovies(tf.tensor2d(ratings))
    expect(sims.length).toEqual(uniqueMovieIds.length)
    for (let i=0;i<sims.length;++i){
        expect(sims[i].length).toEqual(uniqueMovieIds.length)
        expect(sims[i][i]).toBeCloseTo(1, 2)
    }
    expect(sims[0][2]).toBeCloseTo(0.786, 2)
    expect(sims[2][0]).toBeCloseTo(0.786, 2)
    expect(sims[4][5]).toBeCloseTo(0.958, 2)
    expect(sims[5][4]).toBeCloseTo(0.958, 2)
})

test('otiai sims users',()=>{
    const { uniqueUserIds, uniqueMovieIds, ratings } = preprocessData(data)
    const sims = otiaiSimsForUsers( tf.tensor2d(ratings))
    expect(sims.length).toEqual(uniqueUserIds.length)
    for (let i=0;i<sims.length;++i){
        expect(sims[i].length).toEqual(uniqueUserIds.length)
        expect(sims[i][i]).toBeCloseTo(1, 2)
    }
    expect(sims[0][2]).toBeCloseTo(0.755, 2)
    expect(sims[2][0]).toBeCloseTo(0.755, 2)
    expect(sims[1][2]).toBeCloseTo(0.964, 2)
    expect(sims[2][1]).toBeCloseTo(0.964, 2)
    expect(sims[1][3]).toBeCloseTo(0.218, 2)
    expect(sims[3][1]).toBeCloseTo(0.218, 2)
})

test('item-similarity otiai builder', async () => {
    const sims = calculateSimilarityForMoviesOtiai(data,0.2,4)
    expect(sims.length % 2).toBe(0)
    expect(sims.length).toBe(4)
    expect(sims[0].similarity).toBeCloseTo(0.786, 2)
    expect(sims[1].similarity).toBeCloseTo(0.786, 2)
    expect(sims[2].similarity).toBeCloseTo(0.958, 2)
    expect(sims[3].similarity).toBeCloseTo(0.958, 2)
})

test('item-similarity otiai builder empty ratings', async () => {
    const sims = calculateSimilarityForMoviesOtiai([],0.2,4)
    expect(sims.length).toBe(0)
})
test('user-similarity otiai builder', async () => {
    const sims = calculateSimilarityForUsersOtiai(data,0.2,4)
    expect(sims.length % 2).toBe(0)
    expect(sims.length).toBe(10)
    expect(sims[0].similarity).toBeCloseTo(0.755, 2)
    expect(sims[1].similarity).toBeCloseTo(0.755, 2)
    expect(sims[2].similarity).toBeCloseTo(0.964, 2)
    expect(sims[3].similarity).toBeCloseTo(0.964, 2)
    expect(sims[4].similarity).toBeCloseTo(0.218, 2)
    expect(sims[5].similarity).toBeCloseTo(0.218, 2)
})
test('user-similarity otiai builder empty ratings', async () => {
    const sims = calculateSimilarityForUsersOtiai([],0.2,4)
    expect(sims.length).toBe(0)
})
