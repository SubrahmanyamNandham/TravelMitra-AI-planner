import { type ErrorRequestHandler } from 'express';
import { logger } from '../lib/logger.js';
import { sendError } from '../lib/response.js';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error({ err, url: req.url, method: req.method }, 'Unhandled error');

  if (res.headersSent) {
    return next(err);
  }

  if (err.statusCode && err.code) {
    return sendError(res, err.message || 'An error occurred', err.statusCode, err.code);
  }

  sendError(res, 'Internal server error', 500, 'INTERNAL_ERROR');
};
