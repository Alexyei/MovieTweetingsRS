import {getDAO} from "../DAO/DAO";
import {ApiError} from "../exceptions/api_errors";
import {MovieOrderingT} from "../types/movie.types";

const dao = getDAO(false);
class MovieService {
    async movies(moviesIDs: string[]) {
        moviesIDs.forEach(id=>{
            if (id.length > 20)
                throw ApiError.BadRequest('Неверный id');
        })


        return await dao.movie.getFullMoviesDataByIds(moviesIDs);
    }

    async movie(movieID: string) {
        const movie = (await this.movies([movieID]))[0]

        if (!movie) throw ApiError.BadRequest(`Фильм с id:${movieID} не найден`);

        return movie;
    }

    async search(searchRequest:string,yearFrom:number,yearTo:number,genreIDs:number[],ordering:MovieOrderingT,take:number,skip:number){
        return await dao.movie.searchMovies(searchRequest,yearFrom,yearTo,genreIDs,ordering,take,skip)
    }
}

const movieService = new MovieService()
export default movieService;