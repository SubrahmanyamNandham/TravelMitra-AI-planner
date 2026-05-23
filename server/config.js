const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');
const envExamplePath = path.resolve(__dirname, '.env.example');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else if (fs.existsSync(envExamplePath)) {
  dotenv.config({ path: envExamplePath });
} else {
  dotenv.config();
}

const requiredEnv = [
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'COOKIE_SECRET'
];

const missingEnv = requiredEnv.filter((name) => !process.env[name]);
if (missingEnv.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnv.join(', ')}`
  );
}

const getDatabaseConfig = () => {
  const dbClient = process.env.DB_CLIENT || (process.env.DATABASE_URL ? 'pg' : 'sqlite3');

  if (dbClient === 'pg') {
    const buildDatabaseUrl = () => {
      if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL;
      }

      const {
        PG_USER,
        PG_PASSWORD,
        PG_HOST,
        PG_PORT,
        PG_DATABASE
      } = process.env;

      if (PG_USER && PG_PASSWORD && PG_HOST && PG_PORT && PG_DATABASE) {
        return `postgres://${encodeURIComponent(PG_USER)}:${encodeURIComponent(PG_PASSWORD)}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`;
      }

      return null;
    };

    const databaseUrl = buildDatabaseUrl();
    if (!databaseUrl) {
      throw new Error(
        'Missing required environment variables: DATABASE_URL or PG_HOST/PG_PORT/PG_USER/PG_PASSWORD/PG_DATABASE'
      );
    }

    return { dbClient, databaseUrl };
  }

  return {
    dbClient: 'sqlite3',
    sqliteFilename: process.env.SQLITE_FILENAME || path.resolve(__dirname, 'dev.sqlite3')
  };
};

const dbConfig = getDatabaseConfig();
const isProduction = process.env.NODE_ENV === 'production';

const parseDuration = (duration) => {
  if (!duration || typeof duration !== 'string') {
    throw new Error('Invalid duration value');
  }

  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error('Invalid duration format. Use: 15m, 1h, 7d, etc.');
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return value * multipliers[unit];
};

const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

module.exports = {
  port: Number(process.env.PORT) || 5000,
  isProduction,
  dbClient: dbConfig.dbClient,
  databaseUrl: dbConfig.databaseUrl,
  sqliteFilename: dbConfig.sqliteFilename,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenExpiresIn,
  refreshTokenExpiresIn,
  refreshTokenMaxAge: parseDuration(refreshTokenExpiresIn),
  cookieSecret: process.env.COOKIE_SECRET,
  cookieOptions: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/'
  },
  refreshTokenCookieName: process.env.REFRESH_TOKEN_COOKIE_NAME || 'refreshToken',
  corsOrigin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : ['http://localhost:5173'],
  rateLimitWindowMs: 15 * 60 * 1000,
  rateLimitMax: 100
};
