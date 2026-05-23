import { Response } from 'express';

export function sendSuccess(res: Response, data?: unknown, message = 'Success', status = 200) {
  return res.status(status).json({ success: true, message, ...(data !== undefined ? { data } : {}) });
}

export function sendError(res: Response, message: string, status = 500, code = 'INTERNAL_ERROR', errors?: { field: string; message: string }[]) {
  return res.status(status).json({ success: false, message, code, ...(errors ? { errors } : {}) });
}
