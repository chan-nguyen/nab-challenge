import { NRoute } from '@nab/http';
import { v4 as uuidv4 } from 'uuid';
import { callApi } from '../../utils/request';
import {
  querySelectProduct,
  querySelectProducts,
  querySelectVariant,
} from './queries';
import { PositiveNumber, Product, ProductDetails, Variant } from './types';

export const getProducts: NRoute<Product[]> = async ({ response }) => {
  response.body = await querySelectProducts();
};

export const getProduct: NRoute<ProductDetails> = async ({
  params,
  response,
}) => {
  const id = PositiveNumber.parse(Number(params.id));
  response.body = await querySelectProduct(id);
};

export const getVariant: NRoute<Variant> = async ({
  params,
  request,
  response,
}) => {
  const id = PositiveNumber.parse(Number(params.id));
  const variant = await querySelectVariant(id);

  const {
    'user-id': userId,
    'activity-type-id': activityTypeId,
    'correlation-id': correlationId,
  } = request.headers;
  const url = process.env.HISTORY_SERVICE_URL + '/activities';
  const activity = await callApi(
    url,
    'POST',
    {
      userId,
      activityTypeId,
      product: {
        ...variant,
        id: variant.product_id,
        name: variant.product_name,
        variantId: variant.id,
        variantName: variant.name,
      },
    },
    { 'correlation-id': correlationId ? (correlationId as string) : uuidv4() },
  );

  if (!activity) throw new Error('Could not save activity');
  response.body = variant;
};
