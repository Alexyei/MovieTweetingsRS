export function sumRow(list: number[]) {
    return list.reduce((partialSum, a) => partialSum + a, 0);
}

export function stdRow(list: number[]) {
    if (list.length == 0) return 0.0
    const n = list.length
    const mean = list.reduce((a, b) => a + b) / n
    return Math.sqrt(list.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

export function zerosM(rows: number, columns: number) {
    return Array(rows).fill(0).map(() => Array(columns).fill(0));
}

export function toOnesM(matrix: number[][]){
    return matrix.map(row => row.map(el => el > 0 ? 1 : 0))
}