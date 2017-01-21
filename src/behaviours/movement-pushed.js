import { Key, Gamepad } from 'l1-lite';
import Matter from 'matter-js';

const movementNormal = require('./movement-normal.js');

const SPEED = 3;
const MIN_SLIPPERY_SPEED = 0.4; //TODO Find reasonable value

module.exports = (controllerId) => ({
  run: (b, e) => {
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
    //const direction = Matter.Vector.create(x, y)
    //Matter.Vector.div(direction, 1000)
    //Matter.Body.applyForce(e.body, {x: 1, y: 0}, direction);

    if(e.body.speed <= MIN_SLIPPERY_SPEED) {
      e.behaviours.movement = movementNormal(controllerId);
    }
  }
})
