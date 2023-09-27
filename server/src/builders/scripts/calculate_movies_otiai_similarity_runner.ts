import {createMoviesOtiaiSimilarity, loadRatings} from "../calculate_movies_otiai_similarity";

const ratings =
loadRatings().then(ratings=>createMoviesOtiaiSimilarity(ratings)).then()