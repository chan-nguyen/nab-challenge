type BaseDb = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  brand: string;
  sku: string;
  variantId: number;
  variantName: number;
  color: string;
  size: string;
  price: number;
};

export type ProductDb = Product & BaseDb;

export type Activity = {
  userId: string;
  activityTypeId: string;
  parameters: string;
  productId: number;
};

export type ActivityDb = Activity & Omit<BaseDb, 'updatedAt'>;

export type ActivityPostData = Omit<Activity, 'productId'> & {
  product: Product;
};
