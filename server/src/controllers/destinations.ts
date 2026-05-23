import { type Request, type Response } from 'express';
import { destinations } from '../data/destinations.js';
import { sendSuccess, sendError } from '../lib/response.js';

export async function listDestinations(req: Request, res: Response) {
  try {
    const search = String(req.query.search ?? '').toLowerCase();
    const page = Math.max(1, Number(req.query.page ?? 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 20)));
    const offset = (page - 1) * limit;

    const filtered = destinations.filter((destination) => {
      if (!search) return true;
      return (
        destination.name.toLowerCase().includes(search) ||
        destination.country.toLowerCase().includes(search) ||
        destination.continent.toLowerCase().includes(search) ||
        destination.tags.some((tag) => tag.toLowerCase().includes(search))
      );
    });

    sendSuccess(res, {
      destinations: filtered.slice(offset, offset + limit),
      page,
      limit,
      total: filtered.length
    });
  } catch (error) {
    sendError(res, 'Internal server error', 500, 'INTERNAL_ERROR');
  }
}

export async function getDestination(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const destination = destinations.find((item) => item.id === id);
    if (!destination) {
      sendError(res, 'Destination not found', 404, 'NOT_FOUND');
      return;
    }
    sendSuccess(res, { destination });
  } catch (error) {
    sendError(res, 'Internal server error', 500, 'INTERNAL_ERROR');
  }
}
