import { Router } from 'express';
import { createResource, getPaginatedResources, getResource, updateResource } from '../Controllers/resourceController';
import { TagModel } from '../Resources/Tag';

export default (router: Router = Router()) => {
    router.get('/tags', getPaginatedResources.bind(null, TagModel));
    router.get('/tags/:resource_id', getResource.bind(null, TagModel));
    router.post('/tags', createResource.bind(null, TagModel));
    router.put('/tags/:resource_id', updateResource.bind(null, TagModel));

    return router;
};
