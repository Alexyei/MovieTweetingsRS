import {BaseRunner} from "../scripts/base_runner";
import {populateLogs} from "./populate_logs";
import {populateMovies} from "./populate_movies";
import {populateMovieDescriptions} from "./populate_movies_descriptions";
import {populateRatings} from "./populate_ratings";

export class PopulateRunner extends BaseRunner {
    _runners = [
        {
            args: ['pop','movies'],
            runner: ()=>populateMovies()
        },
        {
            args: ['pop','movies','descriptions'],
            runner: ()=>populateMovieDescriptions()
        },
        {
            args: ['pop','movies','ratings'],
            runner: ()=>populateRatings()
        },
        {
            args: ['pop','movies','logs'],
            runner: ()=>populateLogs()
        }
    ]
    showLoading(){
        console.log('Доступные параметры:');
        console.log('pop movies - Загрузить данные о фильмах');
        console.log('pop movies descriptions - Загрузить описания фильмов и их постеры');
        console.log('pop ratings - Загрузить явные оценки')
        console.log('pop logs - Сгенерировать события пользователей')
        console.log('help - Справка по параметрам');
    }
}