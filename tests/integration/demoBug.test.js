import { expect } from 'chai';
import request from 'supertest';
import { createSession, createTestApplication } from '../helpers/testApplication.js';

describe('Demostracion: la prueba detecta una reserva inconsistente', () => {
  let app;
  let database;
  let sessionRepository;

  beforeEach(async () => {
    ({ app, database, sessionRepository } = await createTestApplication());
  });

  afterEach(async () => {
    await database.close();
  });

  it('exige descontar el cupo cuando se confirma una reserva', async () => {
    const session = await createSession(sessionRepository, { availableSeats: 1 });

    await request(app)
      .post('/reservations')
      .send({ sessionId: session.id, studentEmail: 'valentina@example.edu' })
      .expect(201);

    const storedSession = await sessionRepository.findById(session.id);

    expect(storedSession.availableSeats).to.equal(0);
  });
});
