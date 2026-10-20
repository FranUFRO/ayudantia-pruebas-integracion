import { expect } from 'chai';
import request from 'supertest';
import { createSession, createTestApplication } from '../helpers/testApplication.js';

describe('Reserva de cupo - integracion Sandwich', () => {
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

  it('une la API de reservas con la verificacion directa del estado persistido', async () => {
    const session = await createSession(sessionRepository, { availableSeats: 2 });

    await request(app)
      .post('/reservations')
      .send({ sessionId: session.id, studentEmail: 'diego@example.edu' })
      .expect(201);

    const storedSession = await sessionRepository.findById(session.id);
    const storedReservations = await reservationRepository.findAllBySessionId(session.id);

    expect(storedSession.availableSeats).to.equal(1);
    expect(storedReservations).to.have.length(1);
    expect(storedReservations[0].studentEmail).to.equal('diego@example.edu');
  });
});
