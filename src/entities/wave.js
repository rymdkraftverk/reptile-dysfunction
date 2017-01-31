import { Core, Render, Entity, Key, Gamepad, Physics} from 'l1-lite';
const { World, Bodies, Body, Vector } = Physics;
import { Howl } from 'howler';

import waveMovement from '../behaviours/wave-movement.js';
import syncSpriteBody from '../behaviours/sync-sprite-body.js';

const WAVE_LIFESPAN = 10 * 60;
const WAVE_COLLISION_GROUP = -3234;
let wave_counter = 0;

module.exports = (initPos, direction) => {
  const entity = Entity.create(wave_counter++);

  Entity.addAnimation(entity, [
    'wave-1',
    'wave-1',
    'wave-2',
    'wave-2',
    'wave-3',
    'wave-3'
    ], 0.3);
  entity.type = 'wave';

  Entity.addBody(entity, Bodies.rectangle(initPos.x, initPos.y, 150, 150, { 
                chamfer: { radius: [170, 0, 150, 0] }
  }));
  Body.rotate(entity.body, Math.PI/4+Math.PI/2);
  Body.setInertia(entity.body, Infinity);
  const { animation, body } = entity; 
  body.restitution = 1;
  body.collisionFilter.group = WAVE_COLLISION_GROUP;

  let angle = Math.atan(direction.y/direction.x);
  if (direction.x < 0)
    angle += Math.PI;
  animation.rotation += angle;
  Body.rotate(body, angle);

  animation.width = 16;
  animation.height = 16;
  animation.anchor.x = 0.5;
  animation.anchor.y = 0.5;
  animation.scale.x = 3;
  animation.scale.y = 3;
  animation.play()

  Core.add(entity);
  const sound = new Howl({
    src: ['sounds/waves.wav']
  });
  sound.play();

  body.friction = 0;

  entity.behaviours['sync-sprite-body'] = syncSpriteBody;
  entity.behaviours['movement'] = waveMovement(direction);
  entity.behaviours['suicide-switch'] = {
    timer: 0,
    run: (b, e) => {
      b.timer++;
      if(b.timer > WAVE_LIFESPAN) {
        Render.remove(e.sprite)
        Core.remove(e)
      }
    }
  }
}
