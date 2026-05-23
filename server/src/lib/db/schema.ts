import { pgTable, uuid, varchar, text, boolean, timestamp, numeric, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const usersTable = pgTable('users', {
  id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: varchar('full_name', { length: 100 }).notNull(),
  role: varchar('role', { length: 20 }).notNull().default('user'),
  isVerified: boolean('is_verified').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }).default(sql`NULL`),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`now()`).$onUpdateFn(() => new Date())
});

export const refreshTokensTable = pgTable('refresh_tokens', {
  id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
  userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  revokedAt: timestamp('revoked_at', { withTimezone: true }).default(sql`NULL`)
});

export const tripsTable = pgTable('trips', {
  id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
  userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 200 }).notNull(),
  destination: varchar('destination', { length: 200 }).notNull(),
  country: varchar('country', { length: 100 }).default(sql`NULL`),
  startDate: timestamp('start_date', { withTimezone: true }).default(sql`NULL`),
  endDate: timestamp('end_date', { withTimezone: true }).default(sql`NULL`),
  budget: numeric('budget', { precision: 10, scale: 2 }).default(sql`NULL`),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  interests: text('interests').array().notNull().default(sql`ARRAY[]::text[]`),
  itinerary: jsonb('itinerary').default(sql`NULL`),
  coverImage: text('cover_image').default(sql`NULL`),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`now()`).$onUpdateFn(() => new Date())
});

export const chatMessagesTable = pgTable('chat_messages', {
  id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
  userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 20 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`)
});

export const schema = {
  usersTable,
  refreshTokensTable,
  tripsTable,
  chatMessagesTable
};
