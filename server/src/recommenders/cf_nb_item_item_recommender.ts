import {BaseRecommender} from "./base_recommender";
import {SimilarityType} from "@prisma/client";
import {getDAO} from "../DAO/DAO";
import {CFNBItemItemRecommendationT} from "../types/recommendations.types";
import {MovieSimilarityT} from "../types/similarity.types";
import {RatingWithTypeT} from "../types/rating.types";

export class ItemItemRecommender extends BaseRecommender {
    _type:SimilarityType
    private _dao: ReturnType<typeof getDAO>;
    constructor( testDb = true,type:SimilarityType = 'OTIAI') {
        super();
        this._type = type
        this._dao = getDAO(testDb)
    }
    async predictScore(userId: number, movieId: string,ncandidates=1000, min_sims=0.2,) {
        const {userRatings,userMeanRating,userMovieIds,candidatesPairs} = await this.#prepareDataForPredict(userId,movieId,ncandidates,min_sims)
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
    async recommendItems(userId: number, take: number = 10, overlap=2, ncandidates=100, min_sims = 0.2) {

        const {userRatings,userMeanRating,userMovieIds,candidatesPairs} = await this.#prepareDataForRecs(userId,ncandidates, min_sims)

        if (userRatings.length == 0) return []
        const recommendations = this.#getRecommendations(candidatesPairs,userRatings,userMeanRating,overlap)
        // нормализация predictedRating не нужна, такак они расчитываются на основании оценок одного пользователя
        const sortedRecommendations = recommendations.sort((a, b) => b.predictedRating - a.predictedRating).slice(0, take);

        // const notUserMoviesIds = candidatesPairs.map(p=>p.target)
        // const moviesData = await this._dao.movie.getMoviesDataByIds(Array.from(new Set([...notUserMoviesIds,...userMovieIds])))
        return this.#prettyRecommendations(sortedRecommendations)
    }

    async #prepareData(userId: number){

        const userRatings = await this._dao.priorityRating.getByUserId(userId)

        const userMeanRating = userRatings.length == 0 ? 0.0 : userRatings.reduce((acc, rating) =>rating.rating + acc,0) / userRatings.length
        const userMovieIds = userRatings.map(r => r.movieId)

        return {userRatings,userMeanRating,userMovieIds}
    }
    async #prepareDataForPredict(userId: number,movieId: string, ncandidates=100, min_sims = 0.2){
        const {userRatings,userMeanRating,userMovieIds} = await this.#prepareData(userId)
        if (userRatings.length == 0) return {userRatings, userMeanRating,userMovieIds,candidatesPairs:[]}
        const candidatesPairs = await this._dao.movieSimilarity.getCandidatesByTargetId(userMovieIds,movieId,this._type,ncandidates,min_sims)
        return {userRatings,userMeanRating,userMovieIds,candidatesPairs}
    }

    async #prepareDataForRecs(userId: number,ncandidates=100, min_sims = 0.2){

        const {userRatings,userMeanRating,userMovieIds} = await this.#prepareData(userId)

        if (userRatings.length == 0) return {userRatings, userMeanRating,userMovieIds,candidatesPairs:[]}
        const candidatesPairs = await this._dao.movieSimilarity.getAllCandidates(userMovieIds,this._type,ncandidates,min_sims)
        return {userRatings,userMeanRating,userMovieIds,candidatesPairs}
    }
    #getRecommendations(candidates:MovieSimilarityT[], userRatings:RatingWithTypeT[],userMeanRating:number,overlap:number,neighbors_size = 15){
        //overlap - количество фильмов пользователя для рекомендуемого элемента
        // при расчёте сходств используется ДРУГОЙ overlap (количество пользователей оценивших ОБА фильма)
        const recommendations:CFNBItemItemRecommendationT[] = []
        for (const candidate of candidates){
            // рекомендуемый элемент
            const target = candidate.target
            if (recommendations.findIndex(rec=>rec.target==target)!=-1) continue;

            // фильмы пользователя
            const sources = candidates.filter(p=>p.target == target).slice(0,neighbors_size)
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
        return recommendations
    }
    #prettyRecommendations(sortedRecs:CFNBItemItemRecommendationT[]){
        return sortedRecs.map(rec=>{
            // const targetData = moviesData.find(m=>m.id==rec.target)!
            return {
                movieId: rec.target,
                // posterPath: targetData.poster_path,
                // title: targetData.title,
                predictedRating: rec.predictedRating,
                recommendedByMovies: rec.sources.map(s=>{
                    // const sourceData = moviesData.find(m=>m.id==s.id)!
                    return {
                        movieId: s.id,
                        similarity:s.similarity,
                        // posterPath: sourceData.poster_path,
                        // title: sourceData.title,
                        rating: s.rating
                    }
                })
            }
        })
    }
    //def recommend_items_by_ratings(self, user_id, active_user_items, num=6)
}