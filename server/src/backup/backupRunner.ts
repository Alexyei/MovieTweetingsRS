import {BaseRunner} from "../scripts/base_runner";
import {backupMoviesSimilarity, backupUsersSimilarity, loadMoviesSimilarity, loadUsersSimilarity} from "./backup";


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
            args: ['simm','load'],
            runner: ()=>loadMoviesSimilarity().then()
        },
        {
            args: ['simu','load'],
            runner: ()=>loadUsersSimilarity().then()
        },
    ]

    showHint() {
        console.log('Доступные параметры:');
        console.log('simm - сделать резервную копию сходства элементов');
        console.log('simu - сделать резервную копию сходства пользователей');
        console.log('simm load - загрузить резервную копию сходства элементов');
        console.log('simu load - загрузить резервную копию сходства пользователей');
        console.log('help - Справка по параметрам');
    }
}

