import { type Response, type Request } from 'express';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '../lib/db/client.js';
import { tripsTable } from '../lib/db/schema.sqlite.js';
import { AuthRequest } from '../types/express.js';
import { sendSuccess, sendError } from '../lib/response.js';

function parseInterests(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      }
    } catch {
      // fall back to comma-separated values below
    }

    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
  }

  return []
}

function normalizeTripRecord(trip: Record<string, unknown>) {
  return {
    ...trip,
    budget: Number(trip.budget ?? 0),
    currency: String(trip.currency ?? 'USD'),
    interests: parseInterests(trip.interests),
    startDate: trip.startDate ?? trip.start_date ?? null,
    endDate: trip.endDate ?? trip.end_date ?? null,
    createdAt: String(trip.createdAt ?? trip.created_at ?? ''),
    updatedAt: String(trip.updatedAt ?? trip.updated_at ?? '')
  }
}

export async function listTrips(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
      return;
    }

    const page = Math.max(1, Number(req.query.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20)));
    const offset = (page - 1) * limit;

    const trips = await db.query.tripsTable.findMany({
      where: eq(tripsTable.userId, userId),
      orderBy: [desc(tripsTable.createdAt)],
      limit,
      offset
    });

    const total = await db.select({ count: sql`count(*)` }).from(tripsTable).where(eq(tripsTable.userId, userId));

    sendSuccess(res, {
      trips: trips.map(trip => normalizeTripRecord(trip)),
      page,
      limit,
      total: Number(total[0]?.count ?? 0)
    });
  } catch (error) {
    req.log.error({ err: error }, 'List trips error');
    sendError(res, 'Internal server error', 500, 'INTERNAL_ERROR');
  }
}

export async function createTrip(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
      return;
    }

    const tripData = req.body as {
      title: string;
      destination: string;
      country?: string;
      start_date?: string;
      end_date?: string;
      budget?: number;
      currency?: string;
      interests?: string[];
      itinerary?: unknown;
      cover_image?: string;
      status?: string;
    };

    const [trip] = await db.insert(tripsTable).values({
      userId,
      title: tripData.title,
      destination: tripData.destination,
      country: tripData.country ?? null,
      startDate: tripData.start_date ?? null,
      endDate: tripData.end_date ?? null,
      budget: tripData.budget === undefined ? null : tripData.budget,
      currency: tripData.currency ?? 'USD',
      interests: JSON.stringify(tripData.interests ?? []),
      itinerary: tripData.itinerary ? JSON.stringify(tripData.itinerary) : null,
      coverImage: tripData.cover_image ?? null,
      status: tripData.status ?? 'draft'
    }).returning();

    sendSuccess(res, { trip: normalizeTripRecord(trip) }, 'Trip created', 201);
  } catch (error) {
    req.log.error({ err: error }, 'Create trip error');
    sendError(res, 'Internal server error', 500, 'INTERNAL_ERROR');
  }
}

export async function getTrip(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const tripId = String(req.params.id);
    if (!userId) {
      sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
      return;
    }

    const trip = await db.query.tripsTable.findFirst({
      where: and(eq(tripsTable.id, tripId), eq(tripsTable.userId, userId))
    });

    if (!trip) {
      sendError(res, 'Trip not found', 404, 'NOT_FOUND');
      return;
    }

    sendSuccess(res, { trip: normalizeTripRecord(trip) });
  } catch (error) {
    req.log.error({ err: error }, 'Get trip error');
    sendError(res, 'Internal server error', 500, 'INTERNAL_ERROR');
  }
}

export async function updateTrip(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const tripId = String(req.params.id);
    if (!userId) {
      sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
      return;
    }

    const updateData = req.body as Record<string, unknown>;
    const setter: Record<string, unknown> = {};
    if ('title' in updateData) setter.title = updateData.title;
    if ('destination' in updateData) setter.destination = updateData.destination;
    if ('country' in updateData) setter.country = updateData.country ?? null;
    if ('start_date' in updateData) setter.startDate = updateData.start_date ? new Date(String(updateData.start_date)) : null;
    if ('end_date' in updateData) setter.endDate = updateData.end_date ? new Date(String(updateData.end_date)) : null;
    if ('budget' in updateData) setter.budget = updateData.budget === undefined ? null : String(updateData.budget);
    if ('currency' in updateData) setter.currency = updateData.currency;
    if ('interests' in updateData) setter.interests = Array.isArray(updateData.interests) ? updateData.interests : [];
    if ('itinerary' in updateData) setter.itinerary = updateData.itinerary ?? null;
    if ('cover_image' in updateData) setter.coverImage = updateData.cover_image ?? null;
    if ('status' in updateData) setter.status = updateData.status;

    const updatedRows = await db.update(tripsTable).set(setter).where(and(eq(tripsTable.id, tripId), eq(tripsTable.userId, userId))).returning();
    const updatedTrip = updatedRows[0];

    if (!updatedTrip) {
      sendError(res, 'Trip not found', 404, 'NOT_FOUND');
      return;
    }

    sendSuccess(res, { trip: normalizeTripRecord(updatedTrip) });
  } catch (error) {
    req.log.error({ err: error }, 'Update trip error');
    sendError(res, 'Internal server error', 500, 'INTERNAL_ERROR');
  }
}

export async function deleteTrip(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const tripId = String(req.params.id);
    if (!userId) {
      sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
      return;
    }

    const deleted = await db.delete(tripsTable).where(and(eq(tripsTable.id, tripId), eq(tripsTable.userId, userId)));
    if (!deleted) {
      sendError(res, 'Trip not found', 404, 'NOT_FOUND');
      return;
    }

    sendSuccess(res, undefined, 'Trip deleted');
  } catch (error) {
    req.log.error({ err: error }, 'Delete trip error');
    sendError(res, 'Internal server error', 500, 'INTERNAL_ERROR');
  }
}
