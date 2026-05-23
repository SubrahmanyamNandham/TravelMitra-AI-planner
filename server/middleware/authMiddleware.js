const jwt = require('jsonwebtoken');
const config = require('../config');
const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return next(new AppError(401, 'Authorization header is missing or invalid.'));
  }

  const token = authorizationHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, config.jwtAccessSecret);
    req.user = {
      id: payload.sub,
      email: payload.email
    };
    return next();
  } catch (error) {
    return next(new AppError(401, 'Access token is invalid or expired.'));
  }
};
