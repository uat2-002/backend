import jwt from 'jsonwebtoken';
import { HttpError } from '../errors/http-error.js';

export function verifyToken(req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Access denied'));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new HttpError(401, 'Access denied'));
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    (req as any).userId = (decoded as any).userId; 
    next();
  } catch (error) {
    return next(new HttpError(401, 'Invalid token'));
  }
}