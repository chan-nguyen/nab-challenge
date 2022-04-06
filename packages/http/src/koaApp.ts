import cors from '@koa/cors';
import { logger } from '@nab/logger';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import { koaCorrelationIdMiddleware } from './middlewares/koaCorrelationId';
import { koaErrorHandlerMiddleware } from './middlewares/koaErrorHandler';
import { koaLoggerMiddleware } from './middlewares/koaLogger';

export const app = new Koa();

app.use(helmet());
app.use(cors());
app.use(bodyParser());

app.use(koaErrorHandlerMiddleware);
app.use(koaCorrelationIdMiddleware);
app.use(koaLoggerMiddleware);

app.on('error', (err, ctx) => {
  logger.error('Koa Error Handler', err, ctx);
});
