import Router from '@koa/router';
import { Middleware } from 'koa';
import { postActivities } from './activities/routes';
import { getUsers } from './users/routes';

export type NRoute<
  Response,
  Context = { params: Record<string, string> },
  State = unknown,
> = Middleware<State, Context, Response>;

export const router = new Router();

router.get('/users', getUsers);
router.post('/activities', postActivities);
