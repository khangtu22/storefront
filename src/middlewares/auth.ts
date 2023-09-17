import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

export const authToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader: string | undefined = req.headers.authorization;
    const token: string = authorizationHeader
      ? authorizationHeader.split(' ')[1]
      : '';
    res.locals.userData = jwt.verify(token, process.env.JWT_SECRET as string);
    next();
  } catch (err) {
    next(err);
  }
};

const tokenSecret: string = process.env.JWT_SECRET as string;

export const createJWTToken = (id: number, username: string): string => {
  return jwt.sign({ id, username }, tokenSecret);
};
