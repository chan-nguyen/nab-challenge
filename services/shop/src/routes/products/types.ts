import { z } from 'zod';

export const PositiveNumber = z.number().positive();

export const ProductSchema = z.object({
  id: PositiveNumber,
  name: z.string(),
  description: z.string(),
  brand: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;

export const ProductVariantSchema = z.object({
  id: PositiveNumber,
  sku: z.string(),
  name: z.string(),
  color: z.string(),
  size: z.string(),
  price: PositiveNumber,
});

export type ProductVariant = z.infer<typeof ProductVariantSchema>;

export const ProductDetailsSchema = ProductSchema.extend({
  variants: ProductVariantSchema.array(),
});

export type ProductDetails = z.infer<typeof ProductDetailsSchema>;

export const VariantSchema = ProductVariantSchema.merge(ProductSchema).extend({
  product_id: PositiveNumber,
  product_name: z.string(),
});

export type Variant = z.infer<typeof VariantSchema>;
