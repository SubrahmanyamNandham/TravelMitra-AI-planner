import rateLimit from 'express-rate-limit';
import { sendError } from '../lib/response.js';

const makeLimiter = (windowMs: number, max: number) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => sendError(res, 'Too many requests', 429, 'TOO_MANY_REQUESTS')
  });

export const generalLimiter = makeLimiter(15 * 60 * 1000, 200);
export const authLimiter = makeLimiter(15 * 60 * 1000, 15);
export const aiLimiter = makeLimiter(60 * 1000, 20);
