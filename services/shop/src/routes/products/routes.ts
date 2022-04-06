import { NRoute } from '@nab/http';
import { callApi } from '../../utils/apiCaller';
import { buildCorrelationIdObject } from '../../utils/correlationId';
import {
  querySelectProduct,
  querySelectProducts,
  querySelectVariant,
} from './queries';
import {
  ActivityType,
  PositiveNumber,
  Product,
  ProductDetails,
  Variant,
} from './types';

const activitiesUrl = process.env.HISTORY_SERVICE_URL + '/activities';

export const getProducts: NRoute<Product[]> = async ({ request, response }) => {
  const { s: searchString } = request.query;
  const products = await querySelectProducts(searchString as string);

  if (searchString) {
    const { 'user-id': userId, 'correlation-id': correlationId } =
      request.headers;
    const activity = await callApi(
      activitiesUrl,
      'POST',
      {
        userId,
        activityTypeId: ActivityType.SEARCH,
        parameters: {
          searchString,
        },
      },
      buildCorrelationIdObject(correlationId),
    );

    if (!activity) throw new Error('Could not save activity');
  }

  response.body = products;
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

  const { 'user-id': userId, 'correlation-id': correlationId } =
    request.headers;
  const activity = await callApi(
    activitiesUrl,
    'POST',
    {
      userId,
      activityTypeId: ActivityType.VIEW,
      product: {
        ...variant,
        id: variant.product_id,
        name: variant.product_name,
        variantId: variant.id,
        variantName: variant.name,
      },
    },
    buildCorrelationIdObject(correlationId),
  );

  if (!activity) throw new Error('Could not save activity');
  response.body = variant;
};
