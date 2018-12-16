import { Router } from 'express';
import { getTags } from '../Controllers/tagController';

// @ts-ignore
const newRouter = new Router();

export default (router: Router = newRouter) => {
    router.get('/tags', getTags);

    return router;
};
