import { Router } from 'express';
import { signup, login, refresh, logout, me } from '../controllers/auth.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validate } from '../middlewares/validate.js';
import { signupSchema, loginSchema } from '../schemas/auth.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

export const authRouter = Router();

authRouter.post('/signup', authLimiter, validate(signupSchema), signup);
authRouter.post('/login', authLimiter, validate(loginSchema), login);
authRouter.post('/refresh', authLimiter, refresh);
authRouter.post('/logout', authLimiter, authenticate, logout);
authRouter.get('/me', authLimiter, authenticate, me);
