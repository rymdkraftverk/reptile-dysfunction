import { Core, Render, Entity, Key, Gamepad} from 'l1-lite';
import { World, Bodies, Body, Vector } from 'matter-js'
import { Howl } from 'howler';

import waveMovement from '../behaviours/wave-movement.js';
import syncSpriteBody from '../behaviours/sync-sprite-body.js';

const WAVE_LIFESPAN = 10 * 60;
const WAVE_COLLISION_GROUP = -3234;

module.exports = (initPos, direction) => {
  const entity = Entity.create('wave');

  entity.sprite = Render.getAnimation([
    'wave-1',
    'wave-1',
    'wave-2',
    'wave-2',
    'wave-3',
    'wave-3'
    ], 0.3);
  entity.type = 'wave';
  const { sprite } = entity;

  // Set position (Pixi)
  //entity.body = Bodies.circle(initPos.x, initPos.y, 80);
  entity.body = Bodies.rectangle(initPos.x, initPos.y, 150, 150, { 
                chamfer: { radius: [170, 0, 150, 0] }
  });
  Body.rotate(entity.body, Math.PI/4+Math.PI/2);
  Body.setInertia(entity.body, Infinity);
  entity.body.restitution = 1;
  entity.body.entity = entity; //Whyyy?!
  entity.body.collisionFilter.group = WAVE_COLLISION_GROUP;
  World.add(Core.engine.world, [entity.body]);

  let angle = Math.atan(direction.y/direction.x);
  if (direction.x < 0)
    angle += Math.PI;
  //angle += Math.PI;
  entity.sprite.rotation += angle;
  Body.rotate(entity.body, angle);

  sprite.width = 16;
  sprite.height = 16;
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;
  sprite.scale.x = 3;
  sprite.scale.y = 3;
  sprite.play()

  Render.add(sprite);
  Core.add(entity);
  const sound = new Howl({
    src: ['sounds/waves.wav']
  });
  sound.play();

  entity.body.friction = 0;
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
