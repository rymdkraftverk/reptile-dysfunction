import { Core, Render, Entity, Key, Gamepad} from 'l1-lite';
import { World, Bodies } from 'matter-js'

import waveMovement from '../behaviours/wave-movement.js';
import syncSpriteBody from '../behaviours/sync-sprite-body.js';

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
  entity.body = Bodies.circle(initPos.x, initPos.y, 80);
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

  //None of these three lines seem to do anything
  entity.body.friction = 0;
  entity.behaviours['sync-sprite-body'] = syncSpriteBody;
  entity.behaviours['movement'] = waveMovement(direction);
}
