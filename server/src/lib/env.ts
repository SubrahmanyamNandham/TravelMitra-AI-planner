import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env into process.env early so validation can use local env file during dev
dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(32),
  AI_INTEGRATIONS_OPENAI_BASE_URL: z.string().url(),
  AI_INTEGRATIONS_OPENAI_API_KEY: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  ALLOWED_ORIGINS: z.string().default('*'),
  PORT: z.coerce.number().default(5000)
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`Environment validation failed: ${parsed.error.format()._errors.join(', ')}`);
}

export const env = {
  ...parsed.data,
  ALLOWED_ORIGINS: parsed.data.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
};
