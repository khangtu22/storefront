import express, { NextFunction, Request, Response } from 'express';
import { ProductRepository } from '../models/Product';
import { ProductType } from '../interfaces/Product';
import { authToken } from '../middlewares/auth';
import { validateProduct } from '../middlewares/validation';
import { CustomError } from '../middlewares/CustomeError';
import logger from '../middlewares/logger';

const productRouter = express.Router();
const productModel = new ProductRepository();

productRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allProducts: ProductType[] = await productModel.getAllProducts();
      return res.json(allProducts);
    } catch (error) {
      logger.error('Error getting all products:', error);
      next(new CustomError('Internal Server Error', 500));
    }
  },
);

productRouter.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId: number = parseInt(req.params.id);
      const productById: ProductType =
        await productModel.getProductById(productId);
      if (!productById) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.json(productById);
    } catch (error) {
      logger.error('Error getting product by id:', error);
      next(new CustomError('Internal Server Error', 500));
    }
  },
);

productRouter.get(
  '/category/:category',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category: string = String(req.params.category);
      const productByCat: ProductType[] =
        await productModel.getProductsByCategory(category);
      return res.json(productByCat);
    } catch (error) {
      logger.error('Error getting products by category:', error);
      next(new CustomError('Internal Server Error', 500));
    }
  },
);

productRouter.post(
  '/',
  authToken,
  validateProduct,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createdProduct: ProductType = await productModel.createProduct(
        req.body,
      );
      return res.status(201).json(createdProduct);
    } catch (error) {
      logger.error('Error creating product:', error);
      next(new CustomError('Internal Server Error', 500));
    }
  },
);

productRouter.delete(
  '/:id',
  authToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: number = parseInt(req.params.id);
      const deletedProduct: ProductType = await productModel.deleteProduct(id);
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(204).json(deletedProduct);
    } catch (error) {
      logger.error('Error deleting product:', error);
      next(new CustomError('Internal Server Error', 500));
    }
  },
);

productRouter.use((err: Error, req: Request, res: Response) => {
  const statusCode = err instanceof CustomError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ error: message });
});

export default productRouter;
