import express from 'express';
import { createReservationsRouter } from './routes/reservationsRoutes.js';

export function createApp({ reservationService } = {}) {
  const app = express();

  app.use(express.json());

  app.get('/health', (_request, response) => {
    response.status(200).json({ ok: true });
  });

  if (reservationService) {
    app.use('/reservations', createReservationsRouter({ reservationService }));
  }

  app.use((error, _request, response, _next) => {
    response.status(error.status ?? 500).json({
      error: error.code ?? 'INTERNAL_ERROR',
      message: error.message ?? 'Error interno del servidor'
    });
  });

  return app;
}

export default createApp();
