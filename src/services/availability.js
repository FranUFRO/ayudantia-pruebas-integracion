export function hasAvailableSeat(availableSeats) {
  return Number.isInteger(availableSeats) && availableSeats > 0;
}
