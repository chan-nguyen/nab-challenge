import { query } from '../../db/query';
import { Product } from './types';

export const querySelectProducts = async (): Promise<Product[]> => {
  const sql = `
    SELECT id, name, description, brand
    FROM products;
  `;
  const result = await query(sql, []);
  return result.rows;
};
