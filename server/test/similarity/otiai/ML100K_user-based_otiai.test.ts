import {flushTestDB, loadML100KDataSet} from "../../../src/utils/test";
import {
    calculateSimilarityForUsersOtiai,
    calculateSimilarityForUsersOtiaiByChunks,
    calculateSimilarityForUsersOtiaiByChunksWithWorkers,
    calculateSimilarityForUsersOtiaiByChunksWithWorkersAsyncConveyor
} from "../../../src/similarity/otiai/calculations_users";
import { UserSimilarityT} from "../../../src/types/similarity.types";
import {getDAO} from "../../../src/DAO/DAO";

const dao = getDAO(true)

async function saveChunkSims(chunkSims: UserSimilarityT[]) {
    await dao.userSimilarity.saveMany(chunkSims, true)
}

async function getRatingsForChunk(userIds: number[]) {
    return dao.rating.getByUserIds(userIds)
}
describe('user-based otiai', () => {
    beforeAll(async () => {
        await flushTestDB()
        await loadML100KDataSet()
    })

    test('ratings created', async () => {
        expect(await dao.rating.count()).toBeGreaterThan(0)
    })

    test('create user similarity', async () => {
        const ratings = await dao.rating.all()
        const usersSims = calculateSimilarityForUsersOtiai(ratings, 0.2, 4)
        await dao.userSimilarity.saveMany(usersSims)
        expect(await dao.userSimilarity.count()).toBeGreaterThan(0)
    })

    test('test user similarity', async () => {
        const usersSims = await dao.userSimilarity.all()
        expect(usersSims.length).toBe(1384)
        expect(usersSims.find(s => s.source == 5 && s.target == 35)!.similarity).toBeCloseTo(0.3, 2)
        expect(usersSims.find(s => s.source == 35 && s.target == 5)!.similarity).toBeCloseTo(0.3, 2)
        expect(usersSims.find(s => s.source == 584 && s.target == 126)!.similarity).toBeCloseTo(0.4758, 2)
        expect(usersSims.find(s => s.source == 126 && s.target == 584)!.similarity).toBeCloseTo(0.4758, 2)
        expect(usersSims.find(s => s.source == 394 && s.target == 81)!.similarity).toBeCloseTo(0.2, 2)
        expect(usersSims.find(s => s.source == 81 && s.target == 394)!.similarity).toBeCloseTo(0.2, 2)
    })

    test('create user similarity by chunks', async () => {
        await dao.userSimilarity.deleteAll()
        
        const usersData = await dao.rating.getAvgRatings() 
        
        const uniqueUserIds = await dao.rating.getUniqueUserIds()
        await calculateSimilarityForUsersOtiaiByChunks(usersData, uniqueUserIds, getRatingsForChunk, saveChunkSims, 210, 0.2, 4)
    })

    test('test user similarity by chunks', async () => {
        const usersSims = await dao.userSimilarity.all()
        expect(usersSims.length).toBe(1384)
        expect(usersSims.find(s => s.source == 5 && s.target == 35)!.similarity).toBeCloseTo(0.3, 2)
        expect(usersSims.find(s => s.source == 35 && s.target == 5)!.similarity).toBeCloseTo(0.3, 2)
        expect(usersSims.find(s => s.source == 584 && s.target == 126)!.similarity).toBeCloseTo(0.4758, 2)
        expect(usersSims.find(s => s.source == 126 && s.target == 584)!.similarity).toBeCloseTo(0.4758, 2)
        expect(usersSims.find(s => s.source == 394 && s.target == 81)!.similarity).toBeCloseTo(0.2, 2)
        expect(usersSims.find(s => s.source == 81 && s.target == 394)!.similarity).toBeCloseTo(0.2, 2)
    })

    test('create user similarity by chunks with workers', async () => {
        await dao.userSimilarity.deleteAll()
        const usersData = await dao.rating.getAvgRatings()
        const uniqueUserIds = await dao.rating.getUniqueUserIds()
        await calculateSimilarityForUsersOtiaiByChunksWithWorkers(usersData, uniqueUserIds, getRatingsForChunk, saveChunkSims, 100, 11, 0.2, 4)
    })

    test('test user similarity by chunks with workers', async () => {
        const usersSims = await dao.userSimilarity.all()
        expect(usersSims.length).toBe(1384)
        expect(usersSims.find(s => s.source == 5 && s.target == 35)!.similarity).toBeCloseTo(0.3, 2)
        expect(usersSims.find(s => s.source == 35 && s.target == 5)!.similarity).toBeCloseTo(0.3, 2)
        expect(usersSims.find(s => s.source == 584 && s.target == 126)!.similarity).toBeCloseTo(0.4758, 2)
        expect(usersSims.find(s => s.source == 126 && s.target == 584)!.similarity).toBeCloseTo(0.4758, 2)
        expect(usersSims.find(s => s.source == 394 && s.target == 81)!.similarity).toBeCloseTo(0.2, 2)
        expect(usersSims.find(s => s.source == 81 && s.target == 394)!.similarity).toBeCloseTo(0.2, 2)
    })

    test('create user similarity by chunks with workers async conveyor', async () => {
        await dao.userSimilarity.deleteAll()
        const usersData = await dao.rating.getAvgRatings()
        const uniqueUserIds = await dao.rating.getUniqueUserIds()
        await calculateSimilarityForUsersOtiaiByChunksWithWorkersAsyncConveyor(usersData, uniqueUserIds, getRatingsForChunk, saveChunkSims, 100, 11, 0.2, 4)
    })

    test('test user similarity by chunks with workers', async () => {
        const usersSims = await dao.userSimilarity.all()
        expect(usersSims.length).toBe(1384)
        expect(usersSims.find(s => s.source == 5 && s.target == 35)!.similarity).toBeCloseTo(0.3, 2)
        expect(usersSims.find(s => s.source == 35 && s.target == 5)!.similarity).toBeCloseTo(0.3, 2)
        expect(usersSims.find(s => s.source == 584 && s.target == 126)!.similarity).toBeCloseTo(0.4758, 2)
        expect(usersSims.find(s => s.source == 126 && s.target == 584)!.similarity).toBeCloseTo(0.4758, 2)
        expect(usersSims.find(s => s.source == 394 && s.target == 81)!.similarity).toBeCloseTo(0.2, 2)
        expect(usersSims.find(s => s.source == 81 && s.target == 394)!.similarity).toBeCloseTo(0.2, 2)
    })
})