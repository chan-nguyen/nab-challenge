import { logger } from '@nab/logger';
import { Context, Next, Request, Response } from 'koa';
import koaLogger from 'koa-logger';

const extractRequestToLog = (request: Request) => {
  const {
    method,
    url,
    ip,
    headers: { 'n-correlation-id': correlationId, 'user-agent': agent },
  } = request;

  return { agent, method, url, ip, correlationId };
};

const extractResponseToLog = (response: Response) => {
  const {
    status,
    length,
    headers: { 'x-response-time': responseTime },
  } = response;

  return { status, length, responseTime };
};

const productionLoggerMiddleware = async (
  ctx: Context,
  next: Next,
): Promise<void> => {
  const start = Date.now();
  await next();
  const end = Date.now();

  ctx.set('x-response-time', `${end - start}ms`);

  const requestLog = extractRequestToLog(ctx.request);
  const responseLog = extractResponseToLog(ctx.response);

  const logObject = {
    ...requestLog,
    ...responseLog,
    length: `${
      responseLog.length ? (responseLog.length / 1024).toFixed(2) : 0
    }kb`,
    date: new Date(start).toLocaleString(),
  };

  logger.info(logObject);
};

export const koaLoggerMiddleware =
  process.env.NODE_ENV === 'production'
    ? productionLoggerMiddleware
    : koaLogger();
