import { expect } from 'chai';
import { hasAvailableSeat } from '../../src/services/availability.js';

describe('hasAvailableSeat (prueba unitaria)', () => {
  it('devuelve true cuando hay al menos un cupo', () => {
    expect(hasAvailableSeat(1)).to.equal(true);
  });

  it('devuelve false cuando no hay cupos', () => {
    expect(hasAvailableSeat(0)).to.equal(false);
  });

  it('devuelve false para valores no validos', () => {
    expect(hasAvailableSeat(-1)).to.equal(false);
    expect(hasAvailableSeat(1.5)).to.equal(false);
  });
});
