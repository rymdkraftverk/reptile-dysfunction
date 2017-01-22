import { Key, Gamepad } from 'l1-lite';
import Matter from 'matter-js';

const movementNormal = require('./movement-normal.js');

const SPEED = 3;
const MIN_SLIPPERY_SPEED = 2.5; 
const DISABLE_DURATION = 2; 

module.exports = (controllerId) => ({
  duration: DISABLE_DURATION,
  run: (b, e) => {
    if (b.duration-- > 0)
      return;
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
    const force = Matter.Vector.div(direction, 1000)
    Matter.Body.applyForce(e.body, e.body.position, force);

    if(e.body.speed <= MIN_SLIPPERY_SPEED) {
      e.behaviours.movement = movementNormal(controllerId);
    }
  }
})
