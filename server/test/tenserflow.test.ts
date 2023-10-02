import {beforeAll, expect, test} from "vitest";
import {zerosM} from "../src/utils/math";
import {Tensor2D} from "@tensorflow/tfjs";
const tf = require('@tensorflow/tfjs');

test('tf', () => {
    const rowSize = 100;
    const colSize = 100000;
    const arr = [];

// Создаем массив с случайными значениями
    for (let i = 0; i < rowSize; i++) {
        const row = [];
        for (let j = 0; j < colSize; j++) {
            row.push(Math.random());
        }
        arr.push(row);
    }

    console.log(arr);
    console.time('1')
    // const M = tf.randomUniform([610, 10000]);
    const M = tf.tensor2d(arr)
    console.log('created')
    // randomArray.print()
    // const X = tf.tensor2d(randomArray.arraySync());
    const numerator1 = tf.matMul(tf.transpose(M),M)
    const numerator = tf.matMul(M, tf.transpose(M))
    const sums = tf.sum(tf.mul(M, M), 1)
    sums.print()
    const sqrtSums = tf.sqrt(sums)
    console.log(sqrtSums.reshape([ 1,sqrtSums.shape[0]]).shape,sqrtSums.reshape([sqrtSums.shape[0], 1]).shape)
    const denominator = tf.matMul(sqrtSums.reshape([ 1,sqrtSums.shape[0]]),sqrtSums.reshape([sqrtSums.shape[0], 1]))
    denominator.print()
    let res = tf.div(numerator, denominator);
    res.print()
    const replacedNaNTensor = tf.where(tf.isNaN(res), tf.zerosLike(res), res);
    // console.log(res.arraySync())
    console.timeEnd('1')

})

test('tf null',()=>{
    const tensor = tf.tensor2d([[1, NaN, 3], [NaN, 5, NaN]]);
    const replacedTensor = tf.where(tf.isNaN(tensor), tf.zerosLike(tensor), tensor);
    replacedTensor.print()
})

test('tf zerosM',()=>{
    const ratings = tf.zeros([610, 10000]);
    const buffer = ratings.bufferSync()

    for (let i=0;i<100000;++i) {
        const movieIndex = Math.floor(Math.random() * 10000);
        const userIndex = Math.floor(Math.random() * 610);
        buffer.set(i, userIndex, movieIndex);
    }
    buffer.toTensor().arraySync()
})

test('usually list  zerosM',()=>{
    const ratings = zerosM(610,10000);
    // const buffer = ratings.bufferSync()

    for (let i=0;i<100000;++i) {
        const movieIndex = Math.floor(Math.random() * 10000);
        const userIndex = Math.floor(Math.random() * 610);
        ratings[userIndex][movieIndex] = i
    }
    ratings
})

test('sub mean',()=>{
    const tensor = tf.tensor2d([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 8, 8]]);
    const mean = tf.mean(tensor, 1, true)
    const subtractedTensor = tf.sub(tensor, mean);
    subtractedTensor.print()
    const zeroed = subtractedTensor.relu();
    zeroed.print()
})

test('overlap',()=>{
    const tensor = tf.tensor2d([
        [0.1, -2, 3.1],
        [-4, 5, 0],
        [7, -8, 9]
    ]);

// Замена положительных элементов на 1, остальных на 0
    const result = tensor.greater(tf.scalar(0)).toInt();
    result.print()
})

test('mean greater zero elements',()=>{
    function subtractRowMeanAndReplaceNegatives(tensor:Tensor2D) {
        const rowSums = tensor.relu().sum(1);        // Суммируем положительные значения по строке
        rowSums.print()
        const rowCounts = tensor.greater(0).sum(1);  // Количество положительных значений по строке
        rowCounts.print()
        const rowMeans = rowSums.div(rowCounts);     // Среднее значение по строке                  // Среднее значение по строке
        rowMeans.print()
        const subtracted = tensor.sub(rowMeans.reshape([rowMeans.shape[0],1]));    // Вычитаем среднее значение из каждого элемента в строке
        subtracted.print()
        const replacedNegatives = subtracted.relu(); // Заменяем отрицательные значения на нули

        return replacedNegatives;
    }

    const tensor = tf.tensor2d([[1, 2, 3], [-1, 0, 1], [4, -3, 2]]);
    const result = subtractRowMeanAndReplaceNegatives(tensor);
    result.print()
})

test('substract',()=>{
    function addValuesToZeros(matrix:any, vector:any) {
        // Создаем маску для нулевых элементов матрицы
        const zeroMask = matrix.greater(0);

        // Умножаем маску на одномерный вектор для получения соответствующих значений,
        // которые должны быть добавлены к нулевым элементам
        const valuesToAdd = zeroMask.mul(vector.reshape([vector.shape[0],1]));
        valuesToAdd.print()
        // Добавляем значения к нулевым элементам матрицы
        const result = matrix.sub(valuesToAdd);

        return result;
    }

// Пример использования
    const matrix = tf.tensor2d([[1, 2, 3], [0, 0, 1], [4, 0, 2]]);
    const vector = tf.tensor1d([10, 20, 30]);
    const result = addValuesToZeros(matrix, vector);

    result.print();
})

test('substract columns',()=>{
    const ratingsSlice = tf.tensor2d([[1, 2, 3], [0, 0, 1], [4, 0, 2],[4, 7, 2]]);
    const userMeansSlice = tf.tensor1d([10, 20, 30, 40]);
    const valuesToSubstract = ratingsSlice.greater(0).mul(userMeansSlice.reshape([userMeansSlice.shape[0],1]))
    const subtractedTensor = ratingsSlice.sub(valuesToSubstract);
    subtractedTensor.print()
})