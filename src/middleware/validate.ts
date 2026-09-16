import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { HttpError } from '../errors/http-error.js';

export function validate(schema: ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues.map((i) => i.message).join(', ');
      throw new HttpError(400, message);
    }
    req.body = result.data;
    next();
  };
}
