import { callApi } from '../../utils/request';
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

export const getVariant: NRoute<Variant> = async ({
  params,
  request,
  response,
}) => {
  const { id } = params;
  const { 'user-id': userId, 'activity-type-id': activityTypeId } =
    request.headers;
  const variant = await querySelectVariant(Number(id));

  const url = process.env.HISTORY_SERVICE_URL + '/activities';
  await callApi(url, 'POST', {
    userId,
    activityTypeId,
    product: {
      ...variant,
      id: variant.product_id,
      name: variant.product_name,
      variantId: variant.id,
      variantName: variant.name,
    },
  });
  response.body = variant;
};
