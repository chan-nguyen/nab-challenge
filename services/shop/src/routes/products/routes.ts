import { NRoute } from '../router';
import { querySelectProducts } from './queries';
import { Product } from './types';

export const getProducts: NRoute<Product[]> = async ({ response }) =>
  (response.body = await querySelectProducts());
