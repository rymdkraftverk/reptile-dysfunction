import { Key, Gamepad, Physics } from 'l1';

const { Body, Vector } = Physics;

const SPEED = 3;
const MOVEMENT_THREASHOLD = 0.2;

module.exports = (controllerId) => ({
  run: (b, e) => {
    Body.setVelocity(e.body, Vector.create(0, 0));
    let x = 0;
    let y = 0;
    if (Key.isDown('right')) {
      x += SPEED;
    } else if (Key.isDown('left')) {
      x -= SPEED;
    } else if (Gamepad.axisDir(controllerId, 0) !== 0) {
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
    const direction = Vector.create(x, y);

    const east = Vector.create(1, 0);
    const angle = Vector.angle(east, direction);
    Body.setAngle(e.body, angle);

    Body.setVelocity(e.body, direction);
  },
});

function checkThreashold(speed) {
  return (Math.abs(speed) > MOVEMENT_THREASHOLD);
}
