import {BaseRunner} from "../scripts/base_runner";
import {buildImplicitRatings} from "./calculate_implicit_ratings";
import {buildImplicitRatingsWithTimeDecay} from "./calculate_implicit_ratings_timedecay";
import {
    buildMoviesOtiaiSimilarityChunkedWithWorkersAsyncConveyor,
    buildMoviesOtiaiSimilarityChunkedWithWorkers, buildMoviesOtiaiSimilarityChunked,
} from "./calculate_movies_otiai_similarity_chunked";
import {buildMoviesOtiaiSimilarity} from "./calculate_movies_otiai_similarity";
import {buildUsersOtiaiSimilarity} from "./calculate_users_otiai_similarity";



export class BuilderRunner extends BaseRunner {
    _runners  = [
        {
            args: ['imp','ratings'],
            runner: ()=>buildImplicitRatings().then()
        },
        {
            args: ['imp','ratings','time'],
            runner: ()=>buildImplicitRatingsWithTimeDecay().then()
        },
        {
            args: ['sim','otiai','m'],
            runner: ()=>buildMoviesOtiaiSimilarity().then()
        },
        {
            args: ['sim','otiai','m','c'],
            runner: ()=>buildMoviesOtiaiSimilarityChunked(200).then()
        },
        {
            args: ['sim','otiai','m','cw'],
            runner: ()=>buildMoviesOtiaiSimilarityChunkedWithWorkers(800,11,0.2,2).then()
        },
        {
            args: ['sim','otiai','m','cwc'],
            runner: ()=>buildMoviesOtiaiSimilarityChunkedWithWorkersAsyncConveyor(800,11,0.2,2).then()
        },
        {
            args: ['sim','otiai','u'],
            runner: ()=>buildUsersOtiaiSimilarity().then()
        },
    ]

    showHint() {
        console.log('Доступные параметры:');
        console.log('imp ratings - Генерация неявных оценок');
        console.log('imp ratings time - Генерация неявных оценок (временное затухание)');
        console.log('sim otiai movies - срасчёт сходства Отиаи для элементов')
        console.log('sim otiai movies chunk - срасчёт сходства Отиаи для элементов по частям')
        console.log('sim otiai movies chunk workers - срасчёт сходства Отиаи для элементов по частям (с распаралеливанием)')
        console.log('sim otiai users - срасчёт сходства Отиаи для пользователей')
        console.log('help - Справка по параметрам');
    }
}

