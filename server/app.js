const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(config.cookieSecret));
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS']
  })
);
app.use(rateLimiter);

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ service: 'Travel.io Authentication API', status: 'ready' });
});

app.use(errorHandler);

module.exports = app;
