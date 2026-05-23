const config = require('../config');
const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const { user, tokens } = await authService.register({ name, email, password }, req.ip, req.get('User-Agent'));

  res
    .cookie(config.refreshTokenCookieName, tokens.refreshToken, {
      ...config.cookieOptions,
      maxAge: config.refreshTokenMaxAge,
      secure: config.isProduction,
      httpOnly: true
    })
    .status(201)
    .json({ user, accessToken: tokens.accessToken });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const { user, tokens } = await authService.authenticate({ email, password }, req.ip, req.get('User-Agent'));

  res
    .cookie(config.refreshTokenCookieName, tokens.refreshToken, {
      ...config.cookieOptions,
      maxAge: config.refreshTokenMaxAge,
      secure: config.isProduction,
      httpOnly: true
    })
    .status(200)
    .json({ user, accessToken: tokens.accessToken });
});

exports.refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies[config.refreshTokenCookieName];
  const { accessToken, refreshToken: newRefreshToken } = await authService.refreshAuthToken(refreshToken);

  res
    .cookie(config.refreshTokenCookieName, newRefreshToken, {
      ...config.cookieOptions,
      maxAge: config.refreshTokenMaxAge,
      secure: config.isProduction,
      httpOnly: true
    })
    .status(200)
    .json({ accessToken });
});

exports.logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies[config.refreshTokenCookieName];
  await authService.logout(refreshToken);

  res
    .clearCookie(config.refreshTokenCookieName, {
      ...config.cookieOptions,
      maxAge: 0
    })
    .status(200)
    .json({ message: 'Logout successful.' });
});

exports.me = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  res.status(200).json({ user });
});
