import { NextFunction, Response } from 'express';
import { AuthRequest } from '../types/express.js';
import { sendError } from '../lib/response.js';
import { verifyAccessToken } from '../lib/jwt.js';

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader?.startsWith('Bearer ')) {
    sendError(res, 'Authorization token required', 401, 'UNAUTHORIZED');
    return;
  }

  const token = authorizationHeader.slice(7).trim();
  const payload = verifyAccessToken(token);
  if (!payload) {
    sendError(res, 'Invalid or expired token', 401, 'TOKEN_INVALID');
    return;
  }

  req.user = { id: payload.sub, email: payload.email, role: payload.role };
  next();
}
