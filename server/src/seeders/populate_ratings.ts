import {PrismaClient} from "@prisma/client";
import ProgressBar from "progress";
import {createBasicLogger} from "../logger/basic_logger";

const logger = createBasicLogger("ratings")
const prisma = new PrismaClient()
async function flushDB(){
    await prisma.rating.deleteMany({where:{type:'EXPLICIT'}})
}

function normalizeId(movieId: string) {
    if (movieId.length > 8){
        // last 7 chars
        movieId = movieId.substring(movieId.length - 7)
    }
    if (movieId.length < 7){
        movieId = movieId.padStart(7,'0')
    }
    return movieId
}
async function createRating(user_id:string, movie_id:string, rating:string, timestamp:string) {
    try {
        let user = await prisma.user.upsert({
            where: { id: Number(user_id) },
            create: { id: Number(user_id)  },
            update: {},
        });

        const normalizedId = normalizeId(movie_id)

        const createdRating = await prisma.rating.create({
            data: {
                author: { connect: { id: user.id } },
                movie: { connect: { id: normalizedId } },
                // 0 будет совпадать с отсутствующей оценкой, чтобы этого избежать заменим её на маленькое число
                rating: Number(rating) == 0 ?  0.00001 : Number(rating),
                createdAt: new Date(parseFloat(timestamp) * 1000),
            },
        });

        logger.log('info',{user: user.id , movie: normalizedId, rating})
        return createdRating;
    } catch (error) {
        logger.log('error',{user: Number(user_id) , movie: normalizeId(movie_id), rating})
    }
}

function downloadRatings(URL = "https://raw.githubusercontent.com/sidooms/MovieTweetings/master/latest/ratings.dat") {
    return fetch(URL)
        .then(response => response.text())
        .then(data => data);
}

const populate = async () => {
    let ratings = await downloadRatings();

    if (ratings.length === 0) {
        console.log("The latest dataset seems to be empty. Older movie list downloaded.");
        console.log("Please have a look at https://github.com/sidooms/MovieTweetings/issues and see if there is an issue");
        ratings = await downloadRatings(
            "https://raw.githubusercontent.com/sidooms/MovieTweetings/master/snapshots/100K/ratings.dat"
        );
    }
    console.log("rating data downloaded");

    const ratingsArray = ratings.split("\n");
    const totalRatings = ratingsArray.length;
    const progressBar = new ProgressBar(":bar :current/:total", { total: totalRatings });
    for (const movie of ratingsArray) {
        const m = movie.split("::");
        if (m.length === 4) {
            await createRating(m[0], m[1], m[2], m[3]);
        }
        progressBar.tick();
    }
};

export function populateRatings(){
    flushDB().then(populate)
}

