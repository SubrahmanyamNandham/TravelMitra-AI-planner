import { type Response } from 'express';
import { and, eq } from 'drizzle-orm';
import { db } from '../lib/db/client.js';
import { usersTable, refreshTokensTable } from '../lib/db/schema-sqlite.js';
import { hashPassword, comparePassword, hashToken } from '../lib/hash.js';
import { sendSuccess, sendError } from '../lib/response.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt.js';
import { env } from '../lib/env.js';
import { AuthRequest } from '../types/express.js';

const REFRESH_COOKIE_NAME = 'refreshToken';
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth',
    maxAge: REFRESH_TOKEN_TTL_MS
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth'
  });
}

function serializeUser(user: { id: string; email: string; fullName: string; role: string; isVerified: boolean; isActive: boolean; createdAt: string | Date }) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    isVerified: user.isVerified,
    isActive: user.isActive,
    createdAt: typeof user.createdAt === 'string' ? new Date(user.createdAt) : user.createdAt
  };
}


async function revokeAllRefreshTokensForUser(userId: string) {
  await db.update(refreshTokensTable).set({ revokedAt: new Date().toISOString() }).where(and(eq(refreshTokensTable.userId, userId)));
}

export async function signup(req: AuthRequest, res: Response) {
  try {
    const { full_name, email, password } = req.body as { full_name: string; email: string; password: string };

    const existingUser = await db.query.usersTable.findFirst({ where: eq(usersTable.email, email) });
    if (existingUser) {
      sendError(res, 'Email already exists', 409, 'EMAIL_ALREADY_EXISTS');
      return;
    }

    const passwordHash = await hashPassword(password);
    const [user] = await db.insert(usersTable).values({
      email,
      passwordHash,
      fullName: full_name,
      role: 'user',
      isVerified: false,
      isActive: true
    }).returning();

    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken(user.id);
    const refreshTokenHash = hashToken(refreshToken);
    await db.insert(refreshTokensTable).values({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS).toISOString()
    });

    setRefreshCookie(res, refreshToken);
    sendSuccess(res, {
      user: serializeUser(user),
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 900
    }, 'User created', 201);
  } catch (error) {
    req.log.error({ err: error }, 'Signup error');
    sendError(res, 'Internal server error', 500, 'INTERNAL_ERROR');
  }
}

export async function login(req: AuthRequest, res: Response) {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await db.query.usersTable.findFirst({ where: eq(usersTable.email, email) });
    const passwordMatches = await comparePassword(password, user?.passwordHash ?? null);

    if (!user || !passwordMatches) {
      sendError(res, 'Invalid email or password', 401, 'INVALID_CREDENTIALS');
      return;
    }

    if (!user.isActive) {
      sendError(res, 'Account deactivated', 403, 'ACCOUNT_DEACTIVATED');
      return;
    }

    await db.update(usersTable).set({ lastLoginAt: new Date().toISOString() }).where(eq(usersTable.id, user.id));

    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken(user.id);
    const refreshTokenHash = hashToken(refreshToken);

    await db.insert(refreshTokensTable).values({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS).toISOString()
    });

    setRefreshCookie(res, refreshToken);
    sendSuccess(res, {
      user: serializeUser(user),
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 900
    }, 'Login successful');
  } catch (error) {
    req.log.error({ err: error }, 'Login error');
    sendError(res, 'Internal server error', 500, 'INTERNAL_ERROR');
  }
}

export async function refresh(req: AuthRequest, res: Response) {
  try {
    const refreshToken = req.cookies[REFRESH_COOKIE_NAME];
    if (!refreshToken) {
      sendError(res, 'Refresh token required', 401, 'UNAUTHORIZED');
      return;
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      sendError(res, 'Refresh token invalid or expired', 401, 'TOKEN_INVALID');
      return;
    }

    const tokenHash = hashToken(refreshToken);
    const storedToken = await db.query.refreshTokensTable.findFirst({
      where: eq(refreshTokensTable.tokenHash, tokenHash)
    });

    const user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, payload.sub) });
    if (!user) {
      sendError(res, 'Invalid token payload', 401, 'TOKEN_INVALID');
      return;
    }

    if (!storedToken || storedToken.revokedAt || new Date(storedToken.expiresAt).getTime() <= Date.now()) {
      await revokeAllRefreshTokensForUser(user.id);
      sendError(res, 'Refresh token invalid or expired', 401, 'TOKEN_INVALID');
      return;
    }

    if (!user.isActive) {
      sendError(res, 'Account deactivated', 403, 'ACCOUNT_DEACTIVATED');
      return;
    }

    const newRefreshToken = signRefreshToken(user.id);
    const newTokenHash = hashToken(newRefreshToken);

    await db.transaction(async (tx) => {
      await tx.update(refreshTokensTable).set({ revokedAt: new Date().toISOString() }).where(eq(refreshTokensTable.id, storedToken.id));
      await tx.insert(refreshTokensTable).values({
        userId: user.id,
        tokenHash: newTokenHash,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS).toISOString()
      });
    });

    setRefreshCookie(res, newRefreshToken);
    sendSuccess(res, {
      user: serializeUser(user),
      access_token: signAccessToken({ sub: user.id, email: user.email, role: user.role }),
      token_type: 'Bearer',
      expires_in: 900
    }, 'Token refreshed');
  } catch (error) {
    req.log.error({ err: error }, 'Refresh token error');
    sendError(res, 'Internal server error', 500, 'INTERNAL_ERROR');
  }
}

export async function logout(req: AuthRequest, res: Response) {
  try {
    const refreshToken = req.cookies[REFRESH_COOKIE_NAME];
    if (!refreshToken) {
      sendError(res, 'Refresh token required', 401, 'UNAUTHORIZED');
      return;
    }

    const tokenHash = hashToken(refreshToken);
    await db.update(refreshTokensTable).set({ revokedAt: new Date().toISOString() }).where(eq(refreshTokensTable.tokenHash, tokenHash));
    clearRefreshCookie(res);
    sendSuccess(res, undefined, 'Logout successful');
  } catch (error) {
    req.log.error({ err: error }, 'Logout error');
    sendError(res, 'Internal server error', 500, 'INTERNAL_ERROR');
  }
}

export async function me(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
      return;
    }

    const user = await db.query.usersTable.findFirst({ where: eq(usersTable.id, userId) });
    if (!user) {
      sendError(res, 'User not found', 404, 'NOT_FOUND');
      return;
    }

    sendSuccess(res, { user: serializeUser(user) }, 'User fetched');
  } catch (error) {
    req.log.error({ err: error }, 'Get me error');
    sendError(res, 'Internal server error', 500, 'INTERNAL_ERROR');
  }
}
