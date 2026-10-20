export function createReservationRepository(database) {
  return {
    async create({ sessionId, studentEmail }) {
      const result = await database.run(
        `INSERT INTO reservations (session_id, student_email)
         VALUES (?, ?)`,
        [sessionId, studentEmail]
      );

      return database.get(
        `SELECT id, session_id AS sessionId, student_email AS studentEmail, created_at AS createdAt
         FROM reservations WHERE id = ?`,
        [result.lastID]
      );
    },

    async findAllBySessionId(sessionId) {
      return database.all(
        `SELECT id, session_id AS sessionId, student_email AS studentEmail, created_at AS createdAt
         FROM reservations WHERE session_id = ? ORDER BY id`,
        [sessionId]
      );
    }
  };
}
