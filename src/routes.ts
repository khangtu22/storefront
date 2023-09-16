import { Application } from 'express';
import { configureOrderRoutes } from './routers/orderRoutes';
import { configureProductRoutes } from './routers/productRoutes';
import { configureUserRoutes } from './routers/userRoutes';

export const configureRoutes = (app: Application): void => {
  configureOrderRoutes(app);
  configureProductRoutes(app);
  configureUserRoutes(app);
};
