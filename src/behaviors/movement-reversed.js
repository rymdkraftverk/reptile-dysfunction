import { Key, Gamepad, Physics, Util, Timer } from 'l1';
import normalMovement from './movement-normal';

const { getRandomInRange } = Util;
const { Body, Vector } = Physics;


const SPEED = 3;
module.exports = (controllerId) => ({
  timer: Timer.create(getRandomInRange(300, 350)),
  run: (b, e) => {
    Body.setVelocity(e.body, Vector.create(0, 0));
    let x = 0;
    let y = 0;
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
    const direction = Vector.create(x, y);
    // Body.applyForce(e.body, e.body, direction);
    Body.setVelocity(e.body, direction);

    if (b.timer.run()) {
      e.behaviors['movement-normal'] = normalMovement(e.controllerId);
      b.timer.reset();
    }
  },
});
