import { query } from '@nab/db';
import {
  Activity,
  ActivityDb,
  ActivityPostData,
  Product,
  ProductDb,
} from './types';

export const queryCreateProduct = async ({
  id,
  name,
  description,
  brand,
  sku,
  variantId,
  variantName,
  color,
  size,
  price,
}: Product): Promise<ProductDb> => {
  const sql = `
    INSERT INTO products (id, name, description, brand, sku, variant_id, variant_name, color, size, price)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    ON CONFLICT (id)
    DO NOTHING
    RETURNING *;
  `;
  const result = await query(sql, [
    id,
    name,
    description,
    brand,
    sku,
    variantId,
    variantName,
    color,
    size,
    price,
  ]);
  return result.rows[0];
};

export const queryCreateActivity = async ({
  userId,
  activityTypeId,
  parameters,
  productId,
}: Activity): Promise<ActivityDb> => {
  const sql = `
    INSERT INTO activities (user_id, activity_type_id, parameters, product_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const result = await query(sql, [
    userId,
    activityTypeId,
    parameters,
    productId,
  ]);
  return result.rows[0];
};

export const createActivity = async ({
  userId,
  activityTypeId,
  parameters,
  product,
}: ActivityPostData): Promise<ActivityDb> => {
  if (product) await queryCreateProduct(product);
  const activity = await queryCreateActivity({
    userId,
    activityTypeId,
    parameters,
    productId: product.id,
  });
  return activity;
};
