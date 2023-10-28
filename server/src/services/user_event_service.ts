import {getDAO} from "../DAO/DAO";
import {TypeEvent} from "@prisma/client";
import {ApiError} from "../exceptions/api_errors";

const dao = getDAO(false);
class UserEventService {
    async create(userId:number,movieId:string|null,genreId:number|null,type:TypeEvent,sessionId:string) {
        const events = await dao.userEvent.getUserEvents(userId)
        if (movieId){
            const thisMovieEvents = events.filter(e=>e.movieId)
            if (type == "ADD_TO_FAVORITES_LIST") {
                const addCount = thisMovieEvents.filter(e => e.event == "ADD_TO_FAVORITES_LIST")[0]._count.event
                const removeCount = thisMovieEvents.filter(e => e.event == "REMOVE_FROM_FAVORITES_LIST")[0]._count.event
                if (addCount != 0 && removeCount < addCount)
                    throw ApiError.BadRequest('Элемент уже в списке');
            }
            if (type == "REMOVE_FROM_FAVORITES_LIST") {
                const addCount = thisMovieEvents.filter(e => e.event == "ADD_TO_FAVORITES_LIST")[0]._count.event
                const removeCount = thisMovieEvents.filter(e => e.event == "REMOVE_FROM_FAVORITES_LIST")[0]._count.event
                if (removeCount == addCount)
                    throw ApiError.BadRequest('Элемент уже удалён');
            }
            if (type == "BUY") {
                const buyCount = thisMovieEvents.filter(e => e.event == "BUY")[0]._count.event
                if (buyCount != 0)
                    throw ApiError.BadRequest('Элемент уже куплен');
            }
        }

        return await dao.userEvent.saveOne({userId:userId,movieId:movieId,genreId:genreId,event:type,sessionId});
    }

}

const userEventService = new UserEventService()
export default userEventService;