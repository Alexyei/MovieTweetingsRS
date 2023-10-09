import {zerosM} from "../src/utils/math";
import {Tensor2D} from "@tensorflow/tfjs-node";
const tf = require('@tensorflow/tfjs-node');
// import {Tensor2D} from "@tensorflow/tfjs";
// const tf = require('@tensorflow/tfjs');
test('tf', () => {
    const rowSize = 10;
    const colSize = 10000;
    const arr = [];

// Создаем массив с случайными значениями
    for (let i = 0; i < rowSize; i++) {
        const row = [];
        for (let j = 0; j < colSize; j++) {
            row.push(Math.random());
        }
        arr.push(row);
    }
    console.time('1')
    // const M = tf.randomUniform([610, 10000]);
    const M = tf.tensor2d(arr)
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

test('reshape',()=>{
    const sqrtSums = tf.tensor1d([10, 20, 30, 40])
    console.log(sqrtSums.reshape([ sqrtSums.shape[0],1]).arraySync())
    console.log(sqrtSums.reshape([ 1,sqrtSums.shape[0]]).arraySync())
})

test('pearson',()=>{




    function transposeM(matrix:number[][]){
        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    }

    function matrixDot (A:number[][], B:number[][]) {
        var result = new Array(A.length).fill(0).map(row => new Array(B[0].length).fill(0));

        return result.map((row, i) => {
            return row.map((val, j) => {
                return A[i].reduce((sum, elm, k) => sum + (elm*B[k][j]) ,0)
            })
        })
    }

    // const normRatings = [[1, 2, 3], [0, 0, 1], [4, 0, 2],[4, 7, 2]]

    // normRatings это матрица n на m
    // numerator это матрица n на n
    // оптимизируй и перепиши этот код используя tensorflow

    const normRatings = [[0.2, 1.2, 0.2, 0, -0.8, -0.8], [-0.33, -0.33, -0.33, -1.33, 0.67, 1.67]]
    const numerator = matrixDot(normRatings,transposeM(normRatings))

    const ones = toOnes(normRatings)


    function toOnes(matrix:number[][]){
        return matrix.map(row => row.map(element => element !== 0 ? 1 : 0));
    }

    function AND(vectorA:number[], vectorB:number[]){
        return vectorA.map((element, index) => element && vectorB[index])
    }

    function MUL(vectorA:number[], vectorB:number[]){
        return vectorA.map((element, index) => element * vectorB[index])
    }

    function SUM(vector:number[]){
        return vector.reduce((partialSum, a) => partialSum + a, 0)
    }

    for(let i =0; i<normRatings.length;++i){
        for(let j =0; j<normRatings.length;++j){
            const maskI = ones[i]
            const maskJ = ones[j]
            const ANDmask = MUL(maskI,maskJ)

            const elemetsI = MUL(ANDmask,normRatings[i])
            const sqrI = MUL(elemetsI,elemetsI)
            const elemetsJ = MUL(ANDmask,normRatings[j])

            const sqrJ = MUL(elemetsJ,elemetsJ)
            const sumI = SUM(sqrI)
            const sumJ = SUM(sqrJ)
            console.log(sumI, sumJ)
            const sqrtI = Math.sqrt(sumI)
            const sqrtJ = Math.sqrt(sumJ)

            numerator[i][j] = numerator[i][j]/(sqrtI*sqrtJ)
        }
    }
    console.log(numerator)
})

test('pearson tf',()=>{
    const normRatings = tf.tensor2d([[0.2, 1.2, 0.2, 0, -0.8, -0.8], [-0.33, -0.33, -0.33, -1.33, 0.67, 1.67]])
    const numerator = tf.matMul(normRatings,tf.transpose(normRatings))


    const ones = tf.where(tf.notEqual(normRatings, 0), tf.ones(normRatings.shape), tf.zeros(normRatings.shape));
    const sqr = tf.mul(normRatings,normRatings)

    const numeratorData = numerator.arraySync();

    // for(let i = 0; i < normRatings.shape[0]; ++i) {
    //     for(let j = 0; j < normRatings.shape[0]; ++j) {
    //         const maskI = ones.slice([i, 0], [1, normRatings.shape[1]]);
    //         const maskJ = ones.slice([j, 0], [1, normRatings.shape[1]]);
    //         const ANDmask = tf.mul(maskI, maskJ);
    //
    //         const sqrI = tf.mul(ANDmask, sqr.slice([i, 0], [1, sqr.shape[1]]));
    //         const sqrJ = tf.mul(ANDmask, sqr.slice([j, 0], [1, sqr.shape[1]]));
    //         const sqrtI = tf.sqrt(tf.sum(sqrI))
    //         const sqrtJ = tf.sqrt(tf.sum(sqrJ))
    //         numeratorData[i][j] = numeratorData[i][j] / (sqrtI.arraySync() * sqrtJ.arraySync());
    //     }
    // }

    for(let i = 0; i < normRatings.shape[0]; ++i) {
        for(let j = i; j < normRatings.shape[0]; ++j) {
            const maskI = ones.slice([i, 0], [1, normRatings.shape[1]]);
            const maskJ = ones.slice([j, 0], [1, normRatings.shape[1]]);
            const ANDmask = tf.mul(maskI, maskJ);

            const sqrI = tf.mul(ANDmask, sqr.slice([i, 0], [1, sqr.shape[1]]));
            const sqrJ = tf.mul(ANDmask, sqr.slice([j, 0], [1, sqr.shape[1]]));
            const sqrtI = tf.sqrt(tf.sum(sqrI))
            const sqrtJ = tf.sqrt(tf.sum(sqrJ))
            numeratorData[i][j] = numeratorData[i][j] / (sqrtI.arraySync() * sqrtJ.arraySync());
            if (i!=j)
            numeratorData[j][i] = numeratorData[j][i] / (sqrtI.arraySync() * sqrtJ.arraySync());
        }
    }

    console.log(numeratorData)
})


test('pearson 3',()=>{
    const normRatings = tf.tensor2d([[0.2, 1.2, 0.2, 0, -0.8, -0.8], [-0.33, -0.33, -0.33, -1.33, 0.67, 1.67]]);
    const sqr = tf.square(normRatings);

    const numerator = tf.matMul(sqr, tf.transpose(sqr));

    const ones = tf.where(tf.notEqual(sqr, 0), tf.ones(sqr.shape), tf.zeros(sqr.shape));
    const sumSqr = tf.sqrt(tf.sum(sqr, 1));

    const sqrtI = tf.reshape(sumSqr, [sumSqr.shape[0], 1]).mul(ones);
    const sqrtJ = tf.reshape(sumSqr, [sumSqr.shape[0],1]).mul(ones);
    console.log(sqrtI.shape)
    console.log(sqrtJ.shape)
    const denominator = sqrtI.matMul(tf.transpose(sqrtJ));

    const result = numerator.div(denominator);
    console.log(result.arraySync());
})