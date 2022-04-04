import { NRoute } from '../router';
import {
  querySelectProduct,
  querySelectProducts,
  querySelectVariant,
} from './queries';
import { Product, ProductDetails, Variant } from './types';

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

export const getVariant: NRoute<Variant> = async ({ params, response }) => {
  const { id } = params;
  response.body = await querySelectVariant(Number(id));
};
