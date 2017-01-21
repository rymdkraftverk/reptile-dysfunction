import { Key } from 'l1-lite';
import { Body, Vector } from 'matter-js';

const WAVE_SPEED = 15;

module.exports = direction => ({
  run: (b, e) => {
    Body.setVelocity(e.body, Vector.mult(direction, WAVE_SPEED));
    e.sprite.position.x = e.body.position.x;
    e.sprite.position.y = e.body.position.y;
  }
})
