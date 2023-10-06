// import {Tensor2D} from "@tensorflow/tfjs";
import {Tensor2D} from "@tensorflow/tfjs-node";
// const tf = require('@tensorflow/tfjs');
const tf = require('@tensorflow/tfjs-node');

// количество пользователей оценивших ОБА фильма
export function calculateOverlapUsersM(ratings:Tensor2D) {
    const onesM = ratings.greater(0).toInt();
    return tf.matMul(tf.transpose(onesM), onesM).arraySync() as number[][]
}

// количество ОБЩИХ фильмов между пользователями
export function calculateOverlapMoviesM(ratings:Tensor2D) {
    const onesM = ratings.greater(0).toInt();
    return tf.matMul(onesM, tf.transpose(onesM)).arraySync() as number[][]
}