import { NRoute } from '../router';

export const getProducts: NRoute<string> = ({ response }) =>
  (response.body = 'products');
