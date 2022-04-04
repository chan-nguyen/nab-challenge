import Router from '@koa/router';
import { Middleware } from 'koa';
import { getProducts } from './products/routes';

export type NRoute<
  Response,
  Context = { params: Record<string, string> },
  State = unknown,
> = Middleware<State, Context, Response>;

export const router = new Router();

router.get('/products', getProducts);
