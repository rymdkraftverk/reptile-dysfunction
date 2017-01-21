import { Render, Entity, Key, Gamepad} from 'l1-lite';
import Matter from 'matter-js'

import movementNormal from '../behaviours/movement-normal.js';

module.exports = core => {
  const entity = Entity.create('lizard');
  entity.type = 'player';
  entity.sprite = Render.getSprite('lizard1');
  const { sprite } = entity;

  // Set position (Pixi)
  entity.body = core.Bodies.circle(800, 450, 10);
  core.World.add(core.engine.world, [entity.body]);
  /*
  sprite.position.y = 0;
  sprite.position.x = 0;
  */
  sprite.width = 10;
  sprite.height = 10;
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;
  sprite.scale.x = 4;
  sprite.scale.y = 4;

  const { body } = entity;

  body.entity = entity;
  body.sprite = sprite;

  core.Render.add(sprite);
  core.add(entity);

  entity.behaviours['movement'] = movementNormal;
}
