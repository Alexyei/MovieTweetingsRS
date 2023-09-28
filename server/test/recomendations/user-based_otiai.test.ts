import {beforeAll, expect, test} from "vitest";
import {Prisma, PrismaClient, RatingType} from "@prisma/client";
import fs from "fs";
import { parse } from 'csv-parse';
const Papa = require('papaparse');
import csv from "csv-parser";
import {calculateUsersOtiaiSimilarity} from "../../src/builders/calculate_users_otiai_similarity";


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

export async function createUsersSims(usersSimsData: {source: number, target: number, similarity: number, type: "OTIAI"}[]) {
    let movies = await prisma.testUsersSimilarity.createMany({
        data: usersSimsData
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

        fs.createReadStream('./test/mocks/ML100K_ratings.csv','utf-8')
            .pipe(csv({ strict: true }))
            // .pipe(parse({ columns: true}))
            // .pipe(parse({ columns: true, raw:true, cast: (value, context) => {
            //         if (context.column === 'rating') {
            //             return parseFloat(value);
            //         }
            //         return value;
            //     }}))
            // .pipe(Papa.parse(Papa.NODE_STREAM_INPUT,{ header: true }))
            .on('data', (row:any) => {
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

            }).on("error", (error:any) => {
            reject(error);
        });
    });
}

beforeAll(async () => {

    // const b = await prisma.testMoviesSimilarity.findMany({where:{
    //     similarity: {gte: 0.24358, lt: 0.2436}
    //     }})
    await prisma.testRating.deleteMany()
    await prisma.testMoviesSimilarity.deleteMany()
    await prisma.testUsersSimilarity.deleteMany()
    await prisma.testMovie.deleteMany()
    await prisma.testUser.deleteMany()
    const ratingsData = await readCSV('../mocks/ML100K_ratings.csv') as {
        authorId: number,
        movieId: string,
        rating: number,
        type: RatingType
    }[];
    // const a =15
    // const a =ratingsData.filter(rating => rating.authorId == 15)
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
        // await prisma.testUsersSimilarity.deleteMany()
        // await prisma.testMovie.deleteMany()
        // await prisma.testUser.deleteMany()
    }
})

test('ratings created', async () => {
    expect(await prisma.testRating.count()).toBeGreaterThan(0)
})

test('create item similarity', async () => {
    console.time('load rating')
    // const ratings = await prisma.testRating.findMany({where: {authorId:15}})
    const ratings = await prisma.testRating.findMany()
    console.timeEnd('load rating')
    console.time('calculate sims')
    const usersSims = calculateUsersOtiaiSimilarity(ratings,0.2,4)
    console.timeEnd('calculate sims')
    console.time('save sims')
    await createUsersSims(usersSims)
    console.timeEnd('save sims')
    console.time('query sims')
    expect(await prisma.testUsersSimilarity.count()).toBeGreaterThan(0)
    console.timeEnd('query sims')
})

test('test item similarity', async () => {
    const usersSims = await prisma.testUsersSimilarity.findMany()
    expect(usersSims.length).toBe(1384)
    expect(usersSims.find(s=>s.source ==5 && s.target ==35)!.similarity).toBeCloseTo(0.3,2)
    expect(usersSims.find(s=>s.source ==35 && s.target ==5)!.similarity).toBeCloseTo(0.3,2)
    expect(usersSims.find(s=>s.source ==584 && s.target ==126)!.similarity).toBeCloseTo(0.4758,2)
    expect(usersSims.find(s=>s.source ==126 && s.target ==584)!.similarity).toBeCloseTo(0.4758,2)
    expect(usersSims.find(s=>s.source ==394 && s.target ==81)!.similarity).toBeCloseTo(0.2,2)
    expect(usersSims.find(s=>s.source ==81 && s.target ==394)!.similarity).toBeCloseTo(0.2,2)
    // expect(usersSims.find(s=>s.source =="3955" && s.target =="3624")!.similarity).toBeCloseTo(0.24359641650320665,2)
    // expect(usersSims.find(s=>s.source =="3624" && s.target =="3955")!.similarity).toBeCloseTo(0.24359641650320665,2)

})