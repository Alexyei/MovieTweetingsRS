import {Tensor1D, Tensor2D} from "@tensorflow/tfjs-node";
const tf = require('@tensorflow/tfjs-node');

export function normalizeRatings(ratings: Tensor2D){
    const rowSums = ratings.relu().sum(1);        // Суммируем положительные значения по строке
    const rowCounts = ratings.greater(0).sum(1);  // Количество положительных значений по строке
    const rowMeans = rowSums.div(rowCounts);     // Среднее значение по строке                  // Среднее значение по строке
    const valuesToSubstract = ratings.greater(0).mul(rowMeans.reshape([rowMeans.shape[0],1]))
    const subtractedTensor = ratings.sub(valuesToSubstract);
    return subtractedTensor as Tensor2D
}

export function normalizeRatingsSliced(ratingsSlice: Tensor2D, userMeansSlice: Tensor1D){
    const valuesToSubstract = ratingsSlice.greater(0).mul(userMeansSlice.reshape([userMeansSlice.shape[0],1]))
    const subtractedTensor = ratingsSlice.sub(valuesToSubstract);
    return subtractedTensor as Tensor2D
}

function calculateOtiaiDistance(normRatings: Tensor2D) {
    const numerator = tf.matMul(normRatings, tf.transpose(normRatings))
    const sums = tf.sum(tf.mul(normRatings, normRatings), 1)
    const sqrtSums = tf.sqrt(sums)
    const denominator = tf.matMul(sqrtSums.reshape([ sqrtSums.shape[0],1]),sqrtSums.reshape([ 1,sqrtSums.shape[0]]))
    let res = tf.div(numerator, denominator);
    const replacedNaNTensor = tf.where(tf.isNaN(res), tf.zerosLike(res), res);
    return replacedNaNTensor.arraySync() as number[][]
}



export function otiaiSimsForMovies(ratings: Tensor2D){
    const norm_ratings = normalizeRatings(ratings)

    return calculateOtiaiDistance(tf.transpose(norm_ratings))
}

export function otiaiSimsForUsers(ratings: Tensor2D){
    const norm_ratings = normalizeRatings(ratings)

    return calculateOtiaiDistance(norm_ratings)
}

export function otiaiSimsForMoviesForChunk(ratingsChunk: Tensor2D, userMeansChunk: Tensor1D){
    const norm_ratings = normalizeRatingsSliced(ratingsChunk,userMeansChunk)

    return calculateOtiaiDistance(tf.transpose(norm_ratings))
}

export function otiaiSimsForUsersForChunk(ratingsChunk: Tensor2D, userMeansChunk: Tensor1D){
    const norm_ratings = normalizeRatingsSliced(ratingsChunk,userMeansChunk)

    return calculateOtiaiDistance(norm_ratings)
}