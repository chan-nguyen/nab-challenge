import { query } from '../../db/query';
import { User } from './types';

export const querySelectUsers = async (): Promise<User[]> => {
  const sql = `
    SELECT id, firstname, lastname
    FROM users;
  `;
  const result = await query(sql, []);
  return result.rows;
};
