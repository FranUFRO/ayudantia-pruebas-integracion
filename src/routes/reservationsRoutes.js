import { Router } from 'express';
import { createReservationsController } from '../controllers/reservationsController.js';

export function createReservationsRouter({ reservationService }) {
  const router = Router();
  const controller = createReservationsController({ reservationService });

  router.post('/', controller.create);

  return router;
}
