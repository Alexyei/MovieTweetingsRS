import {dotDivide, dotMultiply, map, matrix, Matrix, multiply, sqrt, sum, transpose} from "mathjs";
import {stdRow, sumRow} from "../utils/math";

export function normalizeRatings(ratings:number[][]){
    return ratings.map((userRow) => {
        const sum = sumRow(userRow)
        const num = userRow.filter(el => el > 0).length
        const mean = sum / num
        const std = stdRow(userRow)
        if (std == 0) {
            return userRow.map(el => 0)
        }

        return userRow.map(el => el > 0 ? el - mean : 0)
})
}


function calculateOtiaiDistance(M: Matrix) {

    const numerator = multiply(M, transpose(M));
    const sums = sum(dotMultiply(M, M), 1)
    // вычисление квадратов сумм по строкам
    const sqrtSums = map(matrix((sums as any)._data.map((el: any) => [el])), sqrt)
    const denominator = multiply(sqrtSums, transpose(sqrtSums))

    let Res = dotDivide(numerator, denominator);
    Res = Res.map(value => isNaN(value) ? 0 : value);
    return Res.toArray()
    // return sparse.csrMatrix(Res);
}
export function otiaiSimsForMovies(ratings:number[][]){
    const norm_ratings = normalizeRatings(ratings)

    return calculateOtiaiDistance(transpose(matrix(norm_ratings))) as number[][]
}

export function otiaiSimsForUsers(ratings:number[][]){
    const norm_ratings = normalizeRatings(ratings)

    return calculateOtiaiDistance(matrix(norm_ratings)) as number[][]
}