import {BaseRunner} from "../scripts/base_runner";
import {buildImplicitRatings} from "./calculate_implicit_ratings";
import {buildImplicitRatingsWithTimeDecay} from "./calculate_implicit_ratings_timedecay";
import {
    buildSimilarityForMoviesOtiai,
    buildSimilarityForMoviesOtiaiByChunks,
    buildSimilarityForMoviesOtiaiByChunksWithWorkers, buildSimilarityForMoviesOtiaiByChunksWithWorkersAsyncConveyor
} from "./similarity_movies_otiai";
import {
    buildSimilarityForUsersOtiai,
    buildSimilarityForUsersOtiaiByChunks,
    buildSimilarityForUsersOtiaiByChunksWithWorkers, buildSimilarityForUsersOtiaiByChunksWithWorkersAsyncConveyor
} from "./similarity_users_otiai";



export class  BuilderRunner extends BaseRunner {
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
            runner: ()=>buildSimilarityForMoviesOtiai().then()
        },
        {
            args: ['sim','otiai','m','c'],
            runner: ()=>buildSimilarityForMoviesOtiaiByChunks(200).then()
        },
        {
            args: ['sim','otiai','m','cw'],
            runner: ()=>buildSimilarityForMoviesOtiaiByChunksWithWorkers(800,11,0.2,2).then()
        },
        {
            args: ['sim','otiai','m','cwc'],
            runner: ()=>buildSimilarityForMoviesOtiaiByChunksWithWorkersAsyncConveyor(800,11,0.2,2).then()
        },
        {
            args: ['sim','otiai','u'],
            runner: ()=>buildSimilarityForUsersOtiai().then()
        },
        {
            args: ['sim','otiai','u','c'],
            runner: ()=>buildSimilarityForUsersOtiaiByChunks(800).then()
        },
        {
            args: ['sim','otiai','u','cw'],
            runner: ()=>buildSimilarityForUsersOtiaiByChunksWithWorkers(1500,11,0.2,2).then()
        },
        {
            args: ['sim','otiai','u','cwc'],
            runner: ()=>buildSimilarityForUsersOtiaiByChunksWithWorkersAsyncConveyor(1500,11,0.2,2).then()
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

