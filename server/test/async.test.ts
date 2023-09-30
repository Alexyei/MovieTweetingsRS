import {beforeAll, expect, test} from "vitest";
import {run} from "node:test";

test('async conveyor',async ()=>{
    async function* generateSequence(start:number, end:number) {

        for (let i = start; i <= end; i++) {

            // ура, можно использовать await!
            await new Promise(resolve => setTimeout(resolve, 500));

            yield {i,j:i**2};
        }

    }

    async function runWorker(i:number,j:number){
        await new Promise((resolve) => {
            setTimeout(resolve, 5000);
        });
        console.log(i,j,'finished')
    }

    async function runThread(runWorker:(i: number, j: number)=>Promise<any>, generator:AsyncGenerator<{i: number, j: number}>){
        const data = await generator.next()
        if (data.done) return;

        console.log(data.value.i,data.value.j,'started')
        await runWorker(data.value.i,data.value.j)
        return runThread(runWorker, generator)
    }
    const generator = generateSequence(1,10)
    const maxThread = 4;
    const threads = []
    for(let i=0;i<maxThread;++i){
        threads.push(runThread(runWorker,generator))
    }
    await Promise.all(threads)
    console.log('done threads')
})