import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dir, '..', '..', 'dev.sqlite3');

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
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
    user_id TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    revoked_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
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
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
  CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
  CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
  CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
`);

console.log('✓ SQLite database initialized at:', dbPath);
db.close();
