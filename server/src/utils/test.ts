import {deleteAllRatings} from "../DAO/ratings";
import {deleteAllMoviesSimilarity} from "../DAO/movie_similarity";
import {deleteAllMovies} from "../DAO/movie";
import {deleteAllUsers} from "../DAO/user";
import {deleteAllUsersSimilarity} from "../DAO/user_similarity";

export async function flushTestDB(){
    await deleteAllRatings(true)
    await deleteAllMoviesSimilarity(true)
    await deleteAllUsersSimilarity(true)
    await deleteAllMovies(true)
    await deleteAllUsers(true)
}