import jsonwebtoken from 'jsonwebtoken';

export const generateToken = (id: number): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set.');
  }

  return jsonwebtoken.sign(id.toString(), jwtSecret as string);
};
