import type { ErrorRequestHandler } from 'express';
import { HttpError } from '../errors/http-error.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  } 
  const prismaError = err as { code?: string };
  
  if (prismaError.code === 'P2002') {
    res.status(409).json({ error: 'This serial is already in your list' });
    return;
  }
  
  if (prismaError.code === 'P2003') {
    res.status(404).json({ error: 'User or Series not found in database' });
    return;
  }
  
  if (prismaError.code === 'P2025') {
    res.status(404).json({ error: 'Series not found in your watchlist' });
    return;
  }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  
};
