import { expect } from 'chai';
import { createSession, createTestApplication } from '../helpers/testApplication.js';

describe('Reserva de cupo - integracion Bottom-Up', () => {
  let database;
  let reservationRepository;
  let sessionRepository;

  beforeEach(async () => {
    ({ database, reservationRepository, sessionRepository } = await createTestApplication());
  });

  afterEach(async () => {
    await database.close();
  });

  it('persiste una sesion y su reserva en las tablas relacionadas', async () => {
    const session = await createSession(sessionRepository);

    const reservation = await reservationRepository.create({
      sessionId: session.id,
      studentEmail: 'sofia@example.edu'
    });

    const storedSession = await sessionRepository.findById(session.id);
    const storedReservations = await reservationRepository.findAllBySessionId(session.id);

    expect(reservation).to.include({ sessionId: session.id, studentEmail: 'sofia@example.edu' });
    expect(storedSession).to.include({ topic: 'Pruebas de integracion', availableSeats: 1 });
    expect(storedReservations).to.have.length(1);
    expect(storedReservations[0]).to.include({ id: reservation.id, studentEmail: 'sofia@example.edu' });
  });
});
