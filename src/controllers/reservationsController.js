export function createReservationsController({ reservationService }) {
  return {
    async create(request, response, next) {
      try {
        const reservation = await reservationService.reserve({
          sessionId: Number(request.body.sessionId),
          studentEmail: request.body.studentEmail
        });

        response.status(201).json(reservation);
      } catch (error) {
        next(error);
      }
    }
  };
}
