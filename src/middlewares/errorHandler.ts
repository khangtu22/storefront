import { NextFunction, Request, Response } from 'express';
import { CustomError, ErrorResponse } from './CustomeError';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode: number;
  let errorMessage: string;

  if (err instanceof CustomError) {
    statusCode = err.statusCode;
    errorMessage = err.message;
  } else {
    statusCode = 400;
    errorMessage = 'Bad Request';
  }

  const errorResponse: ErrorResponse = { error: errorMessage };
  res.status(statusCode).json(errorResponse);
  next();
}
