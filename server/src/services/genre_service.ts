import {getDAO} from "../DAO/DAO";
import {ApiError} from "../exceptions/api_errors";

const dao = getDAO(false);
class GenreService {
    async genres() {
        return await dao.genre.getGenresWithMoviesCount();
    }

    async genreData(genreName:string){
        if (!genreName || genreName.length > 30) throw ApiError.BadRequest('Недопустимое название жанра');

        const genreData = await dao.genre.getGenreDataByName(genreName)
        if (!genreData) throw ApiError.BadRequest(`Жанр ${genreName} не найден`);
        return genreData
    }

}

const genreService = new GenreService()
export default genreService;