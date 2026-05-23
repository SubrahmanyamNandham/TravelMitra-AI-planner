import { type NextFunction, type Request, type Response } from 'express';
import { type ZodSchema } from 'zod';
import { sendError } from '../lib/response.js';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message }));
      sendError(res, 'Validation failed', 400, 'VALIDATION_ERROR', errors);
      return;
    }

    req.body = result.data;
    next();
  };
}
