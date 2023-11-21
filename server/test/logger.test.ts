import {createPinoLogger} from "../src/logger/pino_basic_logger";

test('two logger',()=>{
    const loggerA = createPinoLogger("A")
    loggerA.info({'msg':'🎈🎈A',date:Date.now()});
    loggerA.error('Это сообщение будет записано в файл error.log');
    const loggerB = createPinoLogger("B")
    loggerB.info({'msg':'🎈🎈B',date:Date.now()});
    loggerB.error('B Это сообщение будет записано в файл error.log');
})