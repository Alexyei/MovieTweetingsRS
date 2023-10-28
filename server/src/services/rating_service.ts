import {getDAO} from "../DAO/DAO";

const dao = getDAO(false);
class RatingService {
    async rate(userID:number,movieID:string,rating:number) {
        return await dao.rating.saveOne({authorId:userID,movieId:movieID,rating,type:"EXPLICIT"})
    }

}

const ratingService = new RatingService()
export default ratingService;