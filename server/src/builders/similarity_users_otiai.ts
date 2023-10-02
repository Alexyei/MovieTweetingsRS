import {PrismaClient, SimilarityType} from "@prisma/client";
import {calculateSimilarityForUsersOtiai} from "../similarity/otiai/calculations_users";
import {UserSimilarityType} from "../types/similarity.types";
const prisma = new PrismaClient();
async function flushDB(){
    prisma.usersSimilarity.deleteMany({where:{type:SimilarityType.OTIAI}})
}

async function getRatings(){
    return prisma.rating.findMany()
}

async function saveSimilarityForUsers(userSims: UserSimilarityType[]){
    await prisma.usersSimilarity.createMany({
        data: userSims
    })
}

export async function buildSimilarityForUsersOtiai(minSims=0.2,minOverlap=4){
    await flushDB()
    const ratings = await getRatings()
    const similarities = calculateSimilarityForUsersOtiai(ratings,minSims,minOverlap)
    await saveSimilarityForUsers(similarities)
}