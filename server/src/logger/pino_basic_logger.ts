import pino, {LevelWithSilent} from "pino";
// import pino_multi_stream from "pino-multi-stream";
import pretty from "pino-pretty";

export function createPinoLogger(loggerName: string){
    // Поток для записи ошибок в файл error.log
    const errorStream = pino.destination({dest:`./src/logger/output/${loggerName}_error.log`,sync:true});
    
// Поток для записи других сообщений в файл info.log
    const infoStream = pino.destination({dest:`./src/logger/output/${loggerName}_info.log`,append: false,sync:true});
    // const infoStream = fs.createWriteStream(`./src/logger/output/${loggerName}_info.log`,{flags: 'a'});
    
    const streams = [
        {stream: pretty()},
        { level: 'error' as LevelWithSilent, stream: errorStream },
        { level: 'info' as LevelWithSilent, stream: infoStream }
    ]
    // Настройка конфигурации логгера
    const logger = pino({
        level: 'info',
        formatters: {
            bindings: (bindings) => {
                return { pid: bindings.pid };
            },
            level: (label) => {
                return { level: label.toUpperCase() };
            },
        },
        timestamp: pino.stdTimeFunctions.isoTime,
    },pino.multistream(streams));

    return logger;
}