import express from 'express';
import statusRouter from './Routers/statusRouter';
import tagRouter from './Routers/tagsRouter';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser = require('body-parser');
import { logRequest } from './Middleware/logging';
import { logger } from './Services/logger';

dotenv.config();

export const application = express();
const PORT = process.env.DYNAMIC_PORT ? 0 : process.env.PORT || 8123;
const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
const db = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;

mongoose.connect(db, { useNewUrlParser: true, useFindAndModify: false })
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

