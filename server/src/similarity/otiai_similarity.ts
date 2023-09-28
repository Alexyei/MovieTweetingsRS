import {dotDivide, dotMultiply, map, matrix, Matrix, multiply, sqrt, sum, transpose} from "mathjs";
import {stdRow, sumRow} from "../utils/math";
import {Tensor2D} from "@tensorflow/tfjs";
const tf = require('@tensorflow/tfjs');

// export function normalizeRatings(ratings:number[][]){
//     return ratings.map((userRow) => {
//         const sum = sumRow(userRow)
//         const num = userRow.filter(el => el > 0).length
//         const mean = sum / num
//         const std = stdRow(userRow)
//         if (std == 0) {
//             return userRow.map(el => 0)
//         }
//
//         return userRow.map(el => el > 0 ? el - mean : 0)
// })
// }

export function normalizeRatings(ratings: Tensor2D){
    // const ratingArr = ratings.arraySync()
    // const filteredElement = ratingArr[14].filter(el => el > 0)
    const rowSums = ratings.relu().sum(1);        // Суммируем положительные значения по строке
    // const rowSumsArr = rowSums.arraySync()
    const rowCounts = ratings.greater(0).sum(1);  // Количество положительных значений по строке
    // const rowCountArr = rowCounts.arraySync()
    const rowMeans = rowSums.div(rowCounts);     // Среднее значение по строке                  // Среднее значение по строке
    // const rowMeansArr = rowMeans.arraySync()
    const valuesToSubstract = ratings.greater(0).mul(rowMeans.reshape([rowMeans.shape[0],1]))
    const subtractedTensor = ratings.sub(valuesToSubstract);
    return subtractedTensor as Tensor2D
    // const mean = tf.mean(ratings, 1, true)
    // const subtractedTensor = tf.sub(ratings, rowMeans);
    // const zeroed = subtractedTensor.relu();
    // return zeroed as Tensor2D
}

function calculateOtiaiDistance(normRatings: Tensor2D) {
    // const nra = normRatings.arraySync()
    const numerator = tf.matMul(normRatings, tf.transpose(normRatings))
    const sums = tf.sum(tf.mul(normRatings, normRatings), 1)
    const sqrtSums = tf.sqrt(sums)
    const denominator = tf.matMul(sqrtSums.reshape([ sqrtSums.shape[0],1]),sqrtSums.reshape([ 1,sqrtSums.shape[0]]))
    let res = tf.div(numerator, denominator);
    const replacedNaNTensor = tf.where(tf.isNaN(res), tf.zerosLike(res), res);
    return replacedNaNTensor.arraySync() as number[][]
}

// function calculateOtiaiDistance(M: Matrix) {
//
//     const numerator = multiply(M, transpose(M));
//     const sums = sum(dotMultiply(M, M), 1)
//     // вычисление квадратов сумм по строкам
//     const sqrtSums = map(matrix((sums as any)._data.map((el: any) => [el])), sqrt)
//     const denominator = multiply(sqrtSums, transpose(sqrtSums))
//
//     let Res = dotDivide(numerator, denominator);
//     Res = Res.map(value => isNaN(value) ? 0 : value);
//     return Res.toArray()
//     // return sparse.csrMatrix(Res);
// }

export function otiaiSimsForMovies(ratings: Tensor2D){
    // const ratingArr = ratings.arraySync()
    // const filteredElement = ratingArr[14].filter(el => el > 0)

    const norm_ratings = normalizeRatings(ratings)

    return calculateOtiaiDistance(tf.transpose(norm_ratings))
}

export function otiaiSimsForUsers(ratings: Tensor2D){
    const norm_ratings = normalizeRatings(ratings)

    return calculateOtiaiDistance(norm_ratings)
}