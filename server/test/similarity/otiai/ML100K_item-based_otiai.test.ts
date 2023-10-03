import {beforeAll, expect, test, describe} from "vitest";
import {readML100K} from "../../../src/utils/csv";
import {
    calculateSimilarityForMoviesOtiai,
    calculateSimilarityForMoviesOtiaiByChunks,
    calculateSimilarityForMoviesOtiaiByChunksWithWorkers,
    calculateSimilarityForMoviesOtiaiByChunksWithWorkersAsyncConveyor
} from "../../../src/similarity/otiai/calculations_movies";
import {
    getAllRatings, getRatingsByMovieIds,
    getRatingsCount,
    getUniqueMovieIdsFromRatings,
    getUsersAvgRatings,
    saveRatings
} from "../../../src/DAO/ratings";
import {
    deleteAllMoviesSimilarity,
    getAllMoviesSimilarity,
    getMoviesSimilarityCount,
    saveMoviesSimilarity
} from "../../../src/DAO/movie_similarity";
import {saveUsers} from "../../../src/DAO/user";
import {saveMovies} from "../../../src/DAO/movie";
import {flushTestDB} from "../../../src/utils/test";
import {MovieSimilarityT} from "../../../src/types/similarity.types";


async function saveChunkSims(chunkSims: MovieSimilarityT[]) {
    await saveMoviesSimilarity(chunkSims, true)
}

async function getRatingsForChunk(movieIds: string[]) {
    return getRatingsByMovieIds(movieIds)
}

describe('item-based otiai', () => {
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
        expect(await getRatingsCount(true)).toBeGreaterThan(0)
    })

    test('create item similarity', async () => {
        const ratings = await getAllRatings(true)
        const moviesSims = calculateSimilarityForMoviesOtiai(ratings, 0.2, 4)
        await saveMoviesSimilarity(moviesSims)
        expect(await getMoviesSimilarityCount(true)).toBeGreaterThan(0)
    })

    test('test item similarity', async () => {
        const moviesSims = await getAllMoviesSimilarity(true)
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
        await deleteAllMoviesSimilarity()
        const usersData = await getUsersAvgRatings()
        const uniqueMovieIds = await getUniqueMovieIdsFromRatings()
        await calculateSimilarityForMoviesOtiaiByChunks(usersData, uniqueMovieIds, getRatingsForChunk, saveChunkSims, 5000, 0.2, 4)
    })

    test('test item similarity by chunks', async () => {
        const moviesSims = await getAllMoviesSimilarity()
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
        await deleteAllMoviesSimilarity()
        const usersData = await getUsersAvgRatings()
        const uniqueMovieIds = await getUniqueMovieIdsFromRatings()
        await calculateSimilarityForMoviesOtiaiByChunksWithWorkers(usersData, uniqueMovieIds, getRatingsForChunk, saveChunkSims, 2000, 11, 0.2, 4)
    })

    test('test item similarity by chunks with workers', async () => {
        const moviesSims = await getAllMoviesSimilarity()
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
        await deleteAllMoviesSimilarity()
        const usersData = await getUsersAvgRatings()
        const uniqueMovieIds = await getUniqueMovieIdsFromRatings()
        await calculateSimilarityForMoviesOtiaiByChunksWithWorkersAsyncConveyor(usersData, uniqueMovieIds, getRatingsForChunk, saveChunkSims, 2000, 11, 0.2, 4)
    })

    test('test item similarity by chunks with workers', async () => {
        const moviesSims = await getAllMoviesSimilarity()
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