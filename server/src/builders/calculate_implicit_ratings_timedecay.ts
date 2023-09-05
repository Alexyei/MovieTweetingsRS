import {PrismaClient, TypeEvent} from "@prisma/client";


const prisma = new PrismaClient();

const w1 = 100;
const w2 = 50;
const w3 = 15;
const w4 = 5;
function calculateDecay(ageInDays: number) {
    return 1 / (ageInDays+1);
}

async function getAllUsersInLog() {
    return prisma.userEvent.findMany({
        distinct: ['userId'],
        select: {
            userId: true
        }
    });
}

async function getUserEvents(userId: number) {
    return prisma.userEvent.findMany({
        where: {
            userId: userId,
        }
    });
}


async function calculateImplicitRatingsForUserWithTimeDecay(userId: number) {
    const events = await getUserEvents(userId);
    const weights = {"BUY": w1, "MORE_DETAILS": w2, "DETAILS": w3, "GENRE_VIEW": w4} as any;
    const maxCounts = {"BUY": 1, "MORE_DETAILS": 10, "DETAILS": 30, "GENRE_VIEW": 50} as any;

    const ratings = {} as any;

    for (let entry of events) {
        const contentId = (entry.movieId || entry.genreId) as string;
        const eventType = entry.event;

        if (!ratings[contentId]) {
            ratings[contentId] = {events: {}, contentType: entry.movieId ? 'movie' : 'genre'}
        }

        // const ageInYears = Math.floor(
        //     (new Date().valueOf() - entry.createdAt.valueOf()) / (1000 * 60 * 60 * 24 * 365.2425)
        // );
        const ageInDays = Math.floor(
            (new Date().valueOf() - entry.createdAt.valueOf()) / (1000 * 60 * 60 * 24)
        );

        const decay = calculateDecay(ageInDays);

        // const decay =randomInt(20);


        if (!ratings[contentId].events[eventType]){
            ratings[contentId].events[eventType] = {count:0, value: 0}
        }
        if (ratings[contentId].events[eventType].count < (maxCounts[eventType] ?? 0)){
            ratings[contentId].events[eventType].count += 1
            ratings[contentId].events[eventType].value += (weights[eventType] ?? 0) * decay;
        }
    }

    let max_rating = 0;
    for (const contentId in ratings) {
        let  sum = 0
        for(const eventType in ratings[contentId].events){
            sum+= ratings[contentId].events[eventType].value
            max_rating = Math.max(max_rating, sum);
        }
        ratings[contentId]= { rating: sum, contentType: ratings[contentId].contentType}
    }

    // умножаем на 10 так как рейтинг от 0 до 10
    for (const contentId in ratings) {
        ratings[contentId].rating = 10 * ratings[contentId].rating / max_rating;
    }

    return ratings;

}

async function calculateImplicitRatingsWithTimeDecay() {
    const users = await getAllUsersInLog();
    for (const user of users) {
        const userId = user.userId;
        const ratings = await calculateImplicitRatingsForUserWithTimeDecay(userId);
        console.log(ratings)
    }
}

async function flushDB() {
    // await prisma.rating.deleteMany({
    //     where: {
    //         type: "IMPLICIT"
    //     }
    // })
}

flushDB().then(calculateImplicitRatingsWithTimeDecay)