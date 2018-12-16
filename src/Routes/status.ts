import { Router } from 'express';
import { getStatus } from '../Controllers/statusController';

// @ts-ignore
const newRouter = new Router();

export default (router: Router = newRouter) => {
    router.get('/status', getStatus);

    return router;
};
