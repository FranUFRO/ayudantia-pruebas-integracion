import { expect } from 'chai';
import request from 'supertest';
import { createSession, createTestApplication } from '../helpers/testApplication.js';

describe('Reserva de cupo - integracion Big Bang', () => {
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

  it('ejecuta el flujo completo y evita sobrepasar la capacidad de la sesion', async () => {
    const session = await createSession(sessionRepository, { availableSeats: 1 });

    await request(app)
      .post('/reservations')
      .send({ sessionId: session.id, studentEmail: 'ana@example.edu' })
      .expect(201);

    const secondResponse = await request(app)
      .post('/reservations')
      .send({ sessionId: session.id, studentEmail: 'bruno@example.edu' })
      .expect(409);

    const storedSession = await sessionRepository.findById(session.id);
    const storedReservations = await reservationRepository.findAllBySessionId(session.id);

    expect(secondResponse.body).to.include({ error: 'SESSION_FULL' });
    expect(storedSession.availableSeats).to.equal(0);
    expect(storedReservations).to.have.length(1);
    expect(storedReservations[0].studentEmail).to.equal('ana@example.edu');
  });
});
