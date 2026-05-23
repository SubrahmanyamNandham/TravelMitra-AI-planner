import jwt from 'jsonwebtoken';
import { env } from './env.js';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface RefreshTokenPayload {
  sub: string;
}

const accessSecret = env.SESSION_SECRET;
const refreshSecret = `${env.SESSION_SECRET}:refresh-token`;

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, accessSecret, { algorithm: 'HS256', expiresIn: '15m' });
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId }, refreshSecret, { algorithm: 'HS256', expiresIn: '7d' });
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    return jwt.verify(token, accessSecret) as AccessTokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    return jwt.verify(token, refreshSecret) as RefreshTokenPayload;
  } catch {
    return null;
  }
}
