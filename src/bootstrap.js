import { createApp } from './app.js';
import { createDatabase } from './database/database.js';
import { initializeDatabase } from './database/schema.js';
import { createReservationRepository } from './repositories/reservationRepository.js';
import { createSessionRepository } from './repositories/sessionRepository.js';
import { createReservationService } from './services/reservationService.js';

export async function createApplication({ databasePath = process.env.DATABASE_PATH } = {}) {
  const database = createDatabase(databasePath);
  await initializeDatabase(database);

  const sessionRepository = createSessionRepository(database);
  const reservationRepository = createReservationRepository(database);
  const reservationService = createReservationService({
    database,
    reservationRepository,
    sessionRepository
  });

  return {
    app: createApp({ reservationService }),
    database,
    reservationRepository,
    reservationService,
    sessionRepository
  };
}
