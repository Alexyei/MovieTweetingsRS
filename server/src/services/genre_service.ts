import {getDAO} from "../DAO/DAO";

const dao = getDAO(false);
class GenreService {
    async genres() {
        return await dao.genre.getGenresWithMoviesCount();
    }

}

const genreService = new GenreService()
export default genreService;