import {BaseOtiaiSimilarityCalculator} from "./base_calculator";
import path from "path";
import {RatingT, UserAvgRatingT} from "../../types/rating.types";
import {preprocessData, preprocessDataForChunkByUserIds} from "../preprocess_data";
const tf = require('@tensorflow/tfjs-node');
import {otiaiSimsForUsers, otiaiSimsForUsersForChunk} from "./distance";
import {calculateOverlapMoviesM} from "../overlap";
import {filterUsersSimilarity} from "../filter_similarities";
import {SimilarityType} from "@prisma/client";
import {UserSimilarityT} from "../../types/similarity.types";

export class OtiaiUserSimilarityCalculator extends BaseOtiaiSimilarityCalculator {
    #workerFilename = path.join(__dirname + '/workers/otiai_user_worker.js')

    calculate(data: RatingT[], minSims = 0.2, minOverlap = 4) {
        if (data.length == 0) return []
        const {uniqueUserIds, uniqueMovieIds, ratings} = preprocessData(data);
        const ratingsTensor = tf.tensor2d(ratings)
        const usersSims = otiaiSimsForUsers(ratingsTensor)
        const overlap = calculateOverlapMoviesM(ratingsTensor)

        return filterUsersSimilarity(usersSims, overlap, uniqueUserIds, minSims, minOverlap, SimilarityType.OTIAI)
    }

    calculateForChunk(ratingsTable: number[][], usersMean: number[], chunkUniqueUserIds: number[], minSims = 0.2, minOverlap = 4) {
        const ratingsTensor = tf.tensor2d(ratingsTable)
        const usersSims = otiaiSimsForUsersForChunk(ratingsTensor, tf.tensor1d(usersMean))
        const overlap = calculateOverlapMoviesM(ratingsTensor)

        return filterUsersSimilarity(usersSims, overlap, chunkUniqueUserIds, minSims, minOverlap, SimilarityType.OTIAI)
    }

    async calculateByChunks(usersData: UserAvgRatingT[], uniqueUserIds: number[], getRatingsForChunk: (userIds: number[]) => Promise<RatingT[]>, simsCalculatedCallback: (sims: UserSimilarityT[]) => Promise<any>, chunkSize = 100, minSims = 0.2, minOverlap = 4) {
        const IOParams = {
            usersData, uniqueIds: uniqueUserIds, getRatingsForChunk, simsCalculatedCallback
        }
        const otherParams = {
            minSims, minOverlap, chunkSize
        }
        await this._calculateByChunks(preprocessDataForChunkByUserIds, this.calculateForChunk, IOParams, otherParams)
    }

    async calculateByChunksWithWorkers(usersData: UserAvgRatingT[], uniqueUserIds: number[], getRatingsForChunk: (userIds: number[]) => Promise<RatingT[]>, simsCalculatedCallback: (sims: UserSimilarityT[]) => Promise<any>, chunkSize = 100, maxThreads = 8, minSims = 0.2, minOverlap = 4) {
        const IOParams = {
            usersData, uniqueIds: uniqueUserIds, getRatingsForChunk, simsCalculatedCallback
        }
        const otherParams = {
            minSims, minOverlap, chunkSize,maxThreads
        }
        await this._calculateByChunksWithWorkers(this.#workerFilename, IOParams,otherParams)
    }

    async calculateByChunksWithWorkersAsyncConveyor(usersData: UserAvgRatingT[], uniqueUserIds: number[], getRatingsForChunk: (userIds: number[]) => Promise<RatingT[]>, simsCalculatedCallback: (sims: UserSimilarityT[]) => Promise<any>, chunkSize = 100, maxThreads = 11, minSims = 0.2, minOverlap = 4) {
        const IOParams = {
            usersData, uniqueIds: uniqueUserIds, getRatingsForChunk, simsCalculatedCallback
        }
        const otherParams = {
            minSims, minOverlap, chunkSize,maxThreads
        }
        await this._calculateByChunksWithWorkersAsyncConveyor(this.#workerFilename, IOParams,otherParams)
    }
}