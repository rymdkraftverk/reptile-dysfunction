import { Key } from 'l1-lite';
import Matter from 'matter-js';

const SPEED = 3;
module.exports = {
  run: (b, e) => {
    Matter.Body.setVelocity(e.body, Matter.Vector.create(0, 0))
    e.sprite.position.x = e.body.position.x;
    e.sprite.position.y = e.body.position.y;
    var x = 0;
    var y = 0;
    if (Key.isDown('right')) {
      x += SPEED;
    }
    if (Key.isDown('down')) {
      y += SPEED;
    }
    if (Key.isDown('left')) {
      x -= SPEED;
    }
    if (Key.isDown('up')) {
      y -= SPEED;
    }
    const direction = Matter.Vector.create(x, y)
    //Matter.Body.applyForce(e.body, e.body, direction);
    Matter.Body.setVelocity(e.body, direction)
  }
}
