import jwt, { SignOptions } from 'jsonwebtoken';
import { AuthResponse } from '../types';

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string,
  };
  
  return jwt.sign({ userId }, secret, options);
};

export const createAuthResponse = (user: any): AuthResponse => {
  const token = generateToken(user.id);
  
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
    token,
  };
};
