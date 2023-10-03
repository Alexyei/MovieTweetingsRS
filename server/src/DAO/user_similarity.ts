import {PrismaClient, SimilarityType} from "@prisma/client";
import {MovieSimilarityT, UserSimilarityT} from "../types/similarity.types";

const prisma = new PrismaClient();

export async function getUsersSimilarityCount(testDB = true){
    return testDB ? prisma.testUsersSimilarity.count() : prisma.usersSimilarity.count();
}

export async function getAllUsersSimilarity(testDB = true){
    return testDB ? prisma.testUsersSimilarity.findMany() : prisma.usersSimilarity.findMany();
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