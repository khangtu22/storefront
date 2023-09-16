import jwt, { SignOptions } from 'jsonwebtoken';

export const generateToken = (id: number): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set.');
  }

  const signOptions: SignOptions = {
    expiresIn: '1h',
  };

  return jwt.sign(id.toString(), jwtSecret, signOptions);
};
