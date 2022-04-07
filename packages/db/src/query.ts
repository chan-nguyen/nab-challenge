import { logger } from '@nab/logger';
import { Pool, QueryResult, types } from 'pg';
import { removeNull } from './removeNull';

types.setTypeParser(20, parseInt);

let pool: Pool;

const getPool = (): Pool => {
  if (!pool) {
    pool = new Pool({
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
    });

    pool.on('error', (data) => logger.error(data.toString()));

    pool.on('connect', (client) => {
      client.on('error', logger.error);
    });
  }
  return pool;
};

export const query = async (
  queryText: string,
  values?: Array<string | number | string[] | number[] | undefined>,
): Promise<QueryResult> => {
  const result = await getPool().query(queryText, values);

  return { ...result, rows: result.rows?.map((row) => removeNull(row)) };
};
