import {config} from "dotenv";
import {getDAO} from "../DAO/DAO";
import {ApiError} from "../exceptions/api_errors";

config()
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
}

const movieService = new MovieService()
export default movieService;