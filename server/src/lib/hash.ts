import bcrypt from 'bcrypt';
import { createHash } from 'crypto';

const DUMMY_PASSWORD_HASH = '$2b$12$KIX6sfJ7.qbOqH9s8d4vzunQ2bxVdMVh1hR6Kywm3zLTZ2Sd4hX4G';

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function comparePassword(plain: string, hash: string | null): Promise<boolean> {
  return bcrypt.compare(plain, hash ?? DUMMY_PASSWORD_HASH);
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
