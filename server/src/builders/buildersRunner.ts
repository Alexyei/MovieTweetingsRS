import {BaseRunner} from "../scripts/base_runner";
import { buildAssociationRules } from "./association_rules";
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
            args: ['ar',],
            runner: ()=>buildAssociationRules(0.01,0)
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
            runner: ()=>buildSimilarityForMoviesOtiaiByChunksWithWorkersAsyncConveyor(1550,4,0.05,16).then()
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
            runner: ()=>buildSimilarityForUsersOtiaiByChunksWithWorkersAsyncConveyor(3000,4,0.05,10).then()
        },
    ]

    showHint() {
        console.log('Доступные параметры:');
        console.log('ar - Расчёт ассоциативных правил');
        console.log('imp ratings - Генерация неявных оценок');
        console.log('imp ratings time - Генерация неявных оценок (временное затухание)');
        console.log('sim otiai movies - Расчёт  сходства Отиаи для элементов')
        console.log('sim otiai movies chunk - Расчёт  сходства Отиаи для элементов по частям')
        console.log('sim otiai movies chunk workers - Расчёт сходства Отиаи для элементов по частям (с распаралеливанием)')
        console.log('sim otiai users - Расчёт сходства Отиаи для пользователей')
        console.log('help - Справка по параметрам');
    }
}

