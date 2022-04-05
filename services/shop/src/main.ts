import { app } from '@nab/http';
import { logger } from '@nab/logger';
import { router } from './routes/router';

const apiPort = process.env.API_PORT ?? 8080;

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: apiPort });
logger.info(`Listening on http://localhost:${apiPort}`);
