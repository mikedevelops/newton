import { Router } from 'express';
import { getTag, getTags, createTag } from '../Controllers/tagsController';

export default (router: Router = Router()) => {
    router.get('/tags', getTags);
    router.get('/tags/:tag_id', getTag);
    router.post('/tags', createTag);

    return router;
};
