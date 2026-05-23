import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Helper to generate UUID-like IDs
const generateId = () => sql`(lower(hex(randomblob(16))))`;

// Helper for current ISO timestamp
const now = () => sql`datetime('now')`;

export const usersTable = sqliteTable('users', {
  id: text('id').primaryKey().default(generateId()),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name').notNull(),
  role: text('role').notNull().default('user'),
  isVerified: integer('is_verified', { mode: 'boolean' }).notNull().default(false),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  lastLoginAt: text('last_login_at'), // ISO 8601 string
  createdAt: text('created_at').notNull().default(now()), // ISO 8601 string
  updatedAt: text('updated_at').notNull().default(now()) // ISO 8601 string
});

export const refreshTokensTable = sqliteTable('refresh_tokens', {
  id: text('id').primaryKey().default(generateId()),
  userId: text('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: text('expires_at').notNull(), // ISO 8601 string
  createdAt: text('created_at').notNull().default(now()), // ISO 8601 string
  revokedAt: text('revoked_at') // ISO 8601 string or null
});

export const tripsTable = sqliteTable('trips', {
  id: text('id').primaryKey().default(generateId()),
  userId: text('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  destination: text('destination').notNull(),
  country: text('country'),
  startDate: text('start_date'), // ISO 8601 string
  endDate: text('end_date'), // ISO 8601 string
  budget: real('budget'), // Floating point for budget amounts
  currency: text('currency').notNull().default('USD'),
  interests: text('interests').default('[]'), // JSON string array
  itinerary: text('itinerary'), // JSON string
  coverImage: text('cover_image'),
  status: text('status').notNull().default('draft'),
  createdAt: text('created_at').notNull().default(now()), // ISO 8601 string
  updatedAt: text('updated_at').notNull().default(now()) // ISO 8601 string
});

export const chatMessagesTable = sqliteTable('chat_messages', {
  id: text('id').primaryKey().default(generateId()),
  userId: text('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  content: text('content').notNull(),
  createdAt: text('created_at').notNull().default(now()) // ISO 8601 string
});

export const schema = {
  usersTable,
  refreshTokensTable,
  tripsTable,
  chatMessagesTable
};
