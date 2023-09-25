import {Prisma, PrismaClient, Rating, TestRating} from "@prisma/client";
const prisma = new PrismaClient();

export async function getRatingsWithPriority(userId:number){
    return prisma.$queryRaw<Rating[]>(Prisma.sql`SELECT * FROM "Rating" r WHERE type = 'EXPLICIT' OR (type = 'IMPLICIT' AND (SELECT COUNT(*) FROM "Rating" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0)`)
}
export async function getRatingsWithPriorityByUserId(userId:number){
    return prisma.$queryRaw<Rating[]>(Prisma.sql`SELECT * FROM "Rating" r WHERE (type = 'EXPLICIT' AND "authorId" = ${userId}) OR (type = 'IMPLICIT' AND "authorId" = ${userId} AND (SELECT COUNT(*) FROM "Rating" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0)`)
}