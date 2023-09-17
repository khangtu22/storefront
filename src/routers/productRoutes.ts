import { Application } from 'express';
import productController from '../controllers/productController';

export const configureProductRoutes = (app: Application): void => {
  app.use('/api/products', productController);
};
