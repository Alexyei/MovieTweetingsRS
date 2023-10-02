import {beforeAll, expect, test} from "vitest";

test('async conveyor',async ()=>{
    async function* generateSequence(start:number, end:number) {

        for (let i = start; i <= end; i++) {

            // ура, можно использовать await!
            await new Promise(resolve => setTimeout(resolve, 500));

            yield {i,j:i**2};
        }

    }
    function zerosM(rows: number, columns: number):number[][] {
        return Array(rows).fill(0).map(() => Array(columns).fill(0));
    }
    async function runWorker(i:number,j:number){
        await new Promise((resolve) => {

            setTimeout(resolve, 5000);
        });
        console.log(i,j,'finished')
    }

    async function runThread(runWorker:(i: number, j: number)=>Promise<any>, generator:AsyncGenerator<{i: number, j: number}>){
        let done = false;

        while (!done) {
            const data = await generator.next();
            done = data.done!;

            if (!done) {
                console.log(data.value.i, data.value.j, 'started');
                await runWorker(data.value.i, data.value.j);
            }
        }
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