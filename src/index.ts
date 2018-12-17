import express from 'express';
import winston from 'winston';
import statusRouter from './Routes/status';
import tagRouter from './Routes/tags';
import { connect } from 'mongoose';
import dotenv from 'dotenv';
import bodyParser = require('body-parser');
import { logRequest } from './Middleware/logging';

dotenv.config();

export const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [ new winston.transports.Console({ format: winston.format.simple() }) ]
});

const application = express();
const PORT = process.env.port || 8123;
const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
const db = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;

connect(db, { useNewUrlParser: true })
    .then(() => {
        logger.info(`Connected to "${db}"`);
    })
    .catch(({ name , message }) => {
        logger.error(`"${db}" ${message}`);
    });

application.use(bodyParser.json());
application.use(logRequest(logger));
application.use(statusRouter());
application.use(tagRouter());

application.listen(PORT, () => {
    logger.info(`API Server listening on ${PORT}`);
});

