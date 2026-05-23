const rateLimit = require('express-rate-limit');
const config = require('../config');

module.exports = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many requests. Please try again later.'
  }
});
