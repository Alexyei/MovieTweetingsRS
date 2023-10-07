import getMoviesSimilarityDAO from "./tables/moviesSimilarity/movie_similarity_dao";
import {PrismaClient} from "@prisma/client";
import getMovieDAO from "./tables/movie/movie_dao";
import getUserDAO from "./tables/user/user_dao";
import getRatingDAO from "./tables/rating/rating_dao";
import getPriorityRatingDAO from "./tables/priorityRating/priority_rating_dao";



class DAO {
    _testDb:boolean
    _client = new PrismaClient()
    readonly #moviesSimilarity: ReturnType<typeof getMoviesSimilarityDAO>
    readonly #movie: ReturnType<typeof getMovieDAO>
    readonly #user: ReturnType<typeof getUserDAO>
    readonly #rating: ReturnType<typeof getRatingDAO>
    readonly #priorityRating: ReturnType<typeof getPriorityRatingDAO>
    constructor(testDb:boolean) {
        this._testDb = testDb
        this.#moviesSimilarity = getMoviesSimilarityDAO(this._client,this._testDb)
        this.#movie = getMovieDAO(this._client,this._testDb)
        this.#user = getUserDAO(this._client,this._testDb)
        this.#rating = getRatingDAO(this._client,this._testDb)
        this.#priorityRating = getPriorityRatingDAO(this._client,this._testDb)
    }

    get moviesSimilarity(){
        return this.#moviesSimilarity
    }

    get movie(){
        return this.#movie
    }

    get user(){
        return this.#user
    }

    get rating(){
        return this.#rating
    }

    get priorityRating(){
        return this.#priorityRating
    }
}

let testDAOInstance:DAO | null = null
let realDAOInstance:DAO | null = null

export function getDAO(testDB:boolean) {
    if (testDB){
        if (testDAOInstance) return testDAOInstance;
        testDAOInstance = new DAO(true)
        // console.log('create test DAO instance')
        return testDAOInstance
    }

    if (realDAOInstance) return realDAOInstance;
    realDAOInstance = new DAO(false)
    // console.log('create real DAO instance')
    return realDAOInstance
}

// new DAO(true).moviesSimilarity.count()
// new DAO(false).moviesSimilarity.count()