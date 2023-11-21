import {BaseRunner} from "../scripts/base_runner";
import {populateLogs} from "./populate_logs";
import {populateMovies} from "./populate_movies";
import {populateMovieDescriptions} from "./populate_movies_descriptions";
import { populatePurchases } from "./populate_purchases";
import {populateRatings} from "./populate_ratings";

export class PopulateRunner extends BaseRunner {
    _runners = [
        {
            args: ['movies'],
            runner: ()=>populateMovies()
        },
        {
            args: ['descriptions'],
            runner: ()=>populateMovieDescriptions()
        },
        {
            args: ['ratings'],
            runner: ()=>populateRatings()
        },
        {
            args: ['logs'],
            runner: ()=>populateLogs()
        },
        {
            args: ['purchases'],
            runner: ()=>populatePurchases()
        }
    ]
    showHint(){
        console.log('Доступные параметры:');
        console.log('movies - Загрузить данные о фильмах');
        console.log('descriptions - Загрузить описания фильмов и их постеры');
        console.log('ratings - Загрузить явные оценки')
        console.log('logs - Сгенерировать события пользователей')
        console.log('purchases - Сгенерировать события покупок (для ассоциативных правил)')
        console.log('help - Справка по параметрам');
    }
}