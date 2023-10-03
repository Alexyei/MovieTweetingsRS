import {PrismaClient, SimilarityType} from "@prisma/client";
import {calculateSimilarityForUsersOtiai} from "../similarity/otiai/calculations_users";
import {UserSimilarityT} from "../types/similarity.types";
import {deleteUsersSimilarityByType, saveUsersSimilarity} from "../DAO/user_similarity";
import {getRatingsWithPriority} from "../DAO/priopity_ratings";
const prisma = new PrismaClient();
async function flushDB(){
    await deleteUsersSimilarityByType(SimilarityType.OTIAI,false)
}

async function getRatings(){
    return getRatingsWithPriority(false)
}

async function saveSimilarityForUsers(userSims: UserSimilarityT[]){
    await saveUsersSimilarity(userSims,false,false)
}

export async function buildSimilarityForUsersOtiai(minSims=0.2,minOverlap=4){
    await flushDB()
    const ratings = await getRatings()
    const similarities = calculateSimilarityForUsersOtiai(ratings,minSims,minOverlap)
    await saveSimilarityForUsers(similarities)
}