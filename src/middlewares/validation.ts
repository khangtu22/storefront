import { NextFunction, Request, Response } from 'express';
import { CustomError } from './CustomeError';

export const validateProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { name, price, category } = req.body;

  // Check if name is provided and is a string
  if (!name || typeof name !== 'string') {
    throw new CustomError('Invalid product name', 400);
  }

  // Check if price is provided and is a number
  if (!price || typeof price !== 'number') {
    throw new CustomError('Invalid product price', 400);
  }

  // Check if category is provided and is a string
  if (!category || typeof category !== 'string') {
    throw new CustomError('Invalid product category', 400);
  }

  // Validation passed, proceed to the next middleware
  next();
};
