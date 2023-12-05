import {BaseRecommender} from "./base_recommender";
import {getDAO} from "../DAO/DAO";

const dao = getDAO(false)
export class PopularityRecommender extends BaseRecommender {
    async predictScore(userId: number, movieId: string) {
        return dao.rating.getAvgRatingForUser(userId, movieId)
    }
    //recommend_items_by_ratings
    async predictScoreForMovies(moviesIds:string[],take=10){
        return (await dao.rating.getAvgAndCountByMovieIds(moviesIds, take)).map(score => ({predictedRating: score.avg || 0, usersCount: score.count, movieId:score.movieId}))
    }
    async recommendItems(userId: number, take: number = 10) {
        const popItems = (await dao.rating.getAvgAndCountMoviesForUser(userId,take)).map(score => ({predictedRating: score.avg || 0, usersCount: score.count, movieId:score.movieId}))

        // const movieIds =popItems.map((item) =>item.movieId)
        // const moviesData = await dao.movie.getMoviesDataByIds(movieIds)

        return popItems.map(movie=>{
            return {
                movieId: movie.movieId,
                usersCount: movie.usersCount,
                predictedRating: movie.predictedRating
            }
        })
    }
    //recommend_items_from_log
    async recommendBestSellers(userId: number, take: number = 10) {
        const popItems = await dao.userEvent.getPurchasesForUser(userId,take)
        const movieIds = popItems.map(m=>m.movieId) as string[]

        const predictedScore = await this.predictScoreForMovies(movieIds,take)


        // const moviesData = await dao.movie.getMoviesDataByIds(movieIds)

        return popItems.map(m=>{
            const score = predictedScore.find(movie=>m.movieId==movie.movieId)!

            return {
                purchasesCount: m.count,
                ...score
            }
        }).sort((a,b) => {
            if (a.purchasesCount < b.purchasesCount) {
                return 1;
            }
            if (a.purchasesCount > b.purchasesCount) {
                return -1;
            }


            if (a.predictedRating < b.predictedRating) {
                return 1;
            }
            if (a.predictedRating > b.predictedRating) {
                return -1;
            }


            return 0;
        })
    }

}