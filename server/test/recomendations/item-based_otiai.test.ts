import {beforeAll, expect, test} from "vitest";
import {Prisma, PrismaClient, RatingType} from "@prisma/client";
import fs from "fs";

import csv from "csv-parser";

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
        await prisma.testRating.deleteMany()
        await prisma.testUser.deleteMany()
        await prisma.testMovie.deleteMany()
    }
})

test('ratings created', async () => {
    console.log(await prisma.testRating.count())
    expect(await prisma.testRating.count()).toBeGreaterThan(0)
})