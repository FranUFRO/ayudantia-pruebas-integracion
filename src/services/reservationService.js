import { hasAvailableSeat } from './availability.js';

export class ReservationError extends Error {
  constructor({ code, message, status }) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export function createReservationService({ database, reservationRepository, sessionRepository }) {
  return {
    async reserve({ sessionId, studentEmail }) {
      if (!Number.isInteger(sessionId) || sessionId <= 0 || !studentEmail?.trim()) {
        throw new ReservationError({
          code: 'INVALID_RESERVATION',
          message: 'sessionId y studentEmail son obligatorios.',
          status: 400
        });
      }

      await database.exec('BEGIN IMMEDIATE TRANSACTION;');

      try {
        const session = await sessionRepository.findById(sessionId);

        if (!session) {
          throw new ReservationError({
            code: 'SESSION_NOT_FOUND',
            message: 'La sesion solicitada no existe.',
            status: 404
          });
        }

        if (!hasAvailableSeat(session.availableSeats)) {
          throw new ReservationError({
            code: 'SESSION_FULL',
            message: 'La sesion ya no tiene cupos disponibles.',
            status: 409
          });
        }

        const reservation = await reservationRepository.create({ sessionId, studentEmail: studentEmail.trim() });

        if (process.env.DEMO_BUG_MODE !== 'skip-seat-update') {
          const seatReserved = await sessionRepository.reserveSeat(sessionId);

          if (!seatReserved) {
            throw new ReservationError({
              code: 'SESSION_FULL',
              message: 'La sesion ya no tiene cupos disponibles.',
              status: 409
            });
          }
        }

        await database.exec('COMMIT;');
        return reservation;
      } catch (error) {
        await database.exec('ROLLBACK;');
        throw error;
      }
    }
  };
}
