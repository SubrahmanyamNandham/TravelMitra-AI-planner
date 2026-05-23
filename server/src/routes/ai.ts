import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { validate } from '../middlewares/validate.js';
import { chat, history, clearHistory, generateTrip } from '../controllers/ai.js';
import { aiLimiter } from '../middlewares/rateLimiter.js';
import { chatSchema, generateTripSchema } from '../schemas/ai.js';

export const aiRouter = Router();

aiRouter.post('/chat', authenticate, aiLimiter, validate(chatSchema), chat);
aiRouter.get('/chat/history', authenticate, aiLimiter, history);
aiRouter.delete('/chat/history', authenticate, aiLimiter, clearHistory);
aiRouter.post('/trips/generate', authenticate, aiLimiter, validate(generateTripSchema), generateTrip);
