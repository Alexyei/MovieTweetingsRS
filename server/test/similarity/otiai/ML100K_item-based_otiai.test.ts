import {
    calculateSimilarityForMoviesOtiai,
    calculateSimilarityForMoviesOtiaiByChunks,
    calculateSimilarityForMoviesOtiaiByChunksWithWorkers,
    calculateSimilarityForMoviesOtiaiByChunksWithWorkersAsyncConveyor
} from "../../../src/similarity/otiai/calculations_movies";
import {flushTestDB, loadML100KDataSet} from "../../../src/utils/test";
import {MovieSimilarityT} from "../../../src/types/similarity.types";
import {getDAO} from "../../../src/DAO/DAO";

const dao = getDAO(true)
async function saveChunkSims(chunkSims: MovieSimilarityT[]) {
    await dao.movieSimilarity.saveMany(chunkSims,true)
}

async function getRatingsForChunk(movieIds: string[]) {
    return dao.rating.getByMovieIds(movieIds)
}

describe('item-based otiai', () => {
    beforeAll(async () => {
        await flushTestDB()
        await loadML100KDataSet()
    })

    test('ratings created', async () => {
        expect(await dao.rating.count()).toBeGreaterThan(0)
    })

    test('create item similarity', async () => {
        const ratings = await dao.rating.all()
        const moviesSims = calculateSimilarityForMoviesOtiai(ratings, 0.2, 4)
        await dao.movieSimilarity.saveMany(moviesSims)
        expect(await dao.rating.count()).toBeGreaterThan(0)
    })

    test('test item similarity', async () => {
        const moviesSims = await dao.movieSimilarity.all()
        expect(moviesSims.length).toBe(101420)
        expect(moviesSims.find(s => s.source == "1" && s.target == "588")!.similarity).toBeCloseTo(0.327, 2)
        expect(moviesSims.find(s => s.source == "588" && s.target == "1")!.similarity).toBeCloseTo(0.327, 2)
        expect(moviesSims.find(s => s.source == "96861" && s.target == "120635")!.similarity).toBeCloseTo(0.912, 2)
        expect(moviesSims.find(s => s.source == "120635" && s.target == "96861")!.similarity).toBeCloseTo(0.912, 2)
        expect(moviesSims.find(s => s.source == "1499" && s.target == "2148")!.similarity).toBeCloseTo(0.2, 2)
        expect(moviesSims.find(s => s.source == "2148" && s.target == "1499")!.similarity).toBeCloseTo(0.2, 2)
        expect(moviesSims.find(s => s.source == "3955" && s.target == "3624")!.similarity).toBeCloseTo(0.24359641650320665, 2)
        expect(moviesSims.find(s => s.source == "3624" && s.target == "3955")!.similarity).toBeCloseTo(0.24359641650320665, 2)
    })

    test('create item similarity by chunks', async () => {
        await dao.movieSimilarity.deleteAll()
        const usersData = await dao.rating.getAvgRatings()
        const uniqueMovieIds = await dao.rating.getUniqueMovieIds()
        await calculateSimilarityForMoviesOtiaiByChunks(usersData, uniqueMovieIds, getRatingsForChunk, saveChunkSims, 5000, 0.2, 4)
    })

    test('test item similarity by chunks', async () => {
        const moviesSims = await dao.movieSimilarity.all()
        expect(moviesSims.length).toBe(101420)
        expect(moviesSims.find(s => s.source == "1" && s.target == "588")!.similarity).toBeCloseTo(0.327, 2)
        expect(moviesSims.find(s => s.source == "588" && s.target == "1")!.similarity).toBeCloseTo(0.327, 2)
        expect(moviesSims.find(s => s.source == "96861" && s.target == "120635")!.similarity).toBeCloseTo(0.912, 2)
        expect(moviesSims.find(s => s.source == "120635" && s.target == "96861")!.similarity).toBeCloseTo(0.912, 2)
        expect(moviesSims.find(s => s.source == "1499" && s.target == "2148")!.similarity).toBeCloseTo(0.2, 2)
        expect(moviesSims.find(s => s.source == "2148" && s.target == "1499")!.similarity).toBeCloseTo(0.2, 2)
        expect(moviesSims.find(s => s.source == "3955" && s.target == "3624")!.similarity).toBeCloseTo(0.24359641650320665, 2)
        expect(moviesSims.find(s => s.source == "3624" && s.target == "3955")!.similarity).toBeCloseTo(0.24359641650320665, 2)
    })

    test('create item similarity by chunks with workers', async () => {
        await dao.movieSimilarity.deleteAll()
        const usersData = await dao.rating.getAvgRatings()
        const uniqueMovieIds = await dao.rating.getUniqueMovieIds()
        await calculateSimilarityForMoviesOtiaiByChunksWithWorkers(usersData, uniqueMovieIds, getRatingsForChunk, saveChunkSims, 2000, 11, 0.2, 4)
    })

    test('test item similarity by chunks with workers', async () => {
        const moviesSims = await dao.movieSimilarity.all()
        expect(moviesSims.length).toBe(101420)
        expect(moviesSims.find(s => s.source == "1" && s.target == "588")!.similarity).toBeCloseTo(0.327, 2)
        expect(moviesSims.find(s => s.source == "588" && s.target == "1")!.similarity).toBeCloseTo(0.327, 2)
        expect(moviesSims.find(s => s.source == "96861" && s.target == "120635")!.similarity).toBeCloseTo(0.912, 2)
        expect(moviesSims.find(s => s.source == "120635" && s.target == "96861")!.similarity).toBeCloseTo(0.912, 2)
        expect(moviesSims.find(s => s.source == "1499" && s.target == "2148")!.similarity).toBeCloseTo(0.2, 2)
        expect(moviesSims.find(s => s.source == "2148" && s.target == "1499")!.similarity).toBeCloseTo(0.2, 2)
        expect(moviesSims.find(s => s.source == "3955" && s.target == "3624")!.similarity).toBeCloseTo(0.24359641650320665, 2)
        expect(moviesSims.find(s => s.source == "3624" && s.target == "3955")!.similarity).toBeCloseTo(0.24359641650320665, 2)
    })

    test('create item similarity by chunks with workers async conveyor', async () => {
        await dao.movieSimilarity.deleteAll()
        const usersData = await dao.rating.getAvgRatings()
        const uniqueMovieIds = await dao.rating.getUniqueMovieIds()
        await calculateSimilarityForMoviesOtiaiByChunksWithWorkersAsyncConveyor(usersData, uniqueMovieIds, getRatingsForChunk, saveChunkSims, 2000, 11, 0.2, 4)
    })

    test('test item similarity by chunks with workers', async () => {
        const moviesSims = await dao.movieSimilarity.all()
        expect(moviesSims.length).toBe(101420)
        expect(moviesSims.find(s => s.source == "1" && s.target == "588")!.similarity).toBeCloseTo(0.327, 2)
        expect(moviesSims.find(s => s.source == "588" && s.target == "1")!.similarity).toBeCloseTo(0.327, 2)
        expect(moviesSims.find(s => s.source == "96861" && s.target == "120635")!.similarity).toBeCloseTo(0.912, 2)
        expect(moviesSims.find(s => s.source == "120635" && s.target == "96861")!.similarity).toBeCloseTo(0.912, 2)
        expect(moviesSims.find(s => s.source == "1499" && s.target == "2148")!.similarity).toBeCloseTo(0.2, 2)
        expect(moviesSims.find(s => s.source == "2148" && s.target == "1499")!.similarity).toBeCloseTo(0.2, 2)
        expect(moviesSims.find(s => s.source == "3955" && s.target == "3624")!.similarity).toBeCloseTo(0.24359641650320665, 2)
        expect(moviesSims.find(s => s.source == "3624" && s.target == "3955")!.similarity).toBeCloseTo(0.24359641650320665, 2)
    })
})