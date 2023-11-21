import {PrismaClient} from "@prisma/client";
import ProgressBar from "progress";
import {createPinoLogger} from "../logger/pino_basic_logger";
import fetch from "node-fetch";
const logger = createPinoLogger("movie")
const prisma = new PrismaClient()

function downloadMovies(URL = "https://raw.githubusercontent.com/sidooms/MovieTweetings/master/latest/movies.dat") {
    return fetch(URL)
        .then(response => response.text())
        .then(data => data);
}
async function flushDB(){
    const movie_count = await prisma.movie.count()
    if (movie_count > 1){
        await prisma.movie.deleteMany()
        await prisma.genre.deleteMany()
    }
}

const createMovie = async (movieId:string, titleAndYear:string, genres:string) => {
    const titleAndYearParts = titleAndYear.split("(");
    const title= titleAndYearParts[0].trim()
    const year = Number(titleAndYearParts[1].slice(0, -1).trim())
    logger.info({id: movieId, title, year})
    let movie = await prisma.movie.create({
        data: {
            id: movieId,
            title,
            year
        },
    });

    if (genres) {
        const genreArray = genres.split("|");
        for (const genreName of genreArray) {
            let genre = await prisma.genre.upsert({
                where: { name: genreName },
                create: { name: genreName },
                update: {},
            });
            movie = await prisma.movie.update({
                where: { id: movie.id },
                data: {
                    genres: { connect: { id: genre.id } },
                },
            });
        }
    }

    return movie;
};

function normalizeId(movieId: string) {
    if (movieId.length > 8){
        // last 7 chars
        // movieId = movieId.substring(movieId.length - 7)
        return null
    }
    if (movieId.length < 7){
        movieId = movieId.padStart(7,'0')
    }
    return movieId
}

const populate = async () => {
    let movies = await downloadMovies();

    if (movies.length === 0) {
        console.log("The latest dataset seems to be empty. Older movie list downloaded.");
        console.log("Please have a look at https://github.com/sidooms/MovieTweetings/issues and see if there is an issue");
        movies = await downloadMovies(
            "https://raw.githubusercontent.com/sidooms/MovieTweetings/master/snapshots/100K/movies.dat"
        );
    }
    console.log("movie data downloaded");

    const movieArray = movies.split("\n");
    const totalMovies = movieArray.length;
    const progressBar = new ProgressBar(":bar :current/:total", { total: totalMovies });
    for (const movie of movieArray) {
        const m = movie.split("::");
        if (m.length === 3) {
            const movieId = normalizeId(m[0])
            if (movieId)
                await createMovie(movieId, m[1], m[2]);
        }

        progressBar.tick();
    }
};

export function populateMovies(){
    flushDB().then(populate)
}


