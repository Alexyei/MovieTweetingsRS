import {beforeAll, expect, test} from "vitest";
import {Prisma, PrismaClient, RatingType} from "@prisma/client";
import fs from "fs";

import csv from "csv-parser";
import {
    calculateMoviesOtiaiSimilarity,
    createMoviesOtiaiSimilarity
} from "../../src/builders/calculate_movies_otiai_similarity";

const prisma = new PrismaClient();

export async function createUsers(usersData: { id: number, name?: string }[]) {
    let users = await prisma.testUser.createMany({
        data: usersData
    })
}

export async function createMovies(moviesData: { id: string, title: string, year: number }[]) {
    let movies = await prisma.testMovie.createMany({
        data: moviesData
    })
}

export async function createMovieSims(movieSimsData: {source: string, target: string, similarity: number, type: "OTIAI"}[]) {
    let movies = await prisma.testMoviesSimilarity.createMany({
        data: movieSimsData
    })
}

export async function createRatings(ratingsData: {
    id?: number,
    authorId: number,
    movieId: string,
    rating: number,
    type: RatingType
}[]) {
    let ratings = await prisma.testRating.createMany(
        {
            data: ratingsData
        })
}

async function readCSV(filename: string) {
    return new Promise((resolve, reject) => {
        const ratingsData: { authorId: number, movieId: string, rating: number, type: RatingType }[] = [];

        fs.createReadStream('./test/mocks/ML100K_ratings.csv')
            .pipe(csv())
            .on('data', (row) => {
                const {userId, movieId, rating} = row;
                ratingsData.push({
                    authorId: parseInt(userId),
                    movieId,
                    rating: parseFloat(rating),
                    type: RatingType.EXPLICIT
                });
            })
            .on('end', async () => {

                resolve(ratingsData);

            }).on("error", (error) => {
            reject(error);
        });
    });
}

beforeAll(async () => {
    await prisma.testRating.deleteMany()
    await prisma.testMoviesSimilarity.deleteMany()
    await prisma.testMovie.deleteMany()
    await prisma.testUser.deleteMany()
    const ratingsData = await readCSV('../mocks/ML100K_ratings.csv') as {
        authorId: number,
        movieId: string,
        rating: number,
        type: RatingType
    }[];
    const usersData = Array.from(new Set(ratingsData.map(r => r.authorId))).map(el => ({id: el}))
    const moviesData = Array.from(new Set(ratingsData.map(r => r.movieId))).map(id => ({id, title: id + "title", year: 2010}))
    await prisma.testRating.deleteMany()
    await prisma.testUser.deleteMany()
    await prisma.testMovie.deleteMany()
    await createUsers(usersData);
    await createMovies(moviesData)
    await createRatings(ratingsData)

    return async () => {
        // await prisma.testRating.deleteMany()
        // await prisma.testMoviesSimilarity.deleteMany()
        // await prisma.testMovie.deleteMany()
        // await prisma.testUser.deleteMany()
    }
})

test('ratings created', async () => {
    expect(await prisma.testRating.count()).toBeGreaterThan(0)
})

test('create item similarity', async () => {
    console.time('load rating')
    const ratings = await prisma.testRating.findMany()
    console.timeEnd('load rating')
    console.time('calculate sims')
    const moviesSims = calculateMoviesOtiaiSimilarity(ratings,0.2,4)
    console.timeEnd('calculate sims')
    console.time('save sims')
    await createMovieSims(moviesSims)
    console.timeEnd('save sims')
    console.time('query sims')
    expect(await prisma.testMoviesSimilarity.count()).toBeGreaterThan(0)
    console.timeEnd('query sims')
})

test('test item similarity', async () => {
    const moviesSims = await prisma.testMoviesSimilarity.findMany()
    expect(moviesSims.length).toBe(101406)
    expect(moviesSims.find(s=>s.source =="1" && s.target =="588")!.similarity).toBeCloseTo(0.327,2)
    expect(moviesSims.find(s=>s.source =="588" && s.target =="1")!.similarity).toBeCloseTo(0.327,2)
    expect(moviesSims.find(s=>s.source =="96861" && s.target =="120635")!.similarity).toBeCloseTo(0.912,2)
    expect(moviesSims.find(s=>s.source =="120635" && s.target =="96861")!.similarity).toBeCloseTo(0.912,2)
    expect(moviesSims.find(s=>s.source =="1499" && s.target =="2148")!.similarity).toBeCloseTo(0.2,2)
    expect(moviesSims.find(s=>s.source =="2148" && s.target =="1499")!.similarity).toBeCloseTo(0.2,2)
})