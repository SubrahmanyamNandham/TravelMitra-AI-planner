const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/userRepository');
const RefreshTokenRepository = require('../repositories/refreshTokenRepository');
const config = require('../config');
const AppError = require('../utils/AppError');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (candidate, hashed) => bcrypt.compare(candidate, hashed);

const createAccessToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email
    },
    config.jwtAccessSecret,
    {
      expiresIn: config.accessTokenExpiresIn
    }
  );

const createRefreshToken = (user) =>
  jwt.sign(
    {
      sub: user.id
    },
    config.jwtRefreshSecret,
    {
      expiresIn: config.refreshTokenExpiresIn
    }
  );

const getExpiryDate = () => new Date(Date.now() + config.refreshTokenMaxAge);

const buildTokenPayload = async (user, ip, userAgent) => {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  await RefreshTokenRepository.createRefreshToken({
    token: refreshToken,
    user: user.id,
    expiresAt: getExpiryDate(),
    ip,
    userAgent
  });

  return { accessToken, refreshToken };
};

exports.register = async ({ name, email, password }, ip, userAgent) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (await UserRepository.existsByEmail(normalizedEmail)) {
    throw new AppError(409, 'Email already registered.');
  }

  const passwordHash = await hashPassword(password);
  const user = await UserRepository.createUser({ name: name.trim(), email: normalizedEmail, password: passwordHash });

  const tokens = await buildTokenPayload(user, ip, userAgent);

  return { user, tokens };
};

exports.authenticate = async ({ email, password }, ip, userAgent) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await UserRepository.findUserByEmail(normalizedEmail);

  if (!user) {
    throw new AppError(401, 'Credentials are invalid.');
  }

  const passwordMatches = await comparePassword(password, user.password);
  if (!passwordMatches) {
    throw new AppError(401, 'Credentials are invalid.');
  }

  const tokens = await buildTokenPayload(user, ip, userAgent);

  return { user, tokens };
};

exports.refreshAuthToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError(401, 'Refresh token is required.');
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, config.jwtRefreshSecret);
  } catch (err) {
    throw new AppError(401, 'Refresh token is invalid or expired.');
  }

  const storedToken = await RefreshTokenRepository.findByToken(refreshToken);
  if (!storedToken || !storedToken.isActive) {
    throw new AppError(401, 'Refresh token is no longer active.');
  }

  const user = await UserRepository.findUserById(payload.sub);
  if (!user) {
    throw new AppError(401, 'Refresh token belongs to an unknown user.');
  }

  const { accessToken, refreshToken: newRefreshToken } = await buildTokenPayload(user, storedToken.ip, storedToken.userAgent);
  await RefreshTokenRepository.revokeToken(storedToken.id, newRefreshToken);

  return { user, accessToken, refreshToken: newRefreshToken };
};

exports.logout = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  const storedToken = await RefreshTokenRepository.findByToken(refreshToken);
  if (!storedToken || !storedToken.isActive) {
    return;
  }

  await RefreshTokenRepository.revokeToken(storedToken.id);
};

exports.getProfile = async (userId) => {
  const user = await UserRepository.findUserById(userId);
  if (!user) {
    throw new AppError(404, 'User not found.');
  }

  return user;
};
