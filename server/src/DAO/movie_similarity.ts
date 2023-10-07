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
    testDB ? await prisma.testMoviesSimilarity.deleteMany({where:{type:typeSimilarity}}) : await prisma.moviesSimilarity.deleteMany({where:{type:typeSimilarity}})
}

export async function getCandidatesPairsFromMoviesSimilarityByTargetId(userMovieIds:string[], targetId:string,type:SimilarityType,take=100,min_sims = 0.2,testDB = true){
    if (testDB){
        return prisma.testMoviesSimilarity.findMany({
            where: {
                source: {in: userMovieIds},
                target: targetId,
                similarity: {gte: min_sims},
                type: type
            },
            orderBy: {
                similarity: 'desc'
            },
            take: take
        });
    }
    return prisma.moviesSimilarity.findMany({
        where: {
            source: {in: userMovieIds},
            target: targetId,
            similarity: {gte: min_sims},
            type: type
        },
        orderBy: {
            similarity: 'desc'
        },
        take: take
    });
}

export async function getAllCandidatesPairsFromMoviesSimilarity(userMovieIds:string[], type:SimilarityType,take=100,min_sims = 0.2,testDB = true){
    if (testDB){
        return prisma.testMoviesSimilarity.findMany({
            where: {
                source: {in: userMovieIds},
                target: {notIn: userMovieIds},
                similarity: {gt: min_sims},
                type: type
            },
            orderBy: {
                similarity: 'desc'
            },
            take: take
        });
    }
    return prisma.moviesSimilarity.findMany({
        where: {
            source: {in: userMovieIds},
            target: {notIn: userMovieIds},
            similarity: {gte: min_sims},
            type: type
        },
        orderBy: {
            similarity: 'desc'
        },
        take: take
    });
}
