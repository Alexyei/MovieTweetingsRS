import {config} from "dotenv";


import {PrismaClient} from "@prisma/client";
import ProgressBar from "progress";
import {createBasicLogger} from "../logger/basic_logger";
import fs from "fs";
import {Readable} from "stream";
import {finished} from "stream/promises";

const prisma = new PrismaClient();
config();
const logger = createBasicLogger("movie_description")

// const start_date = "1970-01-01"
function getApiKey() {
    return process.env["THEMOVIEDB_APIKEY"] || "";
}

function getMovieData(movieId: string) {
    const URL = `https://api.themoviedb.org/3/find/tt${movieId}?external_source=imdb_id&api_key=${getApiKey()}`
    return fetch(URL)
        .then(response => response.json())
        .then(data => data);
}

function getGenres() {
    const URL = `https://api.themoviedb.org/3/genre/movie/list?external_source=imdb_id&api_key=${getApiKey()}`
    return fetch(URL)
        .then(response => response.json())
        .then(data => data["genres"]);
}

async function downloadPoster(path: string) {
    const URL = `https://image.tmdb.org/t/p/w500${path}`
    const FILENAME = `./src/public/images/posters${path}`

    if (fs.existsSync(FILENAME)) {
        logger.log('info',`Image already has downloaded : ${path}`);
        return;
    }
    try {
        const { body } = await fetch(URL);
        const fileStream = fs.createWriteStream(FILENAME, {flags: 'wx'});
        await finished(Readable.fromWeb(body as any).pipe(fileStream));
        logger.log('info',`Success downloaded image: ${path}`);
    } catch (error) {
        logger.log('error',`Error downloaded image: ${path}`);
    }
}

async function appendGenres() {
    const genres = await getGenres()
    const genresDict: any = {}
    for (const genre of genres) {
        const genreName = genre.name
        const genreId = genre.id

        const foundGenre = await prisma.genre.findFirst({
            where: {name: genreName}
        })

        if (!foundGenre) {
            genresDict[genreId] = genreName;
            await prisma.genre.create({
                data: {name: genreName},
            });
        }
    }

    return genresDict
}


async function populate() {
    const genresDict = await appendGenres()
    const movies = await prisma.movie.findMany({where: {description: null,},})
    const ids = movies.map(movie => movie.id)

    const progressBar = new ProgressBar(":bar :current/:total", {total: ids.length});

    for (let movieId of ids) {
        const foundData = await getMovieData(movieId)

        if (foundData["movie_results"].length == 0) {
            logger.log('error', `Movie with id=${movieId} not found`)
            progressBar.tick()
            continue;
        }

        const movieData = foundData["movie_results"][0]

        const genreIds = movieData["genre_ids"].reduce((accumulator: any[], genreId: any) => {
            if (genresDict[genreId])
                return [...accumulator, {id: genresDict[genreId]}]
            else
                return accumulator
        }, []);
        // const genreIds = movieData["genre_ids"].map((genreId:any) => ({ id: genresDict[genreId] }));
        const movie = await prisma.movie.update({
            where: {id: movieId},
            data: {
                description: movieData["overview"],
                "poster_path": movieData["poster_path"],
                genres: {connect: genreIds},
            },
        });
        logger.log('info',{movieId,description: movieData["overview"],"poster_path": movieData["poster_path"],});
        //download poster
        if (movieData["poster_path"])
            await downloadPoster(movieData["poster_path"])

        progressBar.tick()
    }
}

// async function getImdbId(movieId:number) {
//     const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${getApiKey()}`;
//
//     try {
//         const response = await fetch(url);
//         const data = await response.json();
//
//         if (!('imdb_id' in data)) {
//             return '';
//         }
//
//         const imdbId = data['imdb_id'];
//         if (imdbId !== null) {
//             return imdbId.substring(2);
//         } else {
//             return '';
//         }
//     } catch (error:any) {
//         console.error('Error:', error.toString());
//         return '';
//     }
// }


// async function getDescriptions() {
//     const url = `https://api.themoviedb.org/3/discover/movie?primary_release_date.gte={}&api_key={}&page={}`;
//     const apiKey = getApiKey();
//     // MovieDescriptions.objects.all().delete();
//
//     for (let page = 1; page < NUMBER_OF_PAGES; page++) {
//         const formattedUrl = url.format(start_date, apiKey, page);
//         console.log(formattedUrl);
//
//         try {
//             const response = await fetch(formattedUrl);
//             const data = await response.json();
//
//             for (const film of data.results) {
//                 const id = film.id;
//                 const md = await prisma.movieDescriptions.upsert({
//                     where: { movie_id: id },
//                     create: {},
//                     update: {},
//                 });
//
//                 md.imdb_id = await getImdbId(id);
//                 md.title = film.title;
//                 md.description = film.overview;
//                 md.genres = film.genre_ids;
//                 if (md.imdb_id !== null) {
//                     await prisma.movieDescriptions.update(md);
//                 }
//             }
//
//             await sleep(1000);
//
//             console.log(`${page}: ${data}`);
//         } catch (error) {
//             console.error('Error:', error.message);
//         }
//     }
// }


// Загрузка жанров
//https://api.themoviedb.org/3/genre/movie/list?api_key=f320693db8717aabcd6a78029f03e67a
// Загрузка фильма
//https://api.themoviedb.org/3/find/tt0106519?external_source=imdb_id&api_key=f320693db8717aabcd6a78029f03e67a
// Загрузка фильма на русском
//https://api.themoviedb.org/3/find/tt0111161?external_source=imdb_id&api_key=f320693db8717aabcd6a78029f03e67a&language=ru-RU
// Получение изображения
// https://image.tmdb.org/t/p/w500/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg

async function checkAllPostersLoaded(){
    const moviesWithPosters = await prisma.movie.findMany({where: {NOT: {description: null,}}})
    const poster_paths = moviesWithPosters.map(movie => movie.poster_path) as string[]

    const progressBar = new ProgressBar(":bar :current/:total", {total: poster_paths.length});

    for (let poster of poster_paths) {
        await downloadPoster(poster)
        progressBar.tick()
    }
}

populate().then(checkAllPostersLoaded)