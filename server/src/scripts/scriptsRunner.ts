import {BuilderRunner} from "../builders/buildersRunner";
import {PopulateRunner} from "../seeders/populateRunner";
import {BackupRunner} from "../backup/backupRunner";

const subject = process.argv[2];
const params = process.argv.slice(3)

const runners = [
    {
        keywords: ['seed', 'populate','pop'],
        runner: (args:string[])=>new PopulateRunner().run(args)
    },
    {
        keywords: ['build', 'make'],
        runner: (args:string[])=>new BuilderRunner().run(args)
    },
    {
        keywords: ['backup','back'],
        runner: (args:string[])=>new BackupRunner().run(args)
    }
]

function showHint() {
    console.log('Доступные основные параметры:');
    console.log('populate <name> - Запустить сеятель');
    console.log('build  <name> - Запустить построитель');
    console.log('backup <name> - Сделать резервную копию таблицы из БД');
    console.log('<main_parametr> help - Справка по основному параметру');
}

function run(){
    if (!subject || subject == 'help') {
        showHint()
        return
    }

    for (const runner of runners) {
        if (runner.keywords.includes(subject)){
            runner.runner(params)
            return
        }

    }
    showHint()
}

run()