import {beforeAll, expect, test} from "vitest";
import {Prisma, PrismaClient, Rating, RatingType, TestRating} from "@prisma/client";

const prisma = new PrismaClient();

export async function createUsers(usersData: {id:number,name?:string}[]) {
    let users = await prisma.testUser.createMany({
        data: usersData
    })
}

export async function createMovies(moviesData: {id: string, title: string, year: number}[]) {
    let movies = await prisma.testMovie.createMany({
        data: moviesData
    })
}

export async function createRatings(ratingsData:{id?: number, authorId: number, movieId: string, rating: number, type: RatingType }[]) {
    let ratings = await prisma.testRating.createMany(
        {
            data: ratingsData
        })
}

beforeAll(async () => {
    const usersData = [
        {id: 101},
        {id: 102},
    ]
    const moviesData = [
        {id: "1001", title: "first", year: 2010},
        {id: "1002", title: "second", year: 2011},
        {id: "1003", title: "third", year: 2012},
        {id: "1004", title: "fourth", year: 2013},
    ]
    const ratingsData = [
        {
            id: 1,
            authorId: 101,
            movieId: "1001",
            rating: 5,
            type: RatingType.EXPLICIT
        },
        {
            id: 2,
            authorId: 101,
            movieId: "1001",
            rating: 6,
            type: RatingType.IMPLICIT
        },
        {
            id: 3,
            authorId: 101,
            movieId: "1002",
            rating: 7,
            type: RatingType.IMPLICIT
        },
        {
            id: 4,
            authorId: 101,
            movieId: "1004",
            rating: 5,
            type: RatingType.EXPLICIT
        },
        {
            id: 5,
            authorId: 102,
            movieId: "1004",
            rating: 5,
            type: RatingType.EXPLICIT
        },
        {
            id: 6,
            authorId: 102,
            movieId: "1004",
            rating: 6,
            type: RatingType.IMPLICIT
        },
    ]

    await prisma.testRating.deleteMany()
    await prisma.testUser.deleteMany()
    await prisma.testMovie.deleteMany()
    await createUsers(usersData);
    await createMovies(moviesData)
    await createRatings(ratingsData)

    return async () => {
        await prisma.testRating.deleteMany()
        await prisma.testUser.deleteMany()
        await prisma.testMovie.deleteMany()
    }

})
test("test №1 (watch .md)", async () => {
    const ratings = await prisma.$queryRaw<TestRating[]>(Prisma.sql`SELECT * FROM "TestRating" r WHERE type = 'EXPLICIT' OR (type = 'IMPLICIT' AND (SELECT COUNT(*) FROM "TestRating" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0)`)
    expect(ratings.length).toBe(4)
    expect(ratings.map(r=>r.id)).toEqual([1,3,4,5])
})

test("pair userId and movieId is unique",async ()=>{
    function checkUniquePairs(objects:{authorId:number,movieId:string}[]) {
        const uniquePairs = new Set();

        for (const obj of objects) {
            const pair = obj.authorId + ':' + obj.movieId;

            if (uniquePairs.has(pair)) {
                return false; // Найдена дублирующаяся пара
            }

            uniquePairs.add(pair);
        }

        return true; // Все пары уникальны
    }
    const ratings = await prisma.$queryRaw<Rating[]>(Prisma.sql`SELECT * FROM "Rating" r WHERE type = 'EXPLICIT' OR (type = 'IMPLICIT' AND (SELECT COUNT(*) FROM "Rating" WHERE "authorId" = r."authorId" AND "movieId" = r."movieId" AND type = 'EXPLICIT') = 0)`)

    expect(checkUniquePairs(ratings)).toBe(true)
})