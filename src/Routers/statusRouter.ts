import { Router } from 'express';
import { getApiStatus, getDatabaseStatus } from '../Controllers/statusController';

export default (router: Router = Router()) => {
    router.get('/status/api', getApiStatus);
    router.get('/status/database', getDatabaseStatus);

    return router;
};
