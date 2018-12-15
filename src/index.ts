import express from 'express';
import winston from 'winston';
import testRoute from './Routes/statusRoute';

const application = express();
const PORT = process.env.port || 8123;
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [ new winston.transports.Console({ format: winston.format.simple() }) ]
});

application.use(testRoute());

application.listen(PORT, () => {
    logger.info(`API Server listening on ${PORT}`);
});

