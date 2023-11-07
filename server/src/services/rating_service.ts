import {getDAO} from "../DAO/DAO";

const dao = getDAO(false);
class RatingService {
    async rate(userID:number,movieID:string,rating:number) {
        return await dao.rating.saveOne({authorId:userID,movieId:movieID,rating,type:"EXPLICIT"})
    }

    async getRatingsDistribution(){
        const acc = {explicit:[],implicit:[],} as {explicit:{rating:number,count:number}[],implicit:{rating:number,count:number}[]}
        for(let i=0;i<10;++i){
            const count = await dao.rating.getFromRange(i,i+1)
            acc.explicit.push({
                rating: i+1,
                count: count.find(c=>c.type=='EXPLICIT')?.count || 0
            })
            acc.implicit.push({
                rating: i+1,
                count: count.find(c=>c.type=='IMPLICIT')?.count || 0
            })
        }

        return acc
    }
}

const ratingService = new RatingService()
export default ratingService;