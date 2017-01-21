import { Key, Gamepad } from 'l1-lite';
import Matter from 'matter-js';

const SPEED = 3;
module.exports = (controllerId) => ({
  run: (b, e) => {
    Matter.Body.setVelocity(e.body, Matter.Vector.create(0, 0))
    var x = 0;
    var y = 0;
    if (Key.isDown('right')) {
         x += SPEED;
       } else if (Key.isDown('left')) {
         x -= SPEED;
       } else if (Gamepad.axisDir(controllerId, 0) != 0) {
         x += Gamepad.axisDir(controllerId, 0) * SPEED;
 	  } else {
 		x += Gamepad.axisDir(controllerId, 4);
 	  }
       if (Key.isDown('down')) {
         y += SPEED;
       } else if (Key.isDown('up')) {
         y -= SPEED;
       } else if (Gamepad.axisDir(controllerId, 1) != 0) {
         y += Gamepad.axisDir(controllerId, 1) * SPEED;
 	  } else {
 		y += Gamepad.axisDir(controllerId, 5) * SPEED;
 	  }
    const direction = Matter.Vector.create(x, y)
    //Matter.Body.applyForce(e.body, e.body, direction);
    Matter.Body.setVelocity(e.body, direction)
  }
})
