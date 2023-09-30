import {PrismaClient, RatingType, TypeEvent} from "@prisma/client";
import {eventsParams, prepareRatingsForSave, saveRatings} from "./calculate_implicit_ratings";


const prisma = new PrismaClient();

// const w1 = 100;
// const w2 = 50;
// const w3 = 15;
// const w4 = 5;
function calculateDecay(ageInDays: number) {
    return 1 / (ageInDays+1);
}

async function getAllUsersInUserEvents() {
    return prisma.userEvent.findMany({
        distinct: ['userId'],
        select: {
            userId: true
        },
        // важно для учёта количества событий, старые не будут учитываться
        orderBy: {
            createdAt: 'desc'
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


// async function calculateImplicitRatingsForUserWithTimeDecay(userId: number) {
//     const events = await getUserEvents(userId);
//     const weights = {"BUY": w1, "MORE_DETAILS": w2, "DETAILS": w3, "GENRE_VIEW": w4} as any;
//     const maxCounts = {"BUY": 1, "MORE_DETAILS": 10, "DETAILS": 30, "GENRE_VIEW": 50} as any;
//
//     const ratings = {} as any;
//
//     for (let entry of events) {
//         const contentId = (entry.movieId || entry.genreId) as string;
//         const eventType = entry.event;
//
//         if (!ratings[contentId]) {
//             ratings[contentId] = {events: {}, contentType: entry.movieId ? 'movie' : 'genre'}
//         }
//
//         // const ageInYears = Math.floor(
//         //     (new Date().valueOf() - entry.createdAt.valueOf()) / (1000 * 60 * 60 * 24 * 365.2425)
//         // );
//         const ageInDays = Math.floor(
//             (new Date().valueOf() - entry.createdAt.valueOf()) / (1000 * 60 * 60 * 24)
//         );
//
//         const decay = calculateDecay(ageInDays);
//
//         // const decay =randomInt(20);
//
//
//         if (!ratings[contentId].events[eventType]){
//             ratings[contentId].events[eventType] = {count:0, value: 0}
//         }
//         if (ratings[contentId].events[eventType].count < (maxCounts[eventType] ?? 0)){
//             ratings[contentId].events[eventType].count += 1
//             ratings[contentId].events[eventType].value += (weights[eventType] ?? 0) * decay;
//         }
//     }
//
//     let max_rating = 0;
//     for (const contentId in ratings) {
//         let  sum = 0
//         for(const eventType in ratings[contentId].events){
//             sum+= ratings[contentId].events[eventType].value
//             max_rating = Math.max(max_rating, sum);
//         }
//         ratings[contentId]= { rating: sum, contentType: ratings[contentId].contentType}
//     }
//
//     // умножаем на 10 так как рейтинг от 0 до 10
//     for (const contentId in ratings) {
//         ratings[contentId].rating = 10 * ratings[contentId].rating / max_rating;
//     }
//
//     return ratings;
//
// }
async function calculateImplicitRatingsForUserWithTimeDecay(userId: number) {
    const events = await getUserEvents(userId);

    const userValues = [] as { authorId: number, movieId: string | null, genreId: number | null, value: number, count:number , type: TypeEvent}[];


    for (const row of events) {
        let rating = userValues.find(
            rating => rating.type ==
                row.event && (row.movieId != null ? rating.movieId == row.movieId : rating.genreId == row.genreId))

        if (!rating) {
            rating = {
                authorId: userId,
                movieId: row.movieId,
                genreId: row.genreId,
                type: row.event,
                value: 0,
                count: 0
            }
            userValues.push(rating)
        }

        if (!eventsParams[row['event']]) continue;

        // временное затухание по месяцам
        const ageInMonths = Math.floor(
            (new Date().valueOf() - row.createdAt.valueOf()) / (1000 * 60 * 60 * 24* 30)
        );

        const decay = calculateDecay(ageInMonths);

        const maxCount = eventsParams[row['event']].maxCount
        const weight = eventsParams[row['event']].weight
        if (weight && maxCount && (rating.count < maxCount)){
            rating.count += 1
            rating.value += weight * decay;
        }

    }

    const userRatings = [] as { authorId: number, movieId: string | null, genreId: number | null, rating: number }[];
    let max_rating = 0;
    for (const entry of userValues) {
        let rating = userRatings.find(
            rating => entry.movieId != null ? rating.movieId == entry.movieId : rating.genreId == entry.genreId)

        if (!rating) {
            rating = {
                authorId: userId,
                movieId: entry.movieId,
                genreId: entry.genreId,
                rating: 0
            }
            userRatings.push(rating)
        }

        rating.rating+=entry.value
        max_rating = Math.max(max_rating, rating.rating);
    }

    // умножаем на 10 так как рейтинг от 0 до 10
    userRatings.forEach(rating => rating.rating = 10 * rating.rating / max_rating)
    // 0 будет совпадать с отсутствующей оценкой, чтобы этого избежать заменим её на маленькое число
    userRatings.forEach(rating =>{
        if(rating.rating == 0.0){
            rating.rating = 0.00001
        }
    })

    return userRatings;

}
async function calculateImplicitRatingsWithTimeDecay() {
    const users = await getAllUsersInUserEvents();
    let allRatings = [] as any[]
    for (const user of users) {
        const userId = user.userId;
        const ratings = await calculateImplicitRatingsForUserWithTimeDecay(userId);
        allRatings = allRatings.concat(ratings)
    }
    return allRatings
}

async function flushDB() {
    await prisma.rating.deleteMany({
        where: {
            type: "IMPLICIT"
        }
    })
}

export async function buildImplicitRatingsWithTimeDecay(){
    flushDB().then(calculateImplicitRatingsWithTimeDecay).then(prepareRatingsForSave).then(ratings=>{console.log(ratings);return ratings}).then(saveRatings)
}
