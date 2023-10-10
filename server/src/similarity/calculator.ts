import {OtiaiMovieSimilarityCalculator} from "./otiai/movies_calculator";
import {OtiaiUserSimilarityCalculator} from "./otiai/users_calculator";

class SimilarityCalculator{
    readonly #movies: { otiai: OtiaiMovieSimilarityCalculator };
    readonly #users: { otiai: OtiaiUserSimilarityCalculator };

    constructor(){
        this.#movies = {
            'otiai': new OtiaiMovieSimilarityCalculator()
        }
        this.#users = {
            'otiai': new OtiaiUserSimilarityCalculator()
        }
    }

    get movies(){
        return this.#movies
    }

    get users(){
        return this.#users
    }
}

let calculatorInstance: SimilarityCalculator | null = null;

export function getSimilarityCalculator(){
    if (calculatorInstance) return calculatorInstance;

    calculatorInstance = new SimilarityCalculator();
    return calculatorInstance;
}