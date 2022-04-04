import { NRoute } from '../router';
import { querySelectProduct, querySelectProducts } from './queries';
import { Product, ProductDetails } from './types';

export const getProducts: NRoute<Product[]> = async ({ response }) => {
  response.body = await querySelectProducts();
};

export const getProduct: NRoute<ProductDetails> = async ({
  params,
  response,
}) => {
  const { id } = params;
  response.body = await querySelectProduct(Number(id));
};
