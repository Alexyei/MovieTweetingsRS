import {beforeAll, expect, test} from "vitest";
import {RatingType} from "@prisma/client";
import {
    getRatingsWithPriority, getRatingsWithPriorityByMovieIds,
    getRatingsWithPriorityByUserId, getRatingsWithPriorityByUserIds,
    getUsersAvgRatingsWithPriority
} from "../../src/DAO/priopity_ratings";
import {saveRatings} from "../../src/DAO/ratings";
import {flushTestDB} from "../../src/utils/test";
import {saveMovies} from "../../src/DAO/movie";
import {saveUsers} from "../../src/DAO/user";


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

    await flushTestDB()

    await saveUsers(usersData,true);
    await saveMovies(moviesData,true)
    await saveRatings(ratingsData,true)

    return async () => {

    }

})
test("test №1 (watch .md)", async () => {
    const ratings = await getRatingsWithPriority(true)
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
    const ratings = await getRatingsWithPriority(true)

    expect(checkUniquePairs(ratings)).toBe(true)
})

test("test avg with priority", async () => {
    const ratings =     await getUsersAvgRatingsWithPriority(true)
    expect(ratings.length).toBe(2)
    expect(ratings[0]._avg).toBeCloseTo((7+5+5)/3,2)
    expect(ratings[1]._avg).toBeCloseTo((5)/1,2)
})

test("test with priority by userId", async () => {
    const ratings = await getRatingsWithPriorityByUserId(101,true)
    expect(ratings.length).toBe(3)
    expect(ratings.map(r=>r.id)).toEqual([1,3,4])
})

test("test with priority by userId empty", async () => {
    const ratings = await getRatingsWithPriorityByUserId(107,true)
    expect(ratings.length).toBe(0)

})

test("test with priority by userIds", async () => {
    const ratings = await getRatingsWithPriorityByUserIds([101,102],true)
    expect(ratings.length).toBe(4)
    expect(ratings.map(r=>r.id)).toEqual([1,3,4,5])
})

test("test with priority by userIds one", async () => {
    const ratings = await getRatingsWithPriorityByUserIds([101],true)
    expect(ratings.length).toBe(3)
    expect(ratings.map(r=>r.id)).toEqual([1,3,4])
})
test("test with priority by userIds empty", async () => {
    let ratings = await getRatingsWithPriorityByUserIds([],true)
    expect(ratings.length).toBe(0)
    ratings = await getRatingsWithPriorityByUserIds([107],true)
    expect(ratings.length).toBe(0)
})


test("test with priority by movieIds", async () => {
    const ratings = await getRatingsWithPriorityByMovieIds(["1001","1002","1003","1004"],true)
    expect(ratings.length).toBe(4)
    expect(ratings.map(r=>r.id)).toEqual([1,3,4,5])
})

test("test with priority by movieIds one", async () => {
    let ratings = await getRatingsWithPriorityByMovieIds(["1004"],true)
    expect(ratings.length).toBe(2)
    expect(ratings.map(r=>r.rating)).toEqual([5,5])
    ratings = await getRatingsWithPriorityByMovieIds(["1002"],true)
    expect(ratings.length).toBe(1)
    expect(ratings[0].rating).toEqual(7)
})
test("test with priority by userIds empty", async () => {
    let ratings = await getRatingsWithPriorityByMovieIds([],true)
    expect(ratings.length).toBe(0)
    ratings = await getRatingsWithPriorityByMovieIds(["1000"],true)
    expect(ratings.length).toBe(0)
})

test("test with priority by userIds", async () => {
    const ratings = await getRatingsWithPriority(true)
    expect(ratings.length).toBe(4)
    expect(ratings.map(r=>r.id)).toEqual([1,3,4,5])
})