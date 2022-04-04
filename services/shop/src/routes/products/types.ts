export type Product = {
  id: number;
  name: string;
  description: string;
  brand: string;
};

type ProductVariant = {
  id: number;
  sku: string;
  name: string;
  color: string;
  size: string;
  price: number;
};

export type ProductDetails = Product & {
  variants: ProductVariant[];
};

export type Variant = ProductVariant &
  Product & {
    product_id: number;
    product_name: string;
  };
