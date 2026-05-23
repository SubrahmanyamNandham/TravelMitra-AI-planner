const AppError = require('../utils/AppError');

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const response = {
    status: statusCode >= 500 ? 'error' : 'fail',
    message: err.message || 'An unexpected error occurred.'
  };

  if (process.env.NODE_ENV !== 'production' && err.details) {
    response.details = err.details;
  }

  if (err.name === 'ValidationError') {
    response.status = 'fail';
    response.message = Object.values(err.errors)
      .map((error) => error.message)
      .join('; ');
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    response.status = 'fail';
    response.message = 'Duplicate value error. A record with this value already exists.';
  }

  res.status(statusCode).json(response);
};
