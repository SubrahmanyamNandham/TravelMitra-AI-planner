import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { validate } from '../middlewares/validate.js';
import { createTrip, listTrips, getTrip, updateTrip, deleteTrip } from '../controllers/trips.js';
import { createTripSchema, updateTripSchema } from '../schemas/trip.js';

export const tripsRouter = Router();

tripsRouter.use(authenticate);
tripsRouter.get('/', listTrips);
tripsRouter.post('/', validate(createTripSchema), createTrip);
tripsRouter.get('/:id', getTrip);
tripsRouter.patch('/:id', validate(updateTripSchema), updateTrip);
tripsRouter.delete('/:id', deleteTrip);
