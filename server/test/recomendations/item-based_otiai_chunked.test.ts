import {beforeAll, expect, test} from "vitest";
import {Prisma, PrismaClient, RatingType} from "@prisma/client";
import fs from "fs";
import { parse } from 'csv-parse';
const Papa = require('papaparse');
import csv from "csv-parser";
import {
    calculateMoviesOtiaiSimilarity,
    createMoviesOtiaiSimilarity
} from "../../src/builders/calculate_movies_otiai_similarity";
import {calculateMoviesOtiaiSimilarityChunked} from "../../src/builders/calculate_movies_otiai_similarity_chunked";

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
        data: movieSimsData,
        skipDuplicates: true
    })
}

async function getUniqueMovieIds(skip:number,take:number){
    return prisma.testRating.findMany({distinct: ['movieId'], orderBy: {movieId: 'asc',}, select: {movieId: true}, skip:skip,take:take});
}

async function getChunkRatings(movieIds:string[]){
    return prisma.testRating.findMany({where: {movieId: {in: movieIds}}})
}

async function saveChunkSims(chunkSims:any){
    await createMovieSims(chunkSims)
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
        // await prisma.testMoviesSimilarity.deleteMany()
        // await prisma.testMovie.deleteMany()
        // await prisma.testUser.deleteMany()
    }
})

test('ratings created', async () => {
    expect(await prisma.testRating.count()).toBeGreaterThan(0)
})

test('create item similarity', async () => {
    const usersData = await prisma.testRating.groupBy({by: 'authorId',_avg: {rating:true},orderBy: {authorId: 'asc'}})
    const uniqueMovieIds =  (await prisma.testRating.findMany({
        distinct: ['movieId'],
        orderBy: {movieId: 'asc',},
        select: {movieId: true},
    })).map(mid=>mid.movieId);
    // await calculateMoviesOtiaiSimilarityChunked(usersData,getUniqueMovieIds,getChunkRatings,saveChunkSims,100,0.2,4)
    await calculateMoviesOtiaiSimilarityChunked(usersData,uniqueMovieIds,getChunkRatings,saveChunkSims,100,0.2,4)
})

test('test item similarity', async () => {
    const moviesSims = await prisma.testMoviesSimilarity.findMany()
    expect(moviesSims.length).toBe(101420)
    expect(moviesSims.find(s=>s.source =="1" && s.target =="588")!.similarity).toBeCloseTo(0.327,2)
    expect(moviesSims.find(s=>s.source =="588" && s.target =="1")!.similarity).toBeCloseTo(0.327,2)
    expect(moviesSims.find(s=>s.source =="96861" && s.target =="120635")!.similarity).toBeCloseTo(0.912,2)
    expect(moviesSims.find(s=>s.source =="120635" && s.target =="96861")!.similarity).toBeCloseTo(0.912,2)
    expect(moviesSims.find(s=>s.source =="1499" && s.target =="2148")!.similarity).toBeCloseTo(0.2,2)
    expect(moviesSims.find(s=>s.source =="2148" && s.target =="1499")!.similarity).toBeCloseTo(0.2,2)
    expect(moviesSims.find(s=>s.source =="3955" && s.target =="3624")!.similarity).toBeCloseTo(0.24359641650320665,2)
    expect(moviesSims.find(s=>s.source =="3624" && s.target =="3955")!.similarity).toBeCloseTo(0.24359641650320665,2)

})