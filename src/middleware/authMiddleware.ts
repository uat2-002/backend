import jwt from 'jsonwebtoken';
import { HttpError } from '../errors/http-error.js';
import type { Request, Response, NextFunction } from 'express';

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Access denied'));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new HttpError(401, 'Access denied'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
    (req as any).userId = (decoded as any).userId; 
    next();
  } catch (error) {
    return next(new HttpError(401, 'Invalid token'));
  }
}