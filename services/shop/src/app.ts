import cors from '@koa/cors';
import { logger } from '@nab/logger';
import {
  koaCorrelationIdMiddleware,
  koaErrorHandlerMiddleware,
  koaLoggerMiddleware,
} from '@nab/middlewares';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import { router } from './routes/router';

export const app = new Koa();

app.use(helmet());
app.use(cors());
app.use(bodyParser());

app.use(koaErrorHandlerMiddleware);
app.use(koaCorrelationIdMiddleware);
app.use(koaLoggerMiddleware);

app.use(router.routes());
app.use(router.allowedMethods());

app.on('error', (err, ctx) => {
  logger.error('Koa Error Handler', err, ctx);
});
