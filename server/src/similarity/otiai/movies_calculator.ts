import {RatingT, UserAvgRatingT} from "../../types/rating.types";
import {preprocessData, preprocessDataForChunkByMovieIds} from "../preprocess_data";
const tf = require('@tensorflow/tfjs-node');
import {otiaiSimsForMovies, otiaiSimsForMoviesForChunk} from "./distance";
import {calculateOverlapUsersM} from "../overlap";
import {filterMoviesSimilarity} from "../filter_similarities";
import {SimilarityType} from "@prisma/client";
import {MovieSimilarityT} from "../../types/similarity.types";
import path from "path";
import {BaseOtiaiSimilarityCalculator} from "./base_calculator";



export class OtiaiMovieSimilarityCalculator extends BaseOtiaiSimilarityCalculator{
    #workerFilename = path.join(__dirname + '/workers/otiai_movie_worker.js')
    calculate(data:RatingT[],minSims=0.2,minOverlap=4){
        if (data.length  == 0) return []
        const { uniqueUserIds, uniqueMovieIds, ratings } = preprocessData(data);

        const ratingsTensor = tf.tensor2d(ratings)
        const moviesSims = otiaiSimsForMovies(ratingsTensor)
        const overlap = calculateOverlapUsersM(ratingsTensor)
        return filterMoviesSimilarity(moviesSims, overlap,uniqueMovieIds,minSims,minOverlap, SimilarityType.OTIAI)
    }

    calculateForChunk(ratingsTable: number[][], usersMean: number[], chunkUniqueMovieIds: string[], minSims :number, minOverlap:number) {
        const ratingsTensor = tf.tensor2d(ratingsTable)
        const moviesSims = otiaiSimsForMoviesForChunk(ratingsTensor, tf.tensor1d(usersMean))
        const overlap = calculateOverlapUsersM(ratingsTensor)

        return filterMoviesSimilarity(moviesSims, overlap, chunkUniqueMovieIds, minSims, minOverlap, SimilarityType.OTIAI)
    }


    async calculateByChunks(usersData: UserAvgRatingT[], uniqueMovieIds: string[], getRatingsForChunk: (movieIds: string[]) => Promise<RatingT[]>, simsCalculatedCallback: (sims: MovieSimilarityT[]) => Promise<any>, chunkSize = 100, minSims = 0.2, minOverlap = 4) {
        const IOParams = {
            usersData, uniqueIds: uniqueMovieIds, getRatingsForChunk, simsCalculatedCallback
        }
        const otherParams = {
            minSims, minOverlap, chunkSize
        }
        await this._calculateByChunks(preprocessDataForChunkByMovieIds,this.calculateForChunk,IOParams,otherParams)
    }
    async calculateByChunksWithWorkers(usersData: UserAvgRatingT[], uniqueMovieIds: string[], getRatingsForChunk: (movieIds: string[]) => Promise<RatingT[]>, simsCalculatedCallback: (sims: MovieSimilarityT[]) => Promise<any>, chunkSize = 100, maxThreads = 8, minSims = 0.2, minOverlap = 4) {
        const IOParams = {
            usersData, uniqueIds: uniqueMovieIds, getRatingsForChunk, simsCalculatedCallback
        }
        const otherParams = {
            minSims, minOverlap, chunkSize,maxThreads
        }
        await this._calculateByChunksWithWorkers(this.#workerFilename,IOParams,otherParams)
    }

    async calculateByChunksWithWorkersAsyncConveyor(usersData: UserAvgRatingT[], uniqueMovieIds: string[], getRatingsForChunk: (movieIds: string[]) => Promise<RatingT[]>, simsCalculatedCallback: (sims: MovieSimilarityT[]) => Promise<any>, chunkSize = 100, maxThreads = 8, minSims = 0.2, minOverlap = 4) {
        const IOParams = {
            usersData, uniqueIds: uniqueMovieIds, getRatingsForChunk, simsCalculatedCallback
        }
        const otherParams = {
            minSims, minOverlap, chunkSize,maxThreads
        }
        await this._calculateByChunksWithWorkersAsyncConveyor(this.#workerFilename, IOParams,otherParams)
    }


}