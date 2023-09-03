import winston from "winston";

export function createBasicLogger(loggerName: string){
    return winston.createLogger({
        transports: [
            new winston.transports.File({
                filename: `./src/logger/output/${loggerName}_info.log`, level: 'info', options: {flags: 'w'},
                format: winston.format.combine(winston.format.timestamp(), winston.format.json())
            }),
            new winston.transports.File({
                filename: `./src/logger/output/${loggerName}_error.log`, level: 'error', options: {flags: 'w'},
                format: winston.format.combine(winston.format.timestamp(), winston.format.json())
            }),
            new winston.transports.Console({
                level: 'error',
                format: winston.format.simple(),
            })
        ]
    });
}

