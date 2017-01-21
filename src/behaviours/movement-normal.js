import { Key, Gamepad } from 'l1-lite';
import Matter from 'matter-js';

const SPEED = 3;
const MOVEMENT_THREASHOLD = 0.2;

module.exports = (controllerId) => ({
  run: (b, e) => {
    Matter.Body.setVelocity(e.body, Matter.Vector.create(0, 0));
    var x = 0;
    var y = 0;
    if (Key.isDown('right')) {
         x += SPEED;
    } else if (Key.isDown('left')) {
      x -= SPEED;
    } else if (Gamepad.axisDir(controllerId, 0) != 0) {
      const axisDir = Gamepad.axisDir(controllerId, 0);
      if (checkThreashold(axisDir)) {
        x += axisDir * SPEED;
      }
 	  } else {
 		x += Gamepad.axisDir(controllerId, 4);
 	  }
    if (Key.isDown('down')) {
      y += SPEED;
    } else if (Key.isDown('up')) {
      y -= SPEED;
    } else if (Gamepad.axisDir(controllerId, 1) != 0) {
      const axisDir = Gamepad.axisDir(controllerId, 1);
      if (checkThreashold(axisDir)) {
        y += axisDir * SPEED;
      }
 	  } else {
 		y += Gamepad.axisDir(controllerId, 5) * SPEED;
 	  }
    const direction = Matter.Vector.create(x, y)

    const east = Matter.Vector.create(1, 0)
    const angle = Matter.Vector.angle(east, direction);
    Matter.Body.setAngle(e.body, angle);

    Matter.Body.setVelocity(e.body, direction)
  }
})

function checkThreashold(speed){
  return (Math.abs(speed) > MOVEMENT_THREASHOLD);
}