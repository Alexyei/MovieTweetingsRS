import {BaseRecommender} from "./base_recommender";
import {PrismaClient, SimilarityType} from "@prisma/client";
import {getRatingsWithPriorityByUserId, getRatingsWithPriorityByUserIds} from "../DAO/priopity_ratings";
import {getCandidatesPairsFromUsersSimilarityByUserId} from "../DAO/user_similarity";
import {getMoviesDataByIds} from "../DAO/movie";
import {getUsersDataByIds} from "../DAO/user";

const prisma = new PrismaClient()

export class UserUserRecommender extends BaseRecommender {
    async predictScore(userId: number, movieId: string,max_rating=10,min_rating=0.001,type:SimilarityType = 'OTIAI',candidates=1000, min_sims=0.2, testDb = true) {
        const userRatings = await getRatingsWithPriorityByUserId(userId,testDb)
        if (userRatings.length == 0) return 0.0

        const userMeanRating = userRatings.reduce((acc, rating) =>rating.rating + acc,0) / userRatings.length

        // const userMovieIds = userRatings.map(r => r.movieId).filter(id=>id!=movieId)

        const candidatesPairs = await getCandidatesPairsFromUsersSimilarityByUserId(userId,'OTIAI',candidates,min_sims,testDb)

        const simsUserIds = Array.from(new Set(candidatesPairs.filter(p=>p.similarity>=min_sims).map(p=>p.target)))

        const simsUserRatings = await getRatingsWithPriorityByUserIds(simsUserIds,testDb)

        let userRatingsNormalized = simsUserRatings.map(r=>{
            const uRatings = simsUserRatings.filter(ur=>ur.authorId == r.authorId).map(ur=>ur.rating)
            const uMean = uRatings.reduce((acc, rating) =>rating + acc,0) / uRatings.length

            return {...r,normRating: r.rating - uMean}
        })

        userRatingsNormalized = userRatingsNormalized.filter(r=>r.movieId==movieId)


        // if (userRatingsNormalized.length == 0) return 0.0
        if (userRatingsNormalized.length == 0) return userMeanRating

        let numerator = 0;
        let denominator = 0;
        for (const rating of userRatingsNormalized){
            const similarity = candidatesPairs.find(p=>p.target == rating.authorId)!.similarity
            numerator += similarity*rating.normRating
            denominator += similarity
        }

        return Math.max(Math.min(numerator/denominator + userMeanRating,max_rating),min_rating)
    }

    async recommendItems(userId: number, take: number = 10, max_rating=10,min_rating=0.001, overlap=3, candidates=100, type:SimilarityType = 'OTIAI', min_sims = 0.2, testDb = true) {
        const userRatings = await getRatingsWithPriorityByUserId(userId, testDb)
        if (userRatings.length == 0) return []

        const userMeanRating = userRatings.reduce((acc, rating) =>rating.rating + acc,0) / userRatings.length
        // const userMovieIds = userRatings.map(r => r.movieId)

        const candidatesPairs = await getCandidatesPairsFromUsersSimilarityByUserId(userId,'OTIAI',candidates,min_sims,testDb)

        const simsUserIds = Array.from(new Set(candidatesPairs.filter(p=>p.similarity>=min_sims).map(p=>p.target)))

        const simsUserRatings = await getRatingsWithPriorityByUserIds(simsUserIds, testDb)

        //нормализовать оценки пользователей

        let userRatingsNormalized = simsUserRatings.map(r=>{
            const uRatings = simsUserRatings.filter(ur=>ur.authorId == r.authorId).map(ur=>ur.rating)
            const uMean = uRatings.reduce((acc, rating) =>rating + acc,0) / uRatings.length

            return {...r,normRating: r.rating - uMean}
        })
        // удаляем те фильмы которые встречаются меньше n раз
        userRatingsNormalized = userRatingsNormalized.filter(r=>userRatingsNormalized.filter(rr=>r.movieId==rr.movieId).length >= overlap)

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
            recommendations.push({target,sources: sourcesInfo, predictedRating:Math.max(Math.min(numerator/denominator + userMeanRating,max_rating),min_rating)})
        }


        // нормализация predictedRating не нужна, такак они расчитываются на основании оценок одного пользователя
        const sortedRecommendations = recommendations.sort((a, b) => b.predictedRating - a.predictedRating).slice(0, take);
        const notUserMoviesIds = userRatingsNormalized.map(r=>r.movieId)

        const moviesData = await getMoviesDataByIds(Array.from(new Set(notUserMoviesIds)))

        const usersData = await getUsersDataByIds(Array.from(new Set(simsUserIds)))

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