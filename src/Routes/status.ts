import { Router } from 'express';
import { getApiStatus, getDatabaseStatus } from '../Controllers/statusController';

// @ts-ignore
const newRouter = new Router();

export default (router: Router = newRouter) => {
    router.get('/status/api', getApiStatus);
    router.get('/status/database', getDatabaseStatus);

    return router;
};
