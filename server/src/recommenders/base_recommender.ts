export class BaseRecommender {
    constructor() {
        if (this.constructor == BaseRecommender) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    async predictScore(userId:number, movieId:string):Promise<any> {
        throw new Error("Method 'predictScore(userId:number, movieId:string)' must be implemented.");
    }

    async recommendItems(userId:number, take:number=10):Promise<any> {
        throw new Error("Method 'recommendItems(userId:number)' must be implemented.");
    }
}