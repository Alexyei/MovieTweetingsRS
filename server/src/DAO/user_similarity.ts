import {PrismaClient, SimilarityType} from "@prisma/client";
import {MovieSimilarityT, UserSimilarityT} from "../types/similarity.types";

const prisma = new PrismaClient();

export async function getUsersSimilarityCount(testDB = true){
    return testDB ? prisma.testUsersSimilarity.count() : prisma.usersSimilarity.count();
}

export async function getAllUsersSimilarity(testDB = true){
    return testDB ? prisma.testUsersSimilarity.findMany() : prisma.usersSimilarity.findMany();
}

export async function getCandidatesPairsFromUsersSimilarityByUserId(userId:number,type:SimilarityType,take=100,min_sims = 0.2,testDB = true){
    if (testDB){
        return prisma.testUsersSimilarity.findMany({
            where: {
                source: userId,
                target: {not: userId},
                similarity: {gte: min_sims},
                type: type
            },
            orderBy: {
                similarity: 'desc'
            },
            take: take
        });
    }
    return prisma.usersSimilarity.findMany({
        where: {
            source: userId,
            target: {not: userId},
            similarity: {gte: min_sims},
            type: type
        },
        orderBy: {
            similarity: 'desc'
        },
        take: take
    });
}




export async function saveUsersSimilarity(userSimsData: UserSimilarityT[],skipDuplicates=false, testDB = true) {
    testDB ? await prisma.testUsersSimilarity.createMany({data: userSimsData,skipDuplicates}) : await prisma.usersSimilarity.createMany({data: userSimsData,skipDuplicates})
}

export async function deleteAllUsersSimilarity(testDB = true){
    testDB ? await prisma.testUsersSimilarity.deleteMany() : await prisma.usersSimilarity.deleteMany()
}

export async function deleteUsersSimilarityByType(typeSimilarity:SimilarityType,testDB = true){
    testDB ? await prisma.testUsersSimilarity.deleteMany({where:{type:SimilarityType.OTIAI}}) : await prisma.usersSimilarity.deleteMany({where:{type:SimilarityType.OTIAI}})
}