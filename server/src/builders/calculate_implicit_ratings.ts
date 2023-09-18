import {PrismaClient, TypeEvent} from "@prisma/client";
const prisma = new PrismaClient();

const w1 = 100;
const w2 = 50;
const w3 = 15;
const w4 = 5;

async function getAllUsersInLog() {
    return prisma.userEvent.findMany({
        distinct: ['userId'],
        select: {
            userId: true
        }
    });
}

async function queryAggregatedLogDataForUser(userId: number) {
    return prisma.userEvent.groupBy({
        by: ["userId", "movieId", "genreId", "event"],
        where: {
            userId: userId,
        },
        _count: {_all: true}
    });
}

//Альтернативный вариант метода
async function calculateImplicitRatingsForUser1(userId:number) {
    const data = await queryAggregatedLogDataForUser(userId);

    const agg_data = {} as any;
    let max_rating = 0;


    for (const row of data) {
        const contentId = (row.movieId || row.genreId) as string;
        if (!agg_data[contentId]) {
            agg_data[contentId] = {counts: {}, contentType: row.movieId ? 'movie' : 'genre'};
        }

        agg_data[contentId].counts[row['event']] = row._count._all;
    }

    const ratings = {} as any;
    for (const [contentId, value] of Object.entries(agg_data) as any) {
        const counts = value.counts
        const rating =
            w1 * (counts['BUY'] ?? 0)
            + w2 * Math.min((counts['MORE_DETAILS'] ?? 0),10)
            + w3 * Math.min((counts['DETAILS'] ?? 0),30)
            + w4* Math.min((counts['GENRE_VIEW'] ?? 0),50);
        max_rating = Math.max(max_rating, rating);

        ratings[contentId] = {rating, contentType: value.contentType}
    }

    for (const content_id in ratings) {
        ratings[content_id].rating = 10 * ratings[content_id].rating / max_rating;
    }

    return ratings;
}

async function calculateImplicitRatingsForUser(userId:number) {
    const data = await queryAggregatedLogDataForUser(userId);

    const weights = {"BUY": w1, "MORE_DETAILS": w2, "DETAILS": w3, "GENRE_VIEW": w4} as any;
    const maxCounts = {"BUY": 1, "MORE_DETAILS": 10, "DETAILS": 30, "GENRE_VIEW": 50} as any;
    const ratings = {} as any;
    let max_rating = 0;

    for (const row of data) {
        const contentId = (row.movieId || row.genreId) as string;
        if (!ratings[contentId]) {
            ratings[contentId] = {rating: 0, contentType: row.movieId ? 'movie' : 'genre'};
        }

        ratings[contentId].rating+=(weights[row['event']] ?? 0)*Math.min(
            row._count._all,
                maxCounts[row['event']] ?? 0)
        max_rating = Math.max(max_rating, ratings[contentId].rating);

    }

    // умножаем на 10 так как рейтинг от 0 до 10
    for (const content_id in ratings) {
        ratings[content_id].rating = 10 * ratings[content_id].rating / max_rating;
    }

    return ratings;
}

async function calculateImplicitRatings() {
    const users = await getAllUsersInLog();
    for (const user of users) {
        const userId = user.userId;

        const ratings = await calculateImplicitRatingsForUser(userId)
        console.log(ratings)
    }
}

async function flushDB() {
    await prisma.rating.deleteMany({
        where: {
            type: "IMPLICIT"
        }
    })
}

flushDB().then(calculateImplicitRatings)