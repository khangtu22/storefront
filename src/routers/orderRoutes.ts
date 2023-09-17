import { Application } from 'express';
import orderRouter from '../controllers/orderController';

export const configureOrderRoutes = (app: Application): void => {
  app.use('/api/orders', orderRouter);
};
