import {shortDataRatings} from "../mocks/short_dataset_ratings";
import {preprocessData} from "../../src/similarity/preprocess_data";
import {calculateOverlapMoviesM, calculateOverlapUsersM} from "../../src/similarity/overlap";
const tf = require('@tensorflow/tfjs-node');

const data = shortDataRatings
test('overlap users',()=>{
    const { uniqueUserIds, uniqueMovieIds, ratings } = preprocessData(data)
    const overlap = calculateOverlapUsersM(tf.tensor2d(ratings))
    expect(overlap.length).toBe(uniqueMovieIds.length)
    expect(overlap[0][1]).toBe(6)
    expect(overlap[1][0]).toBe(6)
    expect(overlap[2][3]).toBe(3)
    expect(overlap[3][2]).toBe(3)
})

test('overlap movies',()=>{
    const { uniqueUserIds, uniqueMovieIds, ratings } = preprocessData(data)
    const overlap = calculateOverlapMoviesM(tf.tensor2d(ratings))
    expect(overlap.length).toBe(uniqueUserIds.length)
    expect(overlap[0][1]).toBe(4)
    expect(overlap[1][0]).toBe(4)
    expect(overlap[0][3]).toBe(4)
    expect(overlap[3][0]).toBe(4)
})