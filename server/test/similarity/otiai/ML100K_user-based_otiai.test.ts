import {beforeAll, expect, test, describe} from "vitest";
import {flushTestDB} from "../../../src/utils/test";
import {readML100K} from "../../../src/utils/csv";
import {saveUsers} from "../../../src/DAO/user";
import {saveMovies} from "../../../src/DAO/movie";
import {
    getAllRatings,
    getRatingsByUserIds,
    getRatingsCount, getUniqueUserIdsFromRatings, getUsersAvgRatings,
    saveRatings
} from "../../../src/DAO/ratings";
import {
    calculateSimilarityForUsersOtiai,
    calculateSimilarityForUsersOtiaiByChunks,
    calculateSimilarityForUsersOtiaiByChunksWithWorkers,
    calculateSimilarityForUsersOtiaiByChunksWithWorkersAsyncConveyor
} from "../../../src/similarity/otiai/calculations_users";
import {
    deleteAllUsersSimilarity,
    getAllUsersSimilarity,
    getUsersSimilarityCount,
    saveUsersSimilarity
} from "../../../src/DAO/user_similarity";
import { UserSimilarityT} from "../../../src/types/similarity.types";


async function saveChunkSims(chunkSims: UserSimilarityT[]) {
    await saveUsersSimilarity(chunkSims, true)
}

async function getRatingsForChunk(userIds: number[]) {
    return getRatingsByUserIds(userIds)
}
describe('user-based otiai', () => {
    beforeAll(async () => {
        await flushTestDB()

        const ratingsData = await readML100K('./test/mocks/ML100K_ratings.csv')
        const usersData = Array.from(new Set(ratingsData.map(r => r.authorId))).map(el => ({id: el}))
        const moviesData = Array.from(new Set(ratingsData.map(r => r.movieId))).map(id => ({
            id,
            title: id + "title",
            year: 2010
        }))

        await saveUsers(usersData, true);
        await saveMovies(moviesData, true)
        await saveRatings(ratingsData, true)

        return async () => {

        }
    })

    test('ratings created', async () => {
        expect(await getRatingsCount()).toBeGreaterThan(0)
    })

    test('create user similarity', async () => {
        const ratings = await getAllRatings()
        const usersSims = calculateSimilarityForUsersOtiai(ratings, 0.2, 4)
        await saveUsersSimilarity(usersSims)
        expect(await getUsersSimilarityCount()).toBeGreaterThan(0)
    })

    test('test user similarity', async () => {
        const usersSims = await getAllUsersSimilarity()
        expect(usersSims.length).toBe(1384)
        expect(usersSims.find(s => s.source == 5 && s.target == 35)!.similarity).toBeCloseTo(0.3, 2)
        expect(usersSims.find(s => s.source == 35 && s.target == 5)!.similarity).toBeCloseTo(0.3, 2)
        expect(usersSims.find(s => s.source == 584 && s.target == 126)!.similarity).toBeCloseTo(0.4758, 2)
        expect(usersSims.find(s => s.source == 126 && s.target == 584)!.similarity).toBeCloseTo(0.4758, 2)
        expect(usersSims.find(s => s.source == 394 && s.target == 81)!.similarity).toBeCloseTo(0.2, 2)
        expect(usersSims.find(s => s.source == 81 && s.target == 394)!.similarity).toBeCloseTo(0.2, 2)
    })

    test('create user similarity by chunks', async () => {
        await deleteAllUsersSimilarity()
        const usersData = await getUsersAvgRatings()
        const uniqueUserIds = await getUniqueUserIdsFromRatings()
        await calculateSimilarityForUsersOtiaiByChunks(usersData, uniqueUserIds, getRatingsForChunk, saveChunkSims, 210, 0.2, 4)
    })

    test('test user similarity by chunks', async () => {
        const usersSims = await getAllUsersSimilarity()
        expect(usersSims.length).toBe(1384)
        expect(usersSims.find(s => s.source == 5 && s.target == 35)!.similarity).toBeCloseTo(0.3, 2)
        expect(usersSims.find(s => s.source == 35 && s.target == 5)!.similarity).toBeCloseTo(0.3, 2)
        expect(usersSims.find(s => s.source == 584 && s.target == 126)!.similarity).toBeCloseTo(0.4758, 2)
        expect(usersSims.find(s => s.source == 126 && s.target == 584)!.similarity).toBeCloseTo(0.4758, 2)
        expect(usersSims.find(s => s.source == 394 && s.target == 81)!.similarity).toBeCloseTo(0.2, 2)
        expect(usersSims.find(s => s.source == 81 && s.target == 394)!.similarity).toBeCloseTo(0.2, 2)
    })

    test('create user similarity by chunks with workers', async () => {
        await deleteAllUsersSimilarity()
        const usersData = await getUsersAvgRatings()
        const uniqueUserIds = await getUniqueUserIdsFromRatings()
        await calculateSimilarityForUsersOtiaiByChunksWithWorkers(usersData, uniqueUserIds, getRatingsForChunk, saveChunkSims, 100, 11, 0.2, 4)
    })

    test('test user similarity by chunks with workers', async () => {
        const usersSims = await getAllUsersSimilarity()
        expect(usersSims.length).toBe(1384)
        expect(usersSims.find(s => s.source == 5 && s.target == 35)!.similarity).toBeCloseTo(0.3, 2)
        expect(usersSims.find(s => s.source == 35 && s.target == 5)!.similarity).toBeCloseTo(0.3, 2)
        expect(usersSims.find(s => s.source == 584 && s.target == 126)!.similarity).toBeCloseTo(0.4758, 2)
        expect(usersSims.find(s => s.source == 126 && s.target == 584)!.similarity).toBeCloseTo(0.4758, 2)
        expect(usersSims.find(s => s.source == 394 && s.target == 81)!.similarity).toBeCloseTo(0.2, 2)
        expect(usersSims.find(s => s.source == 81 && s.target == 394)!.similarity).toBeCloseTo(0.2, 2)
    })

    test('create user similarity by chunks with workers async conveyor', async () => {
        await deleteAllUsersSimilarity()
        const usersData = await getUsersAvgRatings()
        const uniqueUserIds = await getUniqueUserIdsFromRatings()
        await calculateSimilarityForUsersOtiaiByChunksWithWorkersAsyncConveyor(usersData, uniqueUserIds, getRatingsForChunk, saveChunkSims, 100, 11, 0.2, 4)
    })

    test('test user similarity by chunks with workers', async () => {
        const usersSims = await getAllUsersSimilarity()
        expect(usersSims.length).toBe(1384)
        expect(usersSims.find(s => s.source == 5 && s.target == 35)!.similarity).toBeCloseTo(0.3, 2)
        expect(usersSims.find(s => s.source == 35 && s.target == 5)!.similarity).toBeCloseTo(0.3, 2)
        expect(usersSims.find(s => s.source == 584 && s.target == 126)!.similarity).toBeCloseTo(0.4758, 2)
        expect(usersSims.find(s => s.source == 126 && s.target == 584)!.similarity).toBeCloseTo(0.4758, 2)
        expect(usersSims.find(s => s.source == 394 && s.target == 81)!.similarity).toBeCloseTo(0.2, 2)
        expect(usersSims.find(s => s.source == 81 && s.target == 394)!.similarity).toBeCloseTo(0.2, 2)
    })
})