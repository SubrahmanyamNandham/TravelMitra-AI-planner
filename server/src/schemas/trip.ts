import { z } from 'zod';

export const tripStatusEnum = z.enum(['draft', 'planned', 'completed']);

export const createTripSchema = z.object({
  title: z.string().min(1).max(200),
  destination: z.string().min(1).max(200),
  country: z.string().max(100).optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  budget: z.number().positive().optional(),
  currency: z.string().length(3).default('USD'),
  interests: z.array(z.string().min(1)).optional().default([]),
  itinerary: z.any().optional(),
  cover_image: z.string().url().optional(),
  status: tripStatusEnum.optional().default('draft')
});

export const updateTripSchema = createTripSchema.partial();
