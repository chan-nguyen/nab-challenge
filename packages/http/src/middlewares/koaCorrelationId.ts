import { Context, Next } from 'koa';
import { v4 as uuidv4 } from 'uuid';

export const koaCorrelationIdMiddleware = async (
  ctx: Context,
  next: Next,
): Promise<void> => {
  // get correlation Id from the request
  const correlationId = ctx.get('correlation-id') ?? uuidv4();
  // set correlation Id to the response
  ctx.set({ 'correlation-id': correlationId });
  await next();
};
