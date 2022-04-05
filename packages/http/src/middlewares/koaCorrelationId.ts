import { Context, Next } from 'koa';

export const koaCorrelationIdMiddleware = async (
  ctx: Context,
  next: Next,
): Promise<void> => {
  // get correlation Id from the request
  const correlationId = ctx.get('correlation-id');
  // set correlation Id to the response
  ctx.set({ 'correlation-id': correlationId });
  await next();
};
