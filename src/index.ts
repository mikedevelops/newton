import express from 'express';
import statusRouter from './Routers/statusRouter';
import tagRouter from './Routers/tagsRouter';
import dotenv from 'dotenv';
import bodyParser = require('body-parser');
import { logRequest } from './Middleware/logging';
import { logger } from './Services/logger';
import { connectToDatabase } from './Services/database';
import http = require('http');

dotenv.config();

export const application = express();
export const server = new http.Server(application);
const PORT = process.env.DYNAMIC_PORT ? 0 : process.env.PORT || 8123;

(async function () {
    await connectToDatabase();

    application.use(bodyParser.json());
    application.use(logRequest(logger));
    application.use(statusRouter());
    application.use(tagRouter());

    server.listen(PORT, () => {
        logger.info(`API Server listening on ${PORT}`);
    });

    application.emit('ready');
})();

