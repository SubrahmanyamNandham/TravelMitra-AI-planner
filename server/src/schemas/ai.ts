import { z } from 'zod';

export const chatSchema = z.object({
  message: z.string().min(1).max(2000)
});

export const generateTripSchema = z.object({
  destination: z.string().min(1),
  country: z.string().optional(),
  duration_days: z.number().int().min(1).max(30),
  budget: z.number().positive().optional(),
  currency: z.string().min(3).max(3).default('USD'),
  interests: z.array(z.string().min(1)).nonempty(),
  travel_style: z.enum(['budget', 'comfort', 'luxury']),
  save_trip: z.boolean().optional().default(false)
});
