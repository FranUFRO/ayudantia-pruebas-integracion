import { createApplication } from '../../src/bootstrap.js';

export async function createTestApplication() {
  return createApplication({ databasePath: ':memory:' });
}

export async function createSession(sessionRepository, overrides = {}) {
  return sessionRepository.create({
    availableSeats: 1,
    startsAt: '2026-11-03T15:00:00Z',
    topic: 'Pruebas de integracion',
    ...overrides
  });
}
