import { Router } from 'express';
import {
    createResource,
    getPaginatedResources,
    getResource,
    removeResource,
    updateResource
} from '../Controllers/resourceController';
import { QuestionModel } from '../Resources/Question';

export default (router: Router = Router()) => {
    router.get('/questions', getPaginatedResources.bind(null, QuestionModel));
    router.get('/questions/:resource_id', getResource.bind(null, QuestionModel));
    router.post('/questions', createResource.bind(null, QuestionModel));
    router.put('/questions/:resource_id', updateResource.bind(null, QuestionModel));
    router.delete('/questions/:resource_id', removeResource.bind(null, QuestionModel));

    return router;
};
