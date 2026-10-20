import { expect } from 'chai';
import request from 'supertest';
import { createSession, createTestApplication } from '../helpers/testApplication.js';

describe('Reserva de cupo - integracion Top-Down', () => {
  let app;
  let database;
  let reservationRepository;
  let sessionRepository;

  beforeEach(async () => {
    ({ app, database, reservationRepository, sessionRepository } = await createTestApplication());
  });

  afterEach(async () => {
    await database.close();
  });

  it('recorre HTTP, servicio y SQLite para confirmar una reserva y descontar un cupo', async () => {
    const session = await createSession(sessionRepository);

    const response = await request(app)
      .post('/reservations')
      .send({ sessionId: session.id, studentEmail: 'camila@example.edu' })
      .expect(201);

    const storedSession = await sessionRepository.findById(session.id);
    const storedReservations = await reservationRepository.findAllBySessionId(session.id);

    expect(response.body).to.include({ sessionId: session.id, studentEmail: 'camila@example.edu' });
    expect(storedSession.availableSeats).to.equal(0);
    expect(storedReservations).to.have.length(1);
  });

  it('rechaza una reserva incompleta sin escribir datos', async () => {
    const session = await createSession(sessionRepository);

    const response = await request(app)
      .post('/reservations')
      .send({ sessionId: session.id, studentEmail: '   ' })
      .expect(400);

    const storedSession = await sessionRepository.findById(session.id);
    const storedReservations = await reservationRepository.findAllBySessionId(session.id);

    expect(response.body).to.include({ error: 'INVALID_RESERVATION' });
    expect(storedSession.availableSeats).to.equal(1);
    expect(storedReservations).to.be.empty;
  });
});
