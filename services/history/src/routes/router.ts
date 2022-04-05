import Router from '@koa/router';
import { postActivities } from './activities/routes';
import { getUserActivities, getUsers } from './users/routes';

export const router = new Router();

router.get('/users', getUsers);
router.get('/users/:id/activities', getUserActivities);
router.post('/activities', postActivities);
