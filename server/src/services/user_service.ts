import {getDAO} from "../DAO/DAO";

const dao = getDAO(false);
class UserService {
    async getUserFilms(requestUserID:number, sessionUserID:number) {
        const userID = requestUserID || sessionUserID
        const ratings = await dao.rating.getByUserId(userID)
        const events = await dao.userEvent.getUserEvents(userID)


        return {
            rated: ratings.map(r=>({id:r.movieId,rating:r.rating})),
            purchased: events.filter(e=>e.event == 'BUY').map(e=>({id:e.movieId})),
            liked: events.filter(e=>{
                if (e.event == 'ADD_TO_FAVORITES_LIST'){
                    const addCount = e._count.event
                    const remove = events.find(v=>v.event == 'REMOVE_FROM_FAVORITES_LIST' && v.movieId == e.movieId)
                    const removeCount = remove ? remove._count.event : 0

                    return addCount > removeCount
                }
                return false
            }).map(e=>({id:e.movieId}))
        }
    }

    async searchUsers(searchInput:string){
        const results = []
        let take = 10
        const id = Number(searchInput)
        if (!isNaN(id)){
            const user = await dao.user.getUserByID(id)
            if (user){
                results.push(user)
                take-=1
            }
        }

        const users = await dao.user.searchUsers(searchInput,take)

        return [...results,...users]
    }

    async getUsersData(userIDs:number[]){
        return dao.user.getUsersDataByIds(userIDs)
    }

    async getUserSimilarities(userID:number){
        return dao.userSimilarity.getSimilarityForUser(userID)
    }

}

const userService = new UserService()
export default userService;