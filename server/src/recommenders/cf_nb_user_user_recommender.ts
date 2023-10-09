import {BaseRecommender} from "./base_recommender";
import {SimilarityType} from "@prisma/client";
import {getDAO} from "../DAO/DAO";
import {CFNBUserUserRecommendationT} from "../types/recommendations.types";
import {MovieDataT} from "../types/movie.types";
import {UserDataT} from "../types/user.types";
import {NormalizedRatingT} from "../types/rating.types";
import {UserSimilarityT} from "../types/similarity.types";

export class UserUserRecommender extends BaseRecommender {
    _max_rating: number
    _min_rating: number
    _dao: ReturnType<typeof getDAO>
    _type:SimilarityType
    constructor(testDb = true, max_rating=10,min_rating=0.001, type:SimilarityType = 'OTIAI') {
        super();
        this._max_rating = max_rating
        this._min_rating = min_rating
        this._type = type
        this._dao = getDAO(testDb)
    }
    async predictScore(userId: number, movieId: string,ncandidates=1000, min_sims=0.2) {
        const {userRatings,simsUserIds,userRatingsNormalized,userMeanRating,candidatesPairs} = await this.#prepareDataForPredict(userId,movieId,ncandidates,min_sims)
        
        if (userRatings.length == 0) return userMeanRating
        if (userRatingsNormalized.length == 0) return userMeanRating

        let numerator = 0;
        let denominator = 0;
        for (const rating of userRatingsNormalized){
            const similarity = candidatesPairs.find(p=>p.target == rating.authorId)!.similarity
            numerator += similarity*rating.normalizedRating
            denominator += similarity
        }

        return Math.max(Math.min(numerator/denominator + userMeanRating,this._max_rating),this._min_rating)
    }

    async recommendItems(userId: number, take: number = 10, overlap=3, ncandidates=100, min_sims = 0.2) {
        const {userRatings,simsUserIds,userRatingsNormalized,userMeanRating,candidatesPairs} = await this.#prepareDataForRecs(userId,overlap,ncandidates,min_sims)
        if (userRatings.length == 0) return []
        // Для каждого фильма из списка рассчитываем прогнозируемую оценку на оновании средней оценки текущего пользователя (source) и нормализованных оценок target которые просмотрели этот фильм
        const recommendations = this.#getRecommendations(candidatesPairs,userRatingsNormalized,userMeanRating)
        
        const sortedRecommendations = recommendations.sort((a, b) => b.predictedRating - a.predictedRating).slice(0, take);
        const notUserMoviesIds = userRatingsNormalized.map(r=>r.movieId)

        const moviesData = await this._dao.movie.getMoviesDataByIds(Array.from(new Set(notUserMoviesIds)))
        const usersData = await this._dao.user.getUsersDataByIds(Array.from(new Set(simsUserIds)))

        return this.#prettyRecommendations(sortedRecommendations,moviesData,usersData)
    }
    
    async #prepareData(userId: number, ncandidates=100, min_sims = 0.2){
        const userRatings = await this._dao.priorityRating.getByUserId(userId)
        const userMeanRating =userRatings.length == 0 ? 0.0 : userRatings.reduce((acc, rating) =>rating.rating + acc,0) / userRatings.length
        const candidatesPairs = await this._dao.userSimilarity.getCandidatesPairsByUserId(userId,this._type,ncandidates,min_sims)

        const simsUserIds = Array.from(new Set(candidatesPairs.filter(p=>p.similarity>=min_sims).map(p=>p.target)))

        const simsUserRatings = await this._dao.priorityRating.getByUserIds(simsUserIds)

        //нормализовать оценки пользователей
        let userRatingsNormalized = simsUserRatings.map(r=>{
            const uRatings = simsUserRatings.filter(ur=>ur.authorId == r.authorId).map(ur=>ur.rating)
            const uMean = uRatings.reduce((acc, rating) =>rating + acc,0) / uRatings.length

            return {...r,normalizedRating: r.rating - uMean}
        })

        return  {userRatings,userRatingsNormalized,userMeanRating,candidatesPairs,simsUserIds}
    }
    async #prepareDataForPredict(userId: number, movieId:string,  ncandidates=100, min_sims = 0.2){
        let {userRatings,userRatingsNormalized,userMeanRating,candidatesPairs,simsUserIds} = await this.#prepareData(userId,ncandidates,min_sims)
        userRatingsNormalized = userRatingsNormalized.filter(r=>r.movieId==movieId)

        return  {userRatings,userRatingsNormalized,userMeanRating,candidatesPairs,simsUserIds}
    }
    
    async #prepareDataForRecs(userId: number, overlap=3, ncandidates=100, min_sims = 0.2){
        // overlap - количество схожих пользователей посмотревших рекомендуемый фильм
        // при расчёте сходств используется ДРУГОЙ overlap (количество ОБЩИХ фильмов между пользователями)
        let {userRatings,userRatingsNormalized,userMeanRating,candidatesPairs,simsUserIds} = await this.#prepareData(userId,ncandidates,min_sims)

        // удаляем те фильмы которые встречаются меньше n раз
        userRatingsNormalized = userRatingsNormalized.filter(r=>userRatingsNormalized.filter(rr=>r.movieId==rr.movieId).length >= overlap)

        // Из списка фильмов удаляем уже просмотренные пользователем фильмы
        userRatingsNormalized = userRatingsNormalized.filter(r=>!userRatings.find(rr=>rr.movieId == r.movieId))
        
        return  {userRatings,userRatingsNormalized,userMeanRating,candidatesPairs,simsUserIds}
    }
    
    #getRecommendations(candidates:UserSimilarityT[],userRatingsNormalized:NormalizedRatingT[], userMeanRating:number){
        const recommendations:CFNBUserUserRecommendationT[] = []
        for (const rating of userRatingsNormalized ){
            //target - фильм который посмотрел схожий пользователь (рекомендуемый элемент)
            const target = rating.movieId
            if (recommendations.findIndex(rec=>rec.target==target)!=-1) continue;
            
            // sources - оценки схожих пользователей, которые посомтрели этот фильм
            const sources = userRatingsNormalized.filter(r=>r.movieId == target)
            let numerator = 0;
            let denominator = 0;
            const sourcesInfo:{id:number, similarity: number, rating: number}[] = []
            for (const source of sources){
                const similarity = candidates.find(p=>p.target == source.authorId)!.similarity
                numerator += source.normalizedRating * similarity
                denominator += similarity

                sourcesInfo.push({id:source.authorId,similarity:similarity,rating:source.rating})
            }
            recommendations.push({target,sources: sourcesInfo, predictedRating:Math.max(Math.min(numerator/denominator + userMeanRating,this._max_rating),this._min_rating)})
        }
        
        return recommendations
    }
    #prettyRecommendations(sortedRecs:CFNBUserUserRecommendationT[],moviesData:MovieDataT[],usersData:UserDataT[]){
        return sortedRecs.map(rec=>{
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