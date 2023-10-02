import {beforeAll, expect, test} from "vitest";
import {calculateMoviesOtiaiSimilarity, preprocessData} from "../../src/builders/calculate_movies_otiai_similarity";
import {calculateUsersOtiaiSimilarity} from "../../src/builders/calculate_users_otiai_similarity";
import {normalizeRatings, otiaiSimsForMovies, otiaiSimsForUsers} from "../../src/similarity/otiai/distance";
import {shortDataRatings} from "../mocks/ratings";
const tf = require('@tensorflow/tfjs');
beforeAll(async () => {

})

const data = shortDataRatings

test('otiai normalize',()=>{
    const { uniqueUserIds, uniqueMovieIds, ratings } = preprocessData(data)
    // console.log(ratings)
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
    const sims = calculateMoviesOtiaiSimilarity(data,0.2,4)
    // console.log(sims)
    expect(sims.length % 2).toBe(0)
    expect(sims.length).toBe(4)
    expect(sims[0].similarity).toBeCloseTo(0.786, 2)
    expect(sims[1].similarity).toBeCloseTo(0.786, 2)
    expect(sims[2].similarity).toBeCloseTo(0.958, 2)
    expect(sims[3].similarity).toBeCloseTo(0.958, 2)
})

test('item-similarity otiai builder empty ratings', async () => {
    const sims = calculateMoviesOtiaiSimilarity([],0.2,4)
    // console.log(sims)
    expect(sims.length).toBe(0)
})
test('user-similarity otiai builder', async () => {
    const sims = calculateUsersOtiaiSimilarity(data,0.2,4)
    console.log(sims)
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
    const sims = calculateUsersOtiaiSimilarity([],0.2,4)
    // console.log(sims)
    expect(sims.length).toBe(0)
})
//
// test('item-similarity otiai', async () => {
//     const data = {
//         'movie_id': [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6],
//         'user_id': [101, 102, 103, 104, 105, 106, 101, 102, 103, 104, 105, 106, 102, 103, 104, 105, 106, 101, 103, 105, 106, 101, 102, 103, 104, 105, 106, 101, 102, 103, 104, 105, 106],
//         'rating': [5, 4, 5, 3, 3, 2, 3, 3, 2, 5, 3, 3, 4, 5, 3, 3, 2, 2, 2, 2, 3, 2, 3, 1, 1, 4, 5, 2, 3, 1, 1, 5, 5]
//     };
//
//
//     const transformedData = data.movie_id.map((movie, index) => ({
//         movieId: movie.toString(),
//         userId: data.user_id[index],
//         rating: data.rating[index]
//     }));
//
//
//     console.log(transformedData)
//     const uniqueUserIds = Array.from(new Set(transformedData.map(item => item.userId)));
//     const uniqueMovieIds = Array.from(new Set(transformedData.map(item => item.movieId)));
//
//     const ratings = zerosM(uniqueMovieIds.length, uniqueUserIds.length)
//     for (const row of transformedData) {
//         const movieIndex = uniqueMovieIds.findIndex(el => el == row.movieId)
//         const userIndex = uniqueUserIds.findIndex(el => el == row.userId)
//         ratings[userIndex][movieIndex] = row.rating
//     }
//
//     console.log(ratings);
//
//     const norm_ratings = ratings.map((userRow) => {
//         const sum = sumRow(userRow)
//         const num = userRow.filter(el => el > 0).length
//         const mean = sum / num
//         const std = stdRow(userRow)
//         if (std == 0) {
//             return userRow.map(el => 0)
//         }
//
//         return userRow.map(el => el > 0 ? el - mean : 0)
//     })
//     console.log(norm_ratings)
//
//     function calculateOtiaiDistanceCorOpt(M: Matrix) {
//
//         const numerator = multiply(M, transpose(M));
//         const sums = sum(dotMultiply(M, M), 1)
//         // вычисление квадратов сумм по строкам
//         const sqrtSums = map(matrix((sums as any)._data.map((el: any) => [el])), sqrt)
//         const denominator = multiply(sqrtSums, transpose(sqrtSums))
//
//         let Res = dotDivide(numerator, denominator);
//         Res = Res.map(value => isNaN(value) ? 0 : value);
//         return Res.toArray()
//         // return sparse.csrMatrix(Res);
//     }
//
//     const moviesSims = calculateOtiaiDistanceCorOpt(transpose(matrix(norm_ratings))) as number[][]
//
//     const onesM = ratings.map(row => row.map(el => el > 0 ? 1 : 0))
//     // количество пользователей оценивших ОБА фильма
//     const overlap = multiply(transpose(matrix(onesM)), matrix(onesM)).toArray() as number[][]
//     console.log(overlap)
//     const minOverlap = 4
//     const minSims = 0.2
//
//     const simsData = []
//
//     for (let i = 0; i < moviesSims.length - 1; ++i) {
//         for (let j = i + 1; j < moviesSims.length; ++j) {
//             if (moviesSims[i][j] >= minSims && overlap[i][j] >= minOverlap) {
//                 simsData.push({
//                     "movieId1": uniqueMovieIds[i],
//                     "movieId2": uniqueMovieIds[j],
//                     "similarity": moviesSims[i][j]
//                 })
//             }
//         }
//     }
//
//
//     console.log(simsData)
// })
//
//
// test('user-similarity otiai', async () => {
//     const data = {
//         'movie_id': [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6],
//         'user_id': [101, 102, 103, 104, 105, 106, 101, 102, 103, 104, 105, 106, 102, 103, 104, 105, 106, 101, 103, 105, 106, 101, 102, 103, 104, 105, 106, 101, 102, 103, 104, 105, 106],
//         'rating': [5, 4, 5, 3, 3, 2, 3, 3, 2, 5, 3, 3, 4, 5, 3, 3, 2, 2, 2, 2, 3, 2, 3, 1, 1, 4, 5, 2, 3, 1, 1, 5, 5]
//     };
//
//     const transformedData = data.movie_id.map((movie, index) => ({
//         movieId: movie.toString(),
//         userId: data.user_id[index],
//         rating: data.rating[index]
//     }));
//
//
//     const uniqueUserIds = Array.from(new Set(transformedData.map(item => item.userId)));
//     const uniqueMovieIds = Array.from(new Set(transformedData.map(item => item.movieId)));
//
//     const ratings = zerosM(uniqueMovieIds.length, uniqueUserIds.length)
//     for (const row of transformedData) {
//         const movieIndex = uniqueMovieIds.findIndex(el => el == row.movieId)
//         const userIndex = uniqueUserIds.findIndex(el => el == row.userId)
//         ratings[userIndex][movieIndex] = row.rating
//     }
//
//     console.log(ratings);
//
//     const norm_ratings = ratings.map((userRow) => {
//         const sum = sumRow(userRow)
//         const num = userRow.filter(el => el > 0).length
//         const mean = sum / num
//         const std = stdRow(userRow)
//         if (std == 0) {
//             return userRow.map(el => 0)
//         }
//
//         return userRow.map(el => el > 0 ? el - mean : 0)
//     })
//     console.log(norm_ratings)
//
//     function calculateOtiaiDistanceCorOpt(M: Matrix) {
//
//         const numerator = multiply(M, transpose(M));
//         const sums = sum(dotMultiply(M, M), 1)
//         // вычисление квадратов сумм по строкам
//         const sqrtSums = map(matrix((sums as any)._data.map((el: any) => [el])), sqrt)
//         const denominator = multiply(sqrtSums, transpose(sqrtSums))
//
//         let Res = dotDivide(numerator, denominator);
//         Res = Res.map(value => isNaN(value) ? 0 : value);
//         return Res.toArray()
//         // return sparse.csrMatrix(Res);
//     }
//
//     const usersSims = calculateOtiaiDistanceCorOpt(matrix(norm_ratings)) as number[][]
//
//     const onesM = ratings.map(row => row.map(el => el > 0 ? 1 : 0))
//     // количество ОБЩИХ фильмов между пользователями
//     const overlap = multiply(matrix(onesM), transpose(matrix(onesM))).toArray() as number[][]
//     console.log(overlap)
//     const minOverlap = 4
//     const minSims = 0.2
//
//     const simsData = []
//
//     for (let i = 0; i < usersSims.length - 1; ++i) {
//         for (let j = i + 1; j < usersSims.length; ++j) {
//             if (usersSims[i][j] > minSims && overlap[i][j] > minOverlap) {
//                 simsData.push({
//                     "movieId1": uniqueUserIds[i],
//                     "movieId2": uniqueUserIds[j],
//                     "similarity": usersSims[i][j]
//                 })
//             }
//         }
//     }
//
//
//     console.log(simsData)
// })