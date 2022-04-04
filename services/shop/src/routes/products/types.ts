export type Product = {
  id: number;
  name: string;
  description: string;
  brand: string;
};

type ProductVariant = {
  sku: string;
  name: string;
  color: string;
  size: string;
  price: DoubleRange;
};

export type ProductDetails = Product & {
  variantss: ProductVariant[];
};
