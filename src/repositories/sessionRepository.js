export function createSessionRepository(database) {
  return {
    async create({ topic, startsAt, availableSeats }) {
      const result = await database.run(
        `INSERT INTO sessions (topic, starts_at, available_seats)
         VALUES (?, ?, ?)`,
        [topic, startsAt, availableSeats]
      );

      return this.findById(result.lastID);
    },

    async findById(id) {
      const row = await database.get(
        `SELECT id, topic, starts_at AS startsAt, available_seats AS availableSeats
         FROM sessions WHERE id = ?`,
        [id]
      );

      return row ?? null;
    },

    async reserveSeat(id) {
      const result = await database.run(
        `UPDATE sessions
         SET available_seats = available_seats - 1
         WHERE id = ? AND available_seats > 0`,
        [id]
      );

      return result.changes === 1;
    }
  };
}
