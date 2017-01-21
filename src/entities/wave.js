import { Core, Render, Entity, Key, Gamepad} from 'l1-lite';
import { World, Bodies, Body } from 'matter-js'
import { Howl } from 'howler';

import waveMovement from '../behaviours/wave-movement.js';
import syncSpriteBody from '../behaviours/sync-sprite-body.js';

const WAVE_LIFESPAN = 10 * 60;

module.exports = (initPos, direction) => {
  const entity = Entity.create('wave');

  entity.sprite = Render.getAnimation([
    'wave-1-flip',
    'wave-1-flip',
    'wave-2-flip',
    'wave-2-flip',
    'wave-3-flip',
    'wave-3-flip'
    ], 0.3);
  entity.type = 'wave';
  const { sprite } = entity;

  // Set position (Pixi)
  //entity.body = Bodies.circle(initPos.x, initPos.y, 80);
  entity.body = Bodies.rectangle(700, 450, 200, 200, { 
    chamfer: { radius: [200, 10, 350, 10] }
  });
  Body.rotate(entity.body, Math.PI/4+Math.PI/2);
  Body.setInertia(entity.body, Infinity);
  entity.body.entity = entity; //Whyyy?!
  World.add(Core.engine.world, [entity.body]);

  sprite.width = 16;
  sprite.height = 16;
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;
  sprite.scale.x = 4;
  sprite.scale.y = 4;
  sprite.play()

  Render.add(sprite);
  Core.add(entity);
  const sound = new Howl({
    src: ['sounds/waves.wav']
  });
  sound.play();

  //None of these three lines seem to do anything
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
