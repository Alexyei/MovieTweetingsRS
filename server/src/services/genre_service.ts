import {getDAO} from "../DAO/DAO";
import {ApiError} from "../exceptions/api_errors";
import userService from "./user_service";

const dao = getDAO(false);
class GenreService {
    async genres() {
        return await dao.genre.getGenresWithMoviesCount();
    }

    async all(){
        return await dao.genre.all();
    }

    async genreData(genreName:string){
        if (!genreName || genreName.length > 30) throw ApiError.BadRequest('Недопустимое название жанра');

        const genreData = await dao.genre.getGenreDataByName(genreName)
        if (!genreData) throw ApiError.BadRequest(`Жанр ${genreName} не найден`);
        return genreData
    }

    async userRatingsDataByGenres(userID:number){
        const genresWithIDs = await dao.genre.getGenresWithMoviesIDs()
        const userGlobalAvgAndCount = await dao.rating.getAvgAndCountByMovieIdsForUser(userID)
        const genresData = await Promise.all(genresWithIDs.map(async (genre)=>{
            const allAvgAndCount = await dao.rating.getAvgAndCountByMovieIdsWithoutUser(userID,genre.moviesIDs)
            const userAvgAndCount = await dao.rating.getAvgAndCountByMovieIdsForUser(userID,genre.moviesIDs)

            return {
                id: genre.id,
                name: genre.name,
                explicit: {
                    allAvg: allAvgAndCount.find(el=>el.type=='EXPLICIT')?.avg || 0,
                    allCount: allAvgAndCount.find(el=>el.type=='EXPLICIT')?.count || 0,
                    userAvg: userAvgAndCount.find(el=>el.type=='EXPLICIT')?.avg || 0,
                    userCount: userAvgAndCount.find(el=>el.type=='EXPLICIT')?.count || 0,
                },
                implicit: {
                    allAvg: allAvgAndCount.find(el=>el.type=='IMPLICIT')?.avg || 0,
                    allCount: allAvgAndCount.find(el=>el.type=='IMPLICIT')?.count || 0,
                    userAvg: userAvgAndCount.find(el=>el.type=='IMPLICIT')?.avg || 0,
                    userCount: userAvgAndCount.find(el=>el.type=='IMPLICIT')?.count || 0,
                },
            }
        }))

        return {
            globalUser: {
                explicit: {
                    userAvg: userGlobalAvgAndCount.find(el=>el.type=='EXPLICIT')?.avg || 0,
                    userCount: userGlobalAvgAndCount.find(el=>el.type=='EXPLICIT')?.count || 0,
                },
                implicit: {
                    userAvg: userGlobalAvgAndCount.find(el=>el.type=='IMPLICIT')?.avg || 0,
                    userCount: userGlobalAvgAndCount.find(el=>el.type=='IMPLICIT')?.count || 0,
                }
            },
            genresData
        }
    }

    async userGenresCount(userID:number){
        const userFilms = await userService.getUserFilms(userID)
        const userRatings = await dao.priorityRating.allWithTypesByUserID(userID)



        const purchasedFilms = await dao.movie.getFullMoviesDataByIds(userFilms.purchased.map(p=>p.id!))
        const likedFilms= await dao.movie.getFullMoviesDataByIds(userFilms.liked.map(p=>p.id!))
        const explicitFilms = await dao.movie.getFullMoviesDataByIds(userRatings.explicit.map(r=>r.movieId!))
        const implicitFilms = await dao.movie.getFullMoviesDataByIds(userRatings.implicit.map(r=>r.movieId!))
        const priorityFilms = await dao.movie.getFullMoviesDataByIds(userRatings.priority.map(r=>r.movieId!))

        const genres = await dao.genre.getGenresWithMoviesCount()

        return genres.map(genre=>{

            return {
                id: genre.id,
                name: genre.name,
                collection: {
                    purchased: purchasedFilms.filter(m=>m.genres.some(g=>g.id==genre.id)).length,
                    liked: likedFilms.filter(m=>m.genres.some(g=>g.id==genre.id)).length,
                },
                ratings: {
                    explicit: explicitFilms.filter(m=>m.genres.some(g=>g.id==genre.id)).length,
                    implicit: implicitFilms.filter(m=>m.genres.some(g=>g.id==genre.id)).length,
                    priority: priorityFilms.filter(m=>m.genres.some(g=>g.id==genre.id)).length,
                }
            }
        })
    }
}

const genreService = new GenreService()
export default genreService;