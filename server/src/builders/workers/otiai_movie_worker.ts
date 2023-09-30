import {isMainThread, parentPort, threadId, Worker, workerData} from "worker_threads";
import {
    calculateMoviesOtiaiSimilarityForChunk,
    createRatingsTable,
} from "../calculate_movies_otiai_similarity_chunked";

if (!isMainThread) {
    (async ()=>{
    const { chunkUniqueMovieIds,usersData,ratings,minSims,minOverlap,start } = workerData;
    // const ratings = await getChunkRatings(chunkUniqueMovieIds)
    const uniqueUserIds = Array.from(new Set(ratings.map((r:any) => r.authorId))).sort((a:any, b:any) => a - b) as number[]

    const ratingsTable = createRatingsTable(ratings, uniqueUserIds, chunkUniqueMovieIds)

    const usersMean = usersData.filter((ud:any) => uniqueUserIds.includes(ud.authorId)).sort((a:any, b:any) => a.authorId - b.authorId).map((ud:any) => ud._avg.rating)

    const chunkSims = calculateMoviesOtiaiSimilarityForChunk(ratingsTable, usersMean, chunkUniqueMovieIds, minSims, minOverlap)
    parentPort!.postMessage({chunkSims,start});})()
}