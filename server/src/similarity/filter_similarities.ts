import {SimilarityType} from "@prisma/client";

function filterSimilarity<IDType extends string | number>(sims: number[][], overlap: number[][], ids: IDType[], minSims: number, minOverlap: number, type: SimilarityType) {
    const simsData = []
    for (let i = 0; i < sims.length - 1; ++i) {
        for (let j = i + 1; j < sims.length; ++j) {
            if (sims[i][j] > minSims && overlap[i][j] > minOverlap) {
                simsData.push({
                    "source": ids[i],
                    "target": ids[j],
                    "similarity": sims[i][j],
                    "type": type
                })
                simsData.push({
                    "source": ids[j],
                    "target": ids[i],
                    "similarity": sims[i][j],
                    "type": type
                })
            }
        }
    }
    return simsData
}

export function filterMoviesSimilarity(moviesSims: number[][], overlapUsers: number[][], uniqueMovieIds: string[], minSims: number, minOverlap: number, type:SimilarityType) {
    return filterSimilarity(moviesSims,overlapUsers,uniqueMovieIds,minSims,minOverlap,type)
}

export function filterUsersSimilarity(usersSims:number[][], overlapMovies:number[][],uniqueUserIds:number[], minSims:number,minOverlap:number, type:SimilarityType){
    return filterSimilarity(usersSims,overlapMovies,uniqueUserIds,minSims,minOverlap,type)
}