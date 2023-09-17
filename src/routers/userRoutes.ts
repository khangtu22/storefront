import { Application } from 'express';
import userController from '../controllers/userController';

export const configureUserRoutes = (app: Application): void => {
  app.use('/api/users', userController);
};
