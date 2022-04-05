import cors from '@koa/cors';
import {
  koaCorrelationIdMiddleware,
  koaErrorHandlerMiddleware,
  koaLoggerMiddleware,
} from '@nab/http';
import { logger } from '@nab/logger';
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
