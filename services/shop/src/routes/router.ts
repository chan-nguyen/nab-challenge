import Router from '@koa/router';
import { getProduct, getProducts, getVariant } from './products/routes';

export const router = new Router();

router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.get('/variants/:id', getVariant);
