const { db } = require('../db');

const mapRefreshToken = (row) =>
  row
    ? {
        id: row.id,
        token: row.token,
        user: row.user_id,
        userAgent: row.user_agent,
        ip: row.ip,
        expiresAt: row.expires_at,
        revokedAt: row.revoked_at,
        replacedByToken: row.replaced_by_token,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        isExpired: row.expires_at <= new Date(),
        isActive: !row.revoked_at && row.expires_at > new Date()
      }
    : null;

exports.createRefreshToken = async ({ token, user, expiresAt, ip, userAgent }) => {
  const [refreshToken] = await db('refresh_tokens')
    .insert({
      token,
      user_id: user,
      expires_at: expiresAt,
      ip,
      user_agent: userAgent
    })
    .returning([
      'id',
      'token',
      'user_id',
      'user_agent',
      'ip',
      'expires_at',
      'revoked_at',
      'replaced_by_token',
      'created_at',
      'updated_at'
    ]);
  return mapRefreshToken(refreshToken);
};

exports.findByToken = async (token) => {
  const row = await db('refresh_tokens').where({ token }).first();
  return mapRefreshToken(row);
};

exports.revokeToken = async (tokenId, replacedByToken = null) => {
  const [refreshToken] = await db('refresh_tokens')
    .where({ id: tokenId })
    .update({ revoked_at: new Date(), replaced_by_token: replacedByToken })
    .returning([
      'id',
      'token',
      'user_id',
      'user_agent',
      'ip',
      'expires_at',
      'revoked_at',
      'replaced_by_token',
      'created_at',
      'updated_at'
    ]);
  return mapRefreshToken(refreshToken);
};

exports.deleteByUser = async (userId) => db('refresh_tokens').where({ user_id: userId }).del();
