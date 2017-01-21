import { World, Core, Render, Entity, Key, Gamepad} from 'l1-lite';
import Matter from 'matter-js'

export default (core) => {
  const entity = Entity.create('chest');
  entity.type = 'chest';
  entity.sprite = Render.getSprite('chest');

  const { sprite } = entity;
  sprite.scale.x = 1;
  sprite.scale.y = 1;
  sprite.position.y = 100;
  sprite.position.x = 100;

//  entity.body = core.Bodies.rectangle(800, 450, 10);
 // core.World.add(core.engine.world, [entity.body]);

/*
  const { body } = entity;

  body.entity = entity;
  body.sprite = sprite;
*/

  Render.add(sprite);
  Core.add(entity);
}
