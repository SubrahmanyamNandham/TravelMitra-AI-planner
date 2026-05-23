import { Router } from 'express';
import { listDestinations, getDestination } from '../controllers/destinations.js';

export const destinationsRouter = Router();

destinationsRouter.get('/', listDestinations);
destinationsRouter.get('/:id', getDestination);
