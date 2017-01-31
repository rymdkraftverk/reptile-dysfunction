import { Key, Gamepad, Physics } from 'l1-lite';
const { Events, Body, Vector } = Physics;

import normalMovement from './movement-normal'

const SPEED = 3;
module.exports = (controllerId) => ({
  time: 400,
  run: (b, e) => {
    Body.setVelocity(e.body, Vector.create(0, 0))
    var x = 0;
    var y = 0;
    if (Key.isDown('right')) {
         x -= SPEED;
       } else if (Key.isDown('left')) {
         x += SPEED;
       } else if (Gamepad.axisDir(controllerId, 0) != 0) {
         x -= (Gamepad.axisDir(controllerId, 0) * SPEED);
 	  } else {
 		x -= Gamepad.axisDir(controllerId, 4);
 	  }
       if (Key.isDown('down')) {
         y -= SPEED;
       } else if (Key.isDown('up')) {
         y += SPEED;
       } else if (Gamepad.axisDir(controllerId, 1) != 0) {
         y -= Gamepad.axisDir(controllerId, 1) * SPEED;
 	  } else {
 		y -= Gamepad.axisDir(controllerId, 5) * SPEED;
 	  }
    const direction = Vector.create(x, y)
    //Body.applyForce(e.body, e.body, direction);
    Body.setVelocity(e.body, direction)

    b.time--;
    if (b.time<=0){
      e.behaviours['movement-normal'] = normalMovement(e.controllerId);
      b.time = 300;
    }
  }
})
