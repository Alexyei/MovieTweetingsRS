import {RatingType} from "../../types/rating.types";
import {preprocessData} from "../preprocess_data";
import tf from "@tensorflow/tfjs";
import {otiaiSimsForUsers} from "./distance";
import {calculateOverlapMoviesM} from "../overlap";
import {filterUsersSimilarity} from "../filter_similarities";
import {SimilarityType} from "@prisma/client";

export function calculateSimilarityForUsersOtiai(data:RatingType[],minSims=0.2,minOverlap=4){
    if (data.length  == 0) return []
    const { uniqueUserIds, uniqueMovieIds, ratings } = preprocessData(data);
    const ratingsTensor = tf.tensor2d(ratings)
    const usersSims = otiaiSimsForUsers(ratingsTensor)
    const overlap = calculateOverlapMoviesM(ratingsTensor)

    return filterUsersSimilarity(usersSims, overlap,uniqueUserIds,minSims,minOverlap, SimilarityType.OTIAI)
}