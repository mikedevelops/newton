import { Router } from 'express';
import { getTags, postTags } from '../Controllers/tagsController';

// @ts-ignore
const newRouter = new Router();

export default (router: Router = newRouter) => {
    router.get('/tags', getTags);
    router.post('/tags', postTags);

    return router;
};
