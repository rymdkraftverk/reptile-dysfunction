import { Key, Gamepad, Physics } from 'l1';
import addWave from '../entities/wave';

const { Vector } = Physics;

const COOLDOWN = 60;

module.exports = () => ({
  cooldown: 0,
  run: (b, e) => {
    b.cooldown--;
    if (e.alignment === 'evil' && (Gamepad.isPressed(e.controllerId, 1) || Key.isDown('space'))) { // TODO Potential errors with evil player check, cannot test. Space can _always_ fire, regardless of evil player, for debug purposes. Not currently intended for a 5th player.
      const player = e; // Should be equivialent to: Core.get(controllerId);
      const direction = Vector.rotate(Vector.create(1, 0), player.body.angle); // angle is never pi/2, so vertical waves aren't possible
      const waveStart = Vector.sub(player.body.position, Vector.mult(direction, 1000));
      if (b.cooldown < 0) {
        addWave(waveStart, direction);
        b.cooldown = COOLDOWN;
      }
    }
  },
});
