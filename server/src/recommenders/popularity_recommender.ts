import {BaseRecommender} from "./base_recommender";
import {getDAO} from "../DAO/DAO";

const dao = getDAO(false)
export class PopularityRecommender extends BaseRecommender {
    async predictScore(userId: number, movieId: string) {
        return dao.rating.getAvgRatingForUser(userId, movieId)
    }
    //recommend_items_by_ratings
    async predictScoreForMovies(moviesIds:string[],take=10){
        return await dao.rating.getAvgAndCountByMovieIds(moviesIds, take)
    }
    async recommendItems(userId: number, take: number = 10) {
        const popItems = await dao.rating.getAvgAndCountMoviesForUser(userId,take)

        const movieIds =popItems.map((item) =>item.movieId)
        const moviesData = await dao.movie.getMoviesDataByIds(movieIds)

        return popItems.map(movie=>{
            const movieData = moviesData.find(m=>m.id == movie.movieId)!
            return {
                movieId: movieData.id,
                poster_path: movieData.poster_path,
                ratingsCount: movie.count,
                avgRating: movie.avg
            }
        })
    }
    //recommend_items_from_log
    async recommendBestSellers(userId: number, take: number = 10) {
        const popItems = await dao.userEvent.getPurchasesForUser(userId,take)
        const movieIds = popItems.map(m=>m.movieId) as string[]

        const predictedScore = await this.predictScoreForMovies(movieIds,take)


        const moviesData = await dao.movie.getMoviesDataByIds(movieIds)

        return popItems.map(m=>{
            const score = predictedScore.find(movie=>m.movieId==movie.movieId)!
            const data = moviesData.find(movie=>m.movieId==movie.id)!

            return {
                purchases: m.count,
                poster_path: data.poster_path,
                ...score
            }
        }).sort((a,b) => {
            if (a.purchases < b.purchases) {
                return 1;
            }
            if (a.purchases > b.purchases) {
                return -1;
            }

            // Если значения "name" одинаковы, сравниваем поле "age"
            if (a.avg! < b.avg!) {
                return 1;
            }
            if (a.avg! > b.avg!) {
                return -1;
            }


            return 0;
        })
    }

}