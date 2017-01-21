import { Core, Key, Gamepad } from 'l1-lite';
import { Vector } from 'matter-js';
import addWave from '../entities/wave.js'

const SPEED = 3;
const COOLDOWN = 60;

module.exports = (controllerId) => ({
  cooldown: 0,
  run: (b, e) => {
    b.cooldown--;
    if (Key.isDown('space') || Gamepad.isPressed(e.controllerId, 1)) {
      const player = Core.get(controllerId);
      const direction = Vector.rotate(Vector.create(1, 0), player.body.angle);
      const waveStart = Vector.sub(player.body.position, Vector.mult(direction, 1000))
      if(b.cooldown < 0) {
        addWave(waveStart, direction);
        b.cooldown = COOLDOWN;
      }
    }
  }
})
