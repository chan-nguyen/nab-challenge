import { query } from '../../db/query';
import { Product, ProductDetails } from './types';

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
