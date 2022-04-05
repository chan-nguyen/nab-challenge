import { logger } from '@nab/logger';
import { app } from './app';

const apiPort = process.env.API_PORT ?? 8080;

app.listen({ port: apiPort });
logger.info(`Listening on http://localhost:${apiPort}`);
