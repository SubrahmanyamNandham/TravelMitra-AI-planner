import path from 'path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { env } from '../env.js';
import { schema } from './schema-sqlite.js';

function resolveDbPath(rawPath: string) {
  if (path.isAbsolute(rawPath)) {
    return rawPath;
  }

  return path.resolve(process.cwd(), rawPath);
}

function ensureSqliteSchema(sqlite: ReturnType<typeof Database>) {
  sqlite.pragma('foreign_keys = ON');

  const tableNames = sqlite
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
    .all() as Array<{ name: string }>;
  const tableSet = new Set(tableNames.map((row) => row.name));

  const userColumns = sqlite.prepare('PRAGMA table_info(users)').all() as Array<{ name: string }>;
  const refreshTokenColumns = sqlite.prepare('PRAGMA table_info(refresh_tokens)').all() as Array<{ name: string }>;

  sqlite.transaction(() => {
    if (userColumns.some((column) => column.name === 'name' || column.name === 'password')) {
      if (tableSet.has('legacy_users')) {
        sqlite.exec('DROP TABLE legacy_users');
      }
      sqlite.exec('ALTER TABLE users RENAME TO legacy_users');
    }

    if (refreshTokenColumns.some((column) => column.name === 'token')) {
      if (tableSet.has('legacy_refresh_tokens')) {
        sqlite.exec('DROP TABLE legacy_refresh_tokens');
      }
      sqlite.exec('ALTER TABLE refresh_tokens RENAME TO legacy_refresh_tokens');
    }

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        is_verified INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        last_login_at TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL UNIQUE,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        revoked_at TEXT
      );

      CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        destination TEXT NOT NULL,
        country TEXT,
        start_date TEXT,
        end_date TEXT,
        budget REAL,
        currency TEXT NOT NULL DEFAULT 'USD',
        interests TEXT DEFAULT '[]',
        itinerary TEXT,
        cover_image TEXT,
        status TEXT NOT NULL DEFAULT 'draft',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
      CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
      CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
    `);

    const hasLegacyUsersTable = Boolean(
      sqlite.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'legacy_users'").get()
    );

    if (hasLegacyUsersTable) {
      const legacyUsers = sqlite.prepare(
        "SELECT id, name, email, password, created_at, updated_at FROM legacy_users"
      ).all() as Array<{
        id: number;
        name: string;
        email: string;
        password: string;
        created_at: string;
        updated_at: string;
      }>;

      if (legacyUsers.length > 0) {
        const insertUser = sqlite.prepare(`
          INSERT OR IGNORE INTO users (
            id,
            email,
            password_hash,
            full_name,
            role,
            is_verified,
            is_active,
            created_at,
            updated_at
          ) VALUES (?, ?, ?, ?, ?, 0, 1, ?, ?)
        `);

        for (const legacyUser of legacyUsers) {
          insertUser.run(
            String(legacyUser.id),
            legacyUser.email,
            legacyUser.password,
            legacyUser.name,
            'user',
            legacyUser.created_at,
            legacyUser.updated_at
          );
        }
      }
    }
  })();
}

// For now, use SQLite in dev, can switch to PostgreSQL later
const dbPath = env.DATABASE_URL.startsWith('sqlite:')
  ? env.DATABASE_URL.replace('sqlite:', '')
  : 'dev.sqlite3';

const resolvedDbPath = resolveDbPath(dbPath);
const sqlite = new Database(resolvedDbPath);
ensureSqliteSchema(sqlite);

export const db = drizzle(sqlite, { schema });
