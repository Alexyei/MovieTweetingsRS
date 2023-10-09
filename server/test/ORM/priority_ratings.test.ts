import {RatingType} from "@prisma/client";
import {flushTestDB} from "../../src/utils/test";
import {getDAO} from "../../src/DAO/DAO";

const dao = getDAO(true)



describe('priority ratings', () => {
    beforeAll(
        async () => {
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

            await dao.user.saveMany(usersData)
            await dao.movie.saveMany(moviesData)
            await dao.rating.saveMany(ratingsData)

        })
    test("test №1 (watch .md)", async () => {
        const ratings = await dao.priorityRating.all()
        expect(ratings.length).toBe(4)
        expect(ratings.map(r => r.id)).toEqual([1, 3, 4, 5])
    })

    test("test with priority by userIds", async () => {
        const ratings = await dao.priorityRating.all()
        expect(ratings.length).toBe(4)
        expect(ratings.map(r => r.id)).toEqual([1, 3, 4, 5])
    })

    test("pair userId and movieId is unique", async () => {
        function checkUniquePairs(objects: { authorId: number, movieId: string }[]) {
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

        const ratings = await dao.priorityRating.all()

        expect(checkUniquePairs(ratings)).toBe(true)
    })

    test("test avg with priority", async () => {
        const ratings = await dao.priorityRating.getAvgRatings()
        expect(ratings.length).toBe(2)
        expect(ratings[0]._avg).toBeCloseTo((7 + 5 + 5) / 3, 2)
        expect(ratings[1]._avg).toBeCloseTo((5) / 1, 2)
    })

    test("test with priority by userId", async () => {
        const ratings = await dao.priorityRating.getByUserId(101)
        expect(ratings.length).toBe(3)
        expect(ratings.map(r => r.id)).toEqual([1, 3, 4])
    })

    test("test with priority by userId empty", async () => {
        const ratings = await dao.priorityRating.getByUserId(107)
        expect(ratings.length).toBe(0)

    })

    test("test with priority by userIds", async () => {
        const ratings = await dao.priorityRating.getByUserIds([101, 102])
        expect(ratings.length).toBe(4)
        expect(ratings.map(r => r.id)).toEqual([1, 3, 4, 5])
    })

    test("test with priority by userIds one", async () => {
        const ratings = await dao.priorityRating.getByUserIds([101])
        expect(ratings.length).toBe(3)
        expect(ratings.map(r => r.id)).toEqual([1, 3, 4])
    })
    test("test with priority by userIds empty", async () => {
        let ratings = await dao.priorityRating.getByUserIds([])
        expect(ratings.length).toBe(0)
        ratings = await dao.priorityRating.getByUserIds([107])
        expect(ratings.length).toBe(0)
    })


    test("test with priority by movieIds", async () => {
        const ratings = await dao.priorityRating.getByMovieIds(["1001", "1002", "1003", "1004"])
        expect(ratings.length).toBe(4)
        expect(ratings.map(r => r.id)).toEqual([1, 3, 4, 5])
    })

    test("test with priority by movieIds one", async () => {
        let ratings = await dao.priorityRating.getByMovieIds(["1004"])
        expect(ratings.length).toBe(2)
        expect(ratings.map(r => r.rating)).toEqual([5, 5])
        ratings = await dao.priorityRating.getByMovieIds(["1002"])
        expect(ratings.length).toBe(1)
        expect(ratings[0].rating).toEqual(7)
    })
    test("test with priority by userIds empty", async () => {
        let ratings = await dao.priorityRating.getByMovieIds([])
        expect(ratings.length).toBe(0)
        ratings = await dao.priorityRating.getByMovieIds(["1000"])
        expect(ratings.length).toBe(0)
    })

    test('unique movieIds', async()=>{
        let movieIds = await dao.priorityRating.getUniqueMovieIds()
        console.log(movieIds)
        expect(movieIds.length).toBe(3)
    })

    test('unique userIds', async()=>{
        let userIds = await dao.priorityRating.getUniqueUserIds()
        console.log(userIds)
        expect(userIds.length).toBe(2)
    })
})
