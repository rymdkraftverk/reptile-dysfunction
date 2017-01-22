import { Key, Gamepad } from 'l1-lite';
import Matter from 'matter-js';

const movementNormal = require('./movement-normal.js');

const SPEED = 3;
const MIN_SLIPPERY_SPEED = 2.5; 
const DISABLE_DURATION = 2; 
const MAX_SPEED = 5;
const MAX_TIME = 100;

module.exports = (controllerId) => ({
  duration: 0,
  run: (b, e) => {
    if (b.duration++ < DISABLE_DURATION)
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
    
    if (e.body.velocity.x > MAX_SPEED ){
      const vector = Matter.Vector.create(MAX_SPEED, e.body.velocity.y);
      Matter.Body.setVelocity(e.body, vector);
    }
    else if (e.body.velocity.x < -MAX_SPEED ){
      const vector = Matter.Vector.create(-MAX_SPEED, e.body.velocity.y);
      Matter.Body.setVelocity(e.body, vector);
    }

    if (e.body.velocity.y > MAX_SPEED ){
      const vector = Matter.Vector.create(e.body.velocity.x, MAX_SPEED);
      Matter.Body.setVelocity(e.body, vector);
    }
    else if (e.body.velocity.y < -MAX_SPEED ){
      const vector = Matter.Vector.create(e.body.velocity.x, -MAX_SPEED);
      Matter.Body.setVelocity(e.body, vector);
    }

    if(e.body.speed <= MIN_SLIPPERY_SPEED || b.duration > MAX_TIME) {
      e.behaviours.movement = movementNormal(controllerId);
    }
  }
})
