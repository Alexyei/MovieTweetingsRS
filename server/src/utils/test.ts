import {getDAO} from "../DAO/DAO";
import {readML100K} from "./csv";
import path from "path";
const dao = getDAO(true)
export async function flushTestDB(){
    await dao.rating.deleteAll()
    await dao.movieSimilarity.deleteAll()
    await dao.userSimilarity.deleteAll()
    await dao.movie.deleteAll()
    await dao.user.deleteAll()
}

export async function loadML100KDataSet(){
    const ratingsData = await readML100K(path.join(__dirname,'../../test/mocks/ML100K_ratings.csv'))
    const usersData = Array.from(new Set(ratingsData.map(r => r.authorId))).map(el => ({id: el}))
    const moviesData = Array.from(new Set(ratingsData.map(r => r.movieId))).map(id => ({
        id,
        title: id + "title",
        year: 2010
    }))

    await dao.user.saveMany(usersData)
    await  dao.movie.saveMany(moviesData)
    await dao.rating.saveMany(ratingsData)
}