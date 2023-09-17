import { NextFunction, Request, Response } from 'express';
import { CustomError } from './CustomeError';

export const validateProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { name, price, category } = req.body;

  if (!name || typeof name !== 'string') {
    throw new CustomError('Invalid product name', 400);
  }
  if (!price || typeof price !== 'number') {
    throw new CustomError('Invalid product price', 400);
  }

  if (!category || typeof category !== 'string') {
    throw new CustomError('Invalid product category', 400);
  }

  next();
};
