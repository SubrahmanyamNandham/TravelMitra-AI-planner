import { Router } from 'express';
import { healthRouter } from './health.js';
import { authRouter } from './auth.js';
import { aiRouter } from './ai.js';
import { tripsRouter } from './trips.js';
import { destinationsRouter } from './destinations.js';

export const router = Router();

router.use('/healthz', healthRouter);
router.use('/auth', authRouter);
router.use('/ai', aiRouter);
router.use('/trips', tripsRouter);
router.use('/destinations', destinationsRouter);
