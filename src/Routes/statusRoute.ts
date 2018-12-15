import { Router } from 'express';
import statusController from '../Controllers/statusController';

// @ts-ignore
const newRouter = new Router();

export default (router: Router = newRouter) => {
    router.get('/status', statusController);

    return router;
};
