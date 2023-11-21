import {BaseRunner} from "../scripts/base_runner";
import {backupMoviesSimilarity, backupUserEvents, backupUsersSimilarity, loadExampleUserEvents, loadImplicitRatings, loadMoviesSimilarity, loadUserEvents, loadUsersSimilarity} from "./backup";


export class  BackupRunner extends BaseRunner {
    _runners  = [
        {
            args: ['simm'],
            runner: ()=>backupMoviesSimilarity().then()
        },
        {
            args: ['simu'],
            runner: ()=>backupUsersSimilarity().then()
        },
        {
            args: ['events'],
            runner: ()=>backupUserEvents().then()
        },
        {
            args: ['simm','load'],
            runner: ()=>loadMoviesSimilarity().then()
        },
        {
            args: ['simu','load'],
            runner: ()=>loadUsersSimilarity().then()
        },
        {
            args: ['irate','load'],
            runner: ()=>loadImplicitRatings().then()
        },
        {
            args: ['events','load'],
            runner: ()=>loadUserEvents().then()
        },
        {
            args: ['events','load','example'],
            runner: ()=>loadExampleUserEvents().then()
        },
    ]

    showHint() {
        console.log('Доступные параметры:');
        console.log('simm - сделать резервную копию сходства элементов');
        console.log('simu - сделать резервную копию сходства пользователей');
        console.log('events - сделать резервную копию действий пользователей');
        console.log('simm load - загрузить резервную копию сходства элементов');
        console.log('simu load - загрузить резервную копию сходства пользователей');
        console.log('irate load - загрузить контрольные неявные оценки');
        console.log('events load - загрузить резервную копию действий пользователей');
        console.log('events load example - загрузить контрольные действия пользователей');
        console.log('help - Справка по параметрам');
    }
}

