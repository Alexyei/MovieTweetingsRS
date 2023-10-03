import {Prisma, PrismaClient, Rating, TestRating} from "@prisma/client";
const prisma = new PrismaClient();

export async function getUsersAvgRatingsWithPriority(testDB = true){
    const tableName = testDB ? Prisma.raw("TestRating") : Prisma.raw("Rating")
    return prisma.$queryRaw<{authorId: number, _avg: number}[]>(Prisma.sql `SELECT r."authorId", AVG(r."rating") as _avg FROM "${tableName}" r WHERE r.type = 'EXPLICIT' OR (r.type = 'IMPLICIT' AND (SELECT COUNT(*) FROM "${tableName}" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0) GROUP BY r."authorId" ORDER BY r."authorId" ASC`)
}

export async function getRatingsWithPriority(testDB = true){
    const tableName = testDB ? Prisma.raw("TestRating") : Prisma.raw("Rating")
    return prisma.$queryRaw<TestRating[] | Rating[]>(Prisma.sql`SELECT * FROM "${tableName}" r WHERE type = 'EXPLICIT' OR (type = 'IMPLICIT' AND (SELECT COUNT(*) FROM "${tableName}" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0)`)
}
export async function getRatingsWithPriorityByUserId(userId:number,testDB=true){
    const tableName = testDB ? Prisma.raw("TestRating") : Prisma.raw("Rating")
    return prisma.$queryRaw<TestRating[] | Rating[]>(Prisma.sql`SELECT * FROM "${tableName}" r WHERE (type = 'EXPLICIT' AND "authorId" = ${userId}) OR (type = 'IMPLICIT' AND "authorId" = ${userId} AND (SELECT COUNT(*) FROM "${tableName}" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0)`)
}

export async function getRatingsWithPriorityByUserIds(userIds:number[],testDB=true){
    if (userIds.length == 0) return []
    const tableName = testDB ? Prisma.raw("TestRating") : Prisma.raw("Rating")
    return prisma.$queryRaw<TestRating[] | Rating[]>(Prisma.sql`SELECT * FROM "${tableName}" r WHERE (type = 'EXPLICIT' AND "authorId" IN (${Prisma.join(userIds)})) OR (type = 'IMPLICIT' AND "authorId" IN (${Prisma.join(userIds)}) AND (SELECT COUNT(*) FROM "${tableName}" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0)`);
}

export async function getRatingsWithPriorityByMovieIds(movieIds:string[],testDB=true){
    if (movieIds.length == 0) return []
    const tableName = testDB ? Prisma.raw("TestRating") : Prisma.raw("Rating")
    return prisma.$queryRaw<TestRating[] | Rating[]>(Prisma.sql`SELECT * FROM "${tableName}" r WHERE (type = 'EXPLICIT' AND "movieId" IN (${Prisma.join(movieIds)})) OR (type = 'IMPLICIT' AND "movieId" IN (${Prisma.join(movieIds)}) AND (SELECT COUNT(*) FROM "${tableName}" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0)`);
}