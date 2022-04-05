import { Middleware } from 'koa';

export type NRoute<
  Response,
  Context = { params: Record<string, string> },
  State = unknown,
> = Middleware<State, Context, Response>;
