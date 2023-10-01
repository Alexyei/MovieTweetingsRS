import {BuilderRunner} from "../builders/buildersRunner";
import {re} from "mathjs";
import {PopulateRunner} from "../seeders/populateRunner";

const subject = process.argv[2];
const params = process.argv.slice(3)

const runners = [
    {
        keywords: ['seed', 'populate'],
        runner: (args:string[])=>new PopulateRunner().run(args)
    },
    {
        keywords: ['build', 'make'],
        runner: (args:string[])=>new BuilderRunner().run(args)
    }
]

function showHint() {
    console.log('Доступные основные параметры:');
    console.log('populate <name> - Запустить сидер');
    console.log('builder <name> - Запустить построитель');
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