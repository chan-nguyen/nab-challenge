import { query } from '../../db/query';
import { Product, ProductDetails, Variant } from './types';

export const querySelectProducts = async (): Promise<Product[]> => {
  const sql = `
    SELECT id, name, description, brand
    FROM products;
  `;
  const result = await query(sql, []);
  return result.rows;
};

export const querySelectProduct = async (
  productId: number,
): Promise<ProductDetails> => {
  const sql = `
    SELECT p.id, p.name, p.description, p.brand,
      JSON_AGG(
        JSONB_BUILD_OBJECT(
          'id', v.id,
          'sku', v.sku,
          'name', v.name,
          'color', c.name,
          'size', s.name,
          'price', v.price
        )
      ) AS variants
    FROM products p
    RIGHT JOIN variants v ON v.product_id = p.id
    LEFT JOIN colors c ON c.id = v.color_id
    LEFT JOIN sizes s ON s.id = v.size_id
    WHERE p.id = $1
    GROUP BY p.id;
  `;
  const result = await query(sql, [productId]);
  return result.rows[0];
};

export const querySelectVariant = async (
  variantId: number,
): Promise<Variant> => {
  const sql = `
    SELECT v.id, v.name, v.sku, c.name AS color, s.name AS size,
      v.price, p.id AS product_id, p.name AS product_name,
      p.description, p.brand
    FROM variants v
    LEFT JOIN products p ON p.id = v.product_id
    LEFT JOIN colors c ON c.id = v.color_id
    LEFT JOIN sizes s ON s.id = v.size_id
    WHERE v.id = $1
  `;
  const result = await query(sql, [variantId]);
  return result.rows[0];
};
