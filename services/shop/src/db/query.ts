import { logger } from '@nab/logger';
import { Pool, QueryResult, types } from 'pg';
import { removeNull } from './remove-null';

/*
  JS does not support 64-bit integers. node-postgres driver returns 64-bit integers
  as string and 32-bit integers as number. So, to avoid returning string in the case
  of int8 types, we should setTypeParser to parse int8 string to int4.
  TypeId 20 = BIGINT | BIGSERIAL
  https://www.npmjs.com/package/pg-types

  @fixme: why this does not work: types.setTypeParser(20, BigInt);
    issue: https://github.com/kymono/kymdom/issues/2246
  note that JSON.stringify() does not support BigInt serialization:
    https://dev.to/benlesh/bigint-and-json-stringify-json-parse-2m8p
*/
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
