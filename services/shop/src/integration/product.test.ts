import nock from 'nock';
import request from 'supertest';
import { app } from '../app';

const historyServiceUrl =
  process.env.HISTORY_SERVICE_URL ?? 'http://localhost:8090';

jest.mock('../routes/products/queries', () => {
  return {
    querySelectVariant: () => ({ abc: 1 }),
  };
});

describe('Test product APIs', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('get server error when not successfully saving activity', async () => {
    nock(historyServiceUrl).post('/activities').reply(500, {});
    const response = await request(app.callback()).get('/variants/1');
    expect(response.status).toBe(500);
  });

  it('get variant and save activities successfully', async () => {
    nock(historyServiceUrl).post('/activities').reply(200, {});
    const response = await request(app.callback()).get('/variants/1');
    expect(response.status).toBe(200);
  });
});
