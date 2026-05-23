import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

const now = () => sql`datetime('now')`;

export const usersTable = sqliteTable('users', {
  id: text('id').primaryKey().default(sql`lower(hex(randomblob(16)))`),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name').notNull(),
  role: text('role').notNull().default('user'),
  isVerified: integer('is_verified', { mode: 'boolean' }).notNull().default(false),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  lastLoginAt: text('last_login_at'),
  createdAt: text('created_at').notNull().default(now()),
  updatedAt: text('updated_at').notNull().default(now())
});

export const refreshTokensTable = sqliteTable('refresh_tokens', {
  id: text('id').primaryKey().default(sql`lower(hex(randomblob(16)))`),
  userId: text('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').notNull().default(now()),
  revokedAt: text('revoked_at')
});

export const tripsTable = sqliteTable('trips', {
  id: text('id').primaryKey().default(sql`lower(hex(randomblob(16)))`),
  userId: text('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  destination: text('destination').notNull(),
  country: text('country'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  budget: real('budget'),
  currency: text('currency').notNull().default('USD'),
  interests: text('interests').notNull().default('[]'),
  itinerary: text('itinerary'),
  coverImage: text('cover_image'),
  status: text('status').notNull().default('draft'),
  createdAt: text('created_at').notNull().default(now()),
  updatedAt: text('updated_at').notNull().default(now())
});

export const chatMessagesTable = sqliteTable('chat_messages', {
  id: text('id').primaryKey().default(sql`lower(hex(randomblob(16)))`),
  userId: text('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  content: text('content').notNull(),
  createdAt: text('created_at').notNull().default(now())
});

export const schema = {
  usersTable,
  refreshTokensTable,
  tripsTable,
  chatMessagesTable
};
