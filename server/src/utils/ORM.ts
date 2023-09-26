import {Prisma, PrismaClient, Rating, TestRating} from "@prisma/client";
const prisma = new PrismaClient();

export async function getRatingsWithPriority(){
    return prisma.$queryRaw<Rating[]>(Prisma.sql`SELECT * FROM "Rating" r WHERE type = 'EXPLICIT' OR (type = 'IMPLICIT' AND (SELECT COUNT(*) FROM "Rating" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0)`)
}
export async function getRatingsWithPriorityByUserId(userId:number){
    return prisma.$queryRaw<Rating[]>(Prisma.sql`SELECT * FROM "Rating" r WHERE (type = 'EXPLICIT' AND "authorId" = ${userId}) OR (type = 'IMPLICIT' AND "authorId" = ${userId} AND (SELECT COUNT(*) FROM "Rating" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0)`)
}

export async function getRatingsWithPriorityByUserIds(userIds:number[]){
    return prisma.$queryRaw<Rating[]>(Prisma.sql`SELECT * FROM "Rating" r WHERE (type = 'EXPLICIT' AND "authorId" IN (${Prisma.join(userIds)})) OR (type = 'IMPLICIT' AND "authorId" IN (${Prisma.join(userIds)}) AND (SELECT COUNT(*) FROM "Rating" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0)`);
}