import { Key } from 'l1-lite';
import Matter from 'matter-js';

module.exports = {
  run: (b, e) => {
    Matter.Body.setVelocity(e.body, Matter.Vector.create(1, 0))
  }
}
