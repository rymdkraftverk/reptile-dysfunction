import { Key } from 'l1-lite';

module.exports = {
  run: (b, e) => {
    Matter.Body.setVelocity(e.body, Matter.Vector.create(0, 0))
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
    //Matter.Body.applyForce(e.body, e.body, direction);
    Matter.Body.setVelocity(e.body, direction)
  }
}
