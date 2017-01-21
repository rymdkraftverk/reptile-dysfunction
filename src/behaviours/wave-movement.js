import { Key } from 'l1-lite';
import Matter from 'matter-js';

module.exports = {
  run: (b, e) => {
    Matter.Body.setVelocity(e.body, Matter.Vector.create(1, 0))
    e.sprite.position.x = e.body.position.x;
    e.sprite.position.y = e.body.position.y;
  }
}
