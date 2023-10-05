import {PrismaClient} from "@prisma/client";
import {RatingWithTypeT} from "../types/rating.types";

const prisma = new PrismaClient();

export async function getUsersAvgRatings(testDB = true) {
    let ratings = []
    if (testDB)
        ratings = await prisma.testRating.groupBy({by: 'authorId', _avg: {rating: true}, orderBy: {authorId: 'asc'}})
    else
        ratings = await prisma.rating.groupBy({by: 'authorId', _avg: {rating: true}, orderBy: {authorId: 'asc'}})

    return ratings.map((r) => ({authorId: r.authorId, _avg: r._avg.rating!}))
}

export async function getRatingsCount(testDB = true) {
    return testDB ? prisma.testRating.count() : prisma.rating.count();
}

export async function getAllRatings(testDB = true) {
    return testDB ? prisma.testRating.findMany() : prisma.rating.findMany();
}

export async function getUniqueMovieIdsFromRatings(testDB = true){
    let uniqueMovieIds = []
    if (testDB)
        uniqueMovieIds = await prisma.testRating.findMany({
            distinct: ['movieId'],
            orderBy: {movieId: 'asc',},
            select: {movieId: true},
        })
    else
        uniqueMovieIds = await prisma.rating.findMany({
            distinct: ['movieId'],
            orderBy: {movieId: 'asc',},
            select: {movieId: true},
        })
    return uniqueMovieIds.map(mid=>mid.movieId);
}

export async function getUniqueUserIdsFromRatings(testDB = true){
    let uniqueUserIds = []
    if (testDB)
        uniqueUserIds = await prisma.testRating.findMany({
            distinct: ['authorId'],
            orderBy: {authorId: 'asc',},
            select: {authorId: true},
        })
    else
        uniqueUserIds = await prisma.rating.findMany({
            distinct: ['authorId'],
            orderBy: {authorId: 'asc',},
            select: {authorId: true},
        })
    return uniqueUserIds.map(uid=>uid.authorId);
}

export async function getRatingsByMovieIds(movieIds:string[],testDB = true){
    return  testDB ? prisma.testRating.findMany({where: {movieId: {in: movieIds}}}) : prisma.rating.findMany({where: {movieId: {in: movieIds}}})
}

export async function getRatingsByUserIds(userIds:number[],testDB = true){
    return  testDB ? prisma.testRating.findMany({where: {authorId: {in: userIds}}}) : prisma.rating.findMany({where: {authorId: {in: userIds}}})
}

export async function saveRatings(ratingsData: RatingWithTypeT[], testDB = true) {
    testDB ? await prisma.testRating.createMany({data: ratingsData}) : await prisma.rating.createMany({data: ratingsData})
}

export async function deleteAllRatings(testDB = true) {
    testDB ? await prisma.testRating.deleteMany() : await prisma.rating.deleteMany()
}