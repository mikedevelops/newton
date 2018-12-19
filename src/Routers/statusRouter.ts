import { Router } from 'express';
import { getApiStatus, getDatabaseStatus } from '../Controllers/statusController';
import mongoose from 'mongoose';

export default (router: Router = Router()) => {
    router.get('/status/api', getApiStatus);
    router.get('/status/database', getDatabaseStatus.bind(null, mongoose.connection));

    return router;
};
