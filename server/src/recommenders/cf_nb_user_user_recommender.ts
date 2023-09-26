import {BaseRecommender} from "./base_recommender";
import {PrismaClient} from "@prisma/client";
import {getRatingsWithPriorityByUserId, getRatingsWithPriorityByUserIds} from "../utils/ORM";

const prisma = new PrismaClient()

export class UserUserRecommender extends BaseRecommender {
    async predictScore(userId: number, movieId: string) {
        const userRatings = await getRatingsWithPriorityByUserId(userId)
        if (userRatings.length == 0) return 0.0

        const userMeanRating = userRatings.reduce((acc, rating) =>rating.rating + acc,0) / userRatings.length

        const userMovieIds = userRatings.map(r => r.movieId).filter(id=>id!=movieId)


        const min_sims = 0.2
        const candidatesPairs = await prisma.usersSimilarity.findMany({
            where: {
                source: userId,
                target: {not: userId},
                similarity: {gte: min_sims},
                type: "OTIAI"
            }
        })

        const simsUserIds = Array.from(new Set(candidatesPairs.filter(p=>p.similarity>=min_sims).map(p=>p.target)))

        const simsUserRatings = await getRatingsWithPriorityByUserIds(simsUserIds)

        let userRatingsNormalized = simsUserRatings.map(r=>{
            const uRatings = simsUserRatings.filter(ur=>ur.authorId == r.authorId).map(ur=>ur.rating)
            const uMean = uRatings.reduce((acc, rating) =>rating + acc,0) / uRatings.length

            return {...r,normRating: r.rating - uMean}
        })

        userRatingsNormalized = userRatingsNormalized.filter(r=>r.movieId==movieId)


        if (userRatingsNormalized.length == 0) return 0.0

        let numerator = 0;
        let denominator = 0;
        for (const rating of userRatingsNormalized){
            const similarity = candidatesPairs.find(p=>p.target == rating.authorId)!.similarity
            numerator += similarity*rating.normRating
            denominator += similarity
        }

        return Math.max(Math.min(numerator/denominator + userMeanRating,10),0)
    }

    async recommendItems(userId: number, take: number = 10) {
        const userRatings = await getRatingsWithPriorityByUserId(userId)
        if (userRatings.length == 0) return []

        const userMeanRating = userRatings.reduce((acc, rating) =>rating.rating + acc,0) / userRatings.length

        const userMovieIds = userRatings.map(r => r.movieId)

        const min_sims = 0.2
        const candidatesPairs = await prisma.usersSimilarity.findMany({
            where: {
                source: userId,
                target: {not: userId},
                similarity: {gte: min_sims},
                type: "OTIAI"
            }
        })

        const simsUserIds = Array.from(new Set(candidatesPairs.filter(p=>p.similarity>=min_sims).map(p=>p.target)))

        const simsUserRatings = await getRatingsWithPriorityByUserIds(simsUserIds)

        //нормализовать оценки пользователей

        let userRatingsNormalized = simsUserRatings.map(r=>{
            const uRatings = simsUserRatings.filter(ur=>ur.authorId == r.authorId).map(ur=>ur.rating)
            const uMean = uRatings.reduce((acc, rating) =>rating + acc,0) / uRatings.length

            return {...r,normRating: r.rating - uMean}
        })

        // удаляем те фильмы которые встречаются меньше n раз
        const n = 1
        userRatingsNormalized = userRatingsNormalized.filter(r=>userRatingsNormalized.filter(rr=>r.authorId==rr.authorId).length >= n)

        // Из списка фильмов удаляем уже просмотренные пользователем фильмы
        userRatingsNormalized = userRatingsNormalized.filter(r=>!userRatings.find(rr=>rr.movieId == r.movieId))

        // Для каждого фильма из списка рассчитываем прогнозируемую оценку на оновании средней оценки текущего пользователя (source) и нормализованных оценок target которые просмотрели этот фильм

        const recommendations:{target:string,sources:{id:number, similarity: number, rating: number}[],predictedRating:number}[] = []
        for (const rating of userRatingsNormalized ){
            const target = rating.movieId
            if (recommendations.findIndex(rec=>rec.target==target)!=-1) continue;

            const sources = userRatingsNormalized.filter(r=>r.movieId == target)
            let numerator = 0;
            let denominator = 0;
            const sourcesInfo:{id:number, similarity: number, rating: number}[] = []
            for (const source of sources){
                const similarity = candidatesPairs.find(p=>p.target == source.authorId)!.similarity
                numerator += source.normRating * similarity
                denominator += similarity

                sourcesInfo.push({id:source.authorId,similarity:similarity,rating:source.rating})
            }
            recommendations.push({target,sources: sourcesInfo, predictedRating:Math.max(Math.min(numerator/denominator + userMeanRating,10),0)})
        }


        // нормализация predictedRating не нужна, такак они расчитываются на основании оценок одного пользователя
        const sortedRecommendations = recommendations.sort((a, b) => b.predictedRating - a.predictedRating).slice(0, take);
        const notUserMoviesIds = userRatingsNormalized.map(r=>r.movieId)

        const moviesData = await prisma.movie.findMany({
            where: {
                id: {
                    in: Array.from(new Set(notUserMoviesIds)),
                },

            },
            select: { id: true, poster_path: true,title:true },
        });

        const usersData = await prisma.user.findMany({
            where: {
                id: {
                    in: Array.from(new Set(simsUserIds)),
                },

            },
            select: { id: true, name: true},
        })

        return sortedRecommendations.map(rec=>{
            const targetData = moviesData.find(m=>m.id==rec.target)!
            return {
                movieId: rec.target,
                posterPath: targetData.poster_path,
                title: targetData.title,
                predictedRating: rec.predictedRating,
                recommendedByUsers: rec.sources.map(s=>{
                    const userData = usersData.find(u=>u.id == s.id)!
                    return {
                        userId: s.id,
                        name: userData.name,
                        similarity: s.similarity,
                        rating: s.rating
                    }
                })
            }
        })
    }
}