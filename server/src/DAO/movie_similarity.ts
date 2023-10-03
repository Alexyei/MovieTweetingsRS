import {PrismaClient, SimilarityType} from "@prisma/client";
import {MovieSimilarityT} from "../types/similarity.types";

const prisma = new PrismaClient();
export async function getMoviesSimilarityCount(testDB = true){
    return testDB ? prisma.testMoviesSimilarity.count() : prisma.moviesSimilarity.count();
}

export async function getAllMoviesSimilarity(testDB = true){
    return testDB ? prisma.testMoviesSimilarity.findMany() : prisma.moviesSimilarity.findMany();
}

export async function saveMoviesSimilarity(movieSimsData: MovieSimilarityT[], skipDuplicates=false, testDB = true) {
    testDB ? await prisma.testMoviesSimilarity.createMany({data: movieSimsData,skipDuplicates}) : await prisma.moviesSimilarity.createMany({data: movieSimsData,skipDuplicates})
}

export async function deleteAllMoviesSimilarity(testDB = true){
    testDB ? await prisma.testMoviesSimilarity.deleteMany() : await prisma.moviesSimilarity.deleteMany()
}

export async function deleteMoviesSimilarityByType(typeSimilarity:SimilarityType,testDB = true){
    testDB ? await prisma.testMoviesSimilarity.deleteMany({where:{type:SimilarityType.OTIAI}}) : await prisma.moviesSimilarity.deleteMany({where:{type:SimilarityType.OTIAI}})
}

