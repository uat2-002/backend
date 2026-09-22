import { Request } from 'express';
import { type JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      userId?: string; 
    }
  }
}

export interface TokenPayload extends JwtPayload {
  userId: string;
}

