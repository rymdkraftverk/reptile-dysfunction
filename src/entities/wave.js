import { Core, Render, Entity, Key, Gamepad} from 'l1-lite';
import { World, Bodies } from 'matter-js'

import waveMovement from '../behaviours/wave-movement.js';
import syncSpriteBody from '../behaviours/sync-sprite-body.js';

module.exports = (initPos, direction) => {
  const entity = Entity.create('wave');
  entity.sprite = Render.getSprite('anpanman');
  const { sprite } = entity;

  // Set position (Pixi)
  entity.body = Bodies.circle(initPos.x, initPos.y, 80);
  World.add(Core.engine.world, [entity.body]);

  sprite.width = 16;
  sprite.height = 16;
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;
  sprite.scale.x = 10;
  sprite.scale.y = 10;

  Render.add(sprite);
  Core.add(entity);

  entity.body.friction = 0;
  entity.behaviours['sync-sprite-body'] = syncSpriteBody;
  entity.behaviours['movement'] = waveMovement(direction);
}
