import {RatingT, UserAvgRatingT} from "../../types/rating.types";
import {MovieSimilarityT, UserSimilarityT} from "../../types/similarity.types";
import ProgressBar from "progress";
import {createPinoLogger} from "../../logger/pino_basic_logger";
import {Worker} from "worker_threads";

type simCalculatedCallbackT<idT extends string | number> = (sims: idT extends string ? MovieSimilarityT[] : UserSimilarityT[]) => Promise<any>
type WorkerDataT<idT extends string | number> = {
    minSims: number,
    minOverlap: number,
    chunkUniqueIds: idT[],
    usersData: UserAvgRatingT[],
    ratings: RatingT[],
    simsCalculatedCallback: simCalculatedCallbackT<idT>
}
type GeneralWorkerDataT<idT extends string | number> = Omit<WorkerDataT<idT>, 'chunkUniqueIds' | 'ratings'>
type PreprocessDataForChunkT<idT extends string | number> = (usersData: UserAvgRatingT[],chunkUniqueIds: idT[],ratings: RatingT[])=> {ratingsTable: number[][], usersMean: number[]}
type calculateSimsForChunkT<idT extends string | number> = (ratingsTable: number[][], usersMean: number[], chunkUniqueIds: idT[], minSims: number,minOverlap: number)=>idT extends string ? MovieSimilarityT[] : UserSimilarityT[]
type IOParamsT<idT extends string | number> = {
    usersData: UserAvgRatingT[],
    uniqueIds: idT[],
    getRatingsForChunk: (ids: idT[]) => Promise<RatingT[]>,
    simsCalculatedCallback: simCalculatedCallbackT<idT>
}
type OtherParamsT = {
    chunkSize:number,
    minSims:number,
    minOverlap:number
}
export class BaseOtiaiSimilarityCalculator {
    _getChunksCount<idT extends string | number>(uniqueIds: idT[], chunkSize: number) {
        return Math.ceil(uniqueIds.length / chunkSize)
    }

    _getProgressBar(chunksCount: number) {
        return new ProgressBar(":bar :current/:total", {total: chunksCount * (chunksCount - 1) / 2});
    }

    _getLogger() {
        const logger = createPinoLogger('otiai_movie_sims')
        logger.child({'type': 'asyncConveyor'})
        return logger
    }

    async* _generateDataForChunks<idT extends string | number>(uniqueIds: idT[], getRatingsForChunk: (ids: idT[]) => Promise<RatingT[]>, chunksCount: number, chunkSize: number) {
        for (let i = 0; i < chunksCount - 1; ++i) {
            for (let j = i + 1; j < chunksCount; ++j) {
                const chunkUniqueIds = uniqueIds
                    .slice(i * chunkSize, (i + 1) * chunkSize)
                    .concat(uniqueIds.slice(j * chunkSize, (j + 1) * chunkSize));
                const ratings = await getRatingsForChunk(chunkUniqueIds)

                yield {chunkUniqueIds, ratings, i, j}
            }
        }

    }

    async _runWorkerCalculation<idT extends string | number>(workerFilename: string, progressBar: ProgressBar, workerData: WorkerDataT<idT>) {
        return new Promise<void>((resolve, reject) => {
            const {simsCalculatedCallback, ...data} = workerData;
            const worker = new Worker(workerFilename, {
                workerData: {
                    ...data,
                    start: Date.now()
                }
            });

            worker.on('message', async (answer: any) => {
                const {chunkSims, start} = answer
                await simsCalculatedCallback(chunkSims);

                progressBar.tick();
                console.log(`Thread time: ${(Date.now() - start) / 1000} seconds`);
                worker.off('error', reject);
                // worker.off('exit', resolve);
                await worker.terminate(); // Завершаем worker после выполнения
                resolve()
            });

            worker.on('error', (error) => reject(error));
            // worker.on('exit', resolve);
            // worker.postMessage(); // Передаем данные в worker
        });
    }

    async _runThread<idT extends string | number>(workerFilename: string, generator: any, logger: any, progressBar: ProgressBar, threadId: number, workerData: GeneralWorkerDataT<idT>) {

        while (true) {
            const start = Date.now()
            const {value, done} = await generator.next()
            if (done!) break;
            const {chunkUniqueIds, ratings, i, j} = value
            console.log(`Get data time: ${(Date.now() - start) / 1000} seconds`);

            try {
                await this._runWorkerCalculation(workerFilename, progressBar, {
                    chunkUniqueIds,
                    ratings,
                    ...workerData
                })
                logger.info({msg: 'success', thread: threadId, i, j})
            } catch (error) {
                logger.error({msg: 'error', thread: threadId, i, j})
                logger.error(error)
            }

        }
    }

    async _calculateByChunks<idT extends string | number>(preprocessDataForChunk:PreprocessDataForChunkT<idT>,calculateSimsForChunk:calculateSimsForChunkT<idT>, IOParams:IOParamsT<idT>, otherParams:OtherParamsT) {
        const {usersData,uniqueIds,getRatingsForChunk,simsCalculatedCallback} = IOParams
        const {chunkSize,minSims,minOverlap} = otherParams
        if (usersData.length == 0) return;
        const nChunks = this._getChunksCount(uniqueIds, chunkSize)
        const progressBar = this._getProgressBar(nChunks)
        const generator = this._generateDataForChunks(uniqueIds, getRatingsForChunk, nChunks, chunkSize)

        while (true) {
            const {value, done} = await generator.next()
            if (done!) break;
            const {chunkUniqueIds, ratings, i, j} = value
            const {ratingsTable, usersMean} = preprocessDataForChunk(usersData, chunkUniqueIds, ratings)
            const chunkSims = calculateSimsForChunk(ratingsTable, usersMean, chunkUniqueIds, minSims, minOverlap)
            await simsCalculatedCallback(chunkSims)
            progressBar.tick()
        }
    }

    async _calculateByChunksWithWorkers<idT extends string | number>(workerFilename: string, IOParams:IOParamsT<idT>, otherParams:OtherParamsT & {maxThreads: number}) {
        const {usersData,uniqueIds,getRatingsForChunk,simsCalculatedCallback} = IOParams
        const {chunkSize,minSims,minOverlap,maxThreads} = otherParams
        if (usersData.length == 0) return;
        const nChunks = this._getChunksCount(uniqueIds, chunkSize)
        const progressBar = this._getProgressBar(nChunks)

        const generator = this._generateDataForChunks(uniqueIds, getRatingsForChunk, nChunks, chunkSize)

        let workers = [];
        while (true) {
            const {value, done} = await generator.next()
            if (done!) break;

            if (workers.length >= maxThreads) {
                await Promise.all(workers);
                workers = []
            }
            const {chunkUniqueIds, ratings} = value
            const workerData = {chunkUniqueIds, ratings, usersData, minSims, minOverlap, simsCalculatedCallback}
            workers.push(this._runWorkerCalculation<idT>(workerFilename, progressBar, workerData));
        }
        await Promise.all(workers);
    }

    async _calculateByChunksWithWorkersAsyncConveyor<idT extends string | number>(workerFilename: string,IOParams:IOParamsT<idT>, otherParams:OtherParamsT & {maxThreads: number}) {
        const {usersData,uniqueIds,getRatingsForChunk,simsCalculatedCallback} = IOParams
        const {chunkSize,minSims,minOverlap,maxThreads} = otherParams
        if (usersData.length == 0) return;
        const nChunks = this._getChunksCount(uniqueIds, chunkSize)
        const progressBar = this._getProgressBar(nChunks)

        const generator = this._generateDataForChunks(uniqueIds,getRatingsForChunk,nChunks,chunkSize)
        const logger = this._getLogger()

        let workers = [];
        for (let i = 0; i < maxThreads; ++i) {
            const workerData = {minSims,minOverlap,usersData,simsCalculatedCallback}
            workers.push(this._runThread<idT>(workerFilename,generator,logger, progressBar,i,workerData))
        }

        await Promise.all(workers);
    }
}