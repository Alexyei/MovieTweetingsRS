import {PrismaClient} from "@prisma/client";
import {MovieT} from "../types/movie.types";

const prisma = new PrismaClient();

export async function getMoviesDataByIds(movieIds:string[],testDB = true){
    if (testDB){
        return prisma.testMovie.findMany({
            where: {id: {in: movieIds},},
            select: {id: true, poster_path: true, title: true},
        });
    }
    return prisma.movie.findMany({
        where: {id: {in: movieIds},},
        select: {id: true, poster_path: true, title: true},
    });
}

export async function saveMovies(moviesData: MovieT[], testDB = true) {
    testDB ? await prisma.testMovie.createMany({data: moviesData}) : await prisma.movie.createMany({data: moviesData})
}

export async function deleteAllMovies(testDB = true){
    testDB ? await prisma.testMovie.deleteMany() : await prisma.movie.deleteMany()
}