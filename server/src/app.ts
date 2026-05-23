import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { env } from './lib/env.js';
import { logger } from './lib/logger.js';
import { generalLimiter, authLimiter, aiLimiter } from './middlewares/rateLimiter.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { router } from './routes/index.js';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (env.ALLOWED_ORIGINS.includes('*')) {
        callback(null, origin);
        return;
      }

      callback(null, env.ALLOWED_ORIGINS.includes(origin) ? origin : false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(pinoHttp({ logger }));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());
app.use(generalLimiter);

app.use('/api', router);
app.use(errorHandler);

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});
