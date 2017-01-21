import Key from 'l1-lite';

const MAX_SLIPPERY_DURATION = 3 * 60;
const MIN_SLIPPERY_SPEED = 60;

const movementNormal = require('./movement-normal.js');

module.exports = {
  duration: MAX_SLIPPERY_DURATION,
  run: (b, e) => {
    e.sprite.position.x = e.body.position.x;
    e.sprite.position.y = e.body.position.y;
    var x = 0;
    var y = 0;
    if (Key.isDown('right')) {
      x += 1;
    }
    if (Key.isDown('down')) {
      y += 1;
    }
    if (Key.isDown('left')) {
      x -= 1;
    }
    if (Key.isDown('up')) {
      y -= 1;
    }
    const direction = Matter.Vector.create(x, y)
    Matter.Vector.div(direction, 100)
    Matter.Body.applyForce(e.body, e.body, direction);

    b.duration--;
    if(b.duration <= 0) {
        e.behaviours.movement = movementNormal;
    }
  }
}
