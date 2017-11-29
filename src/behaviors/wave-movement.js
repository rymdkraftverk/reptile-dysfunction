import { Physics } from 'l1';

const { Body, Vector } = Physics;

const WAVE_SPEED = 12;

module.exports = direction => ({
  run: (b, e) => {
    Body.setVelocity(e.body, Vector.mult(direction, WAVE_SPEED));
  },
});
