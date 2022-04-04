import { query } from '../../db/query';
import { UserActivity } from '../activities/types';
import { User } from './types';

export const querySelectUsers = async (): Promise<User[]> => {
  const sql = `
    SELECT id, firstname, lastname
    FROM users;
  `;
  const result = await query(sql, []);
  return result.rows;
};

export const querySelectUserActivitys = async (
  userId: number,
): Promise<UserActivity[]> => {
  const sql = `
    SELECT a.id, a.user_id, at.name AS activity, a.parameters,
      CASE WHEN a.product_id IS NULL
        THEN NULL
        ELSE JSON_BUILD_OBJECT(
          'id', p.id,
          'name', p.name,
          'description', p.description,
          'brand', p.brand,
          'sku', p.sku,
          'variantId', p.variant_id,
          'variantName', p.variant_name,
          'color', p.color,
          'size', p.size,
          'price', p.price
        )
      END AS product, a.created_at
    FROM activities a
    LEFT JOIN activity_types at ON at.id = a.activity_type_id
    LEFT JOIN products p ON p.id = a.product_id
    WHERE user_id = $1;
  `;
  const result = await query(sql, [userId]);
  return result.rows;
};
