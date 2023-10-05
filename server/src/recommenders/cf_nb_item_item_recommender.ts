import {BaseRecommender} from "./base_recommender";
import {PrismaClient, SimilarityType} from "@prisma/client";
import {getRatingsWithPriorityByUserId} from "../DAO/priopity_ratings";
import {
    getAllCandidatesPairsFromMoviesSimilarity,
    getCandidatesPairsFromMoviesSimilarityByTargetId
} from "../DAO/movie_similarity";
import {getMoviesDataByIds} from "../DAO/movie";

// const prisma = new PrismaClient()

export class ItemItemRecommender extends BaseRecommender {
    async predictScore(userId: number, movieId: string,type:SimilarityType = 'OTIAI',candidates=1000, min_sims=0.2, testDb = true) {
        const userRatings = await getRatingsWithPriorityByUserId(userId,testDb)
        if (userRatings.length == 0) return 0.0
        const userMeanRating = userRatings.reduce((acc, rating) =>rating.rating + acc,0) / userRatings.length
        const userMovieIds = userRatings.map(r => r.movieId).filter(id=>id!=movieId)

        const candidatesPairs = await getCandidatesPairsFromMoviesSimilarityByTargetId(userMovieIds,movieId,type,candidates,min_sims,testDb)

        // if (candidatesPairs.length == 0) return 0.0
        if (candidatesPairs.length == 0) return userMeanRating

        let numerator = 0;
        let denominator = 0;
        for (const candidate of candidatesPairs){
            const source = candidate.source
            const similarity = candidate.similarity
            const rating = userRatings.find(r=>r.movieId == source)!.rating - userMeanRating
            numerator += similarity*rating
            denominator += similarity
        }
        return numerator/denominator + userMeanRating
    }
//predict_score_by_ratings(self, item_id, movie_ids):
    async recommendItems(userId: number, take: number = 10, overlap=2, candidates=100, type:SimilarityType = 'OTIAI', min_sims = 0.2, testDb = true) {
        const userRatings = await getRatingsWithPriorityByUserId(userId,testDb)

        if (userRatings.length == 0) return []

        const userMeanRating = userRatings.reduce((acc, rating) =>rating.rating + acc,0) / userRatings.length

        const userMovieIds = userRatings.map(r => r.movieId)


        const candidatesPairs = await getAllCandidatesPairsFromMoviesSimilarity(userMovieIds,type,candidates,min_sims,testDb)

        const recommendations:{target:string,sources:{id:string, similarity: number, rating: number}[],predictedRating:number}[] = []
        // const recommendations:{[key:string]:{sources:{id:string, similarity: number}[],predictedRating:number}} = {}
        for (const candidate of candidatesPairs){
            const target = candidate.target
            if (recommendations.findIndex(rec=>rec.target==target)!=-1) continue;

            const neighbors_size = 15
            const sources = candidatesPairs.filter(p=>p.target == target).slice(0,neighbors_size)
            if (sources.length < overlap) continue;
            let numerator = 0;
            let denominator = 0;
            const sourcesInfo:{id:string, similarity: number, rating: number}[] = []
            for (const source of sources){
                const sourceRating = userRatings.find(r=>r.movieId==source.source)!.rating - userMeanRating
                numerator += source.similarity*sourceRating
                denominator += source.similarity

                sourcesInfo.push({id:source.source,similarity:source.similarity,rating:sourceRating+userMeanRating})
            }
            recommendations.push({target,sources: sourcesInfo, predictedRating:numerator/denominator + userMeanRating})
        }
        // нормализация predictedRating не нужна, такак они расчитываются на основании оценок одного пользователя
        const sortedRecommendations = recommendations.sort((a, b) => b.predictedRating - a.predictedRating).slice(0, take);
        const notUserMoviesIds = candidatesPairs.map(p=>p.target)

        const moviesData = await getMoviesDataByIds(Array.from(new Set([...notUserMoviesIds,...userMovieIds])),testDb)

        return sortedRecommendations.map(rec=>{
            const targetData = moviesData.find(m=>m.id==rec.target)!
            return {
                movieId: rec.target,
                posterPath: targetData.poster_path,
                title: targetData.title,
                predictedRating: rec.predictedRating,
                recommendedByMovies: rec.sources.map(s=>{
                    const sourceData = moviesData.find(m=>m.id==s.id)!
                    return {
                        movieId: s.id,
                        posterPath: sourceData.poster_path,
                        title: sourceData.title,
                        rating: s.rating
                    }
                })
            }
        })
    }
    //def recommend_items_by_ratings(self, user_id, active_user_items, num=6)
}