import { Render, Entity, Key, Gamepad} from 'l1-lite';
import Matter from 'matter-js'

import waveMovement from '../behaviours/wave-movement.js';

module.exports = core => {
  const entity = Entity.create('wave');
  entity.sprite = Render.getSprite('anpanman');
  const { sprite } = entity;

  // Set position (Pixi)
  entity.body = core.Bodies.circle(0, 450, 80);
  core.World.add(core.engine.world, [entity.body]);
  /*
  sprite.position.y = 0;
  sprite.position.x = 0;
  */
  sprite.width = 16;
  sprite.height = 16;
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;
  sprite.scale.x = 10;
  sprite.scale.y = 10;

  core.Render.add(sprite);
  core.add(entity);

  entity.body.friction = 0;
  entity.behaviours['movement'] = waveMovement;
}
