import {Core, Entity, Render} from 'l1-lite'
import { Bodies, World, Events } from 'matter-js'

export default (core) => {
  
const entity = Entity.create('map');
  entity.sprite = Render.getSprite('map');
  entity.type = 'map';
  entity.body = Bodies.circle(1660/2, (930/2)-15, 430, {
    isSensor: true
  });
  
  Events.on(core.engine, 'collisionEnd', (event) => {
    const { pairs } = event;
    
    let deleteMes = [];
    for (let i = 0, j = pairs.length; i != j; ++i) {
        const pair = pairs[i];
        const { bodyA, bodyB } = pair;
        if (!bodyA.entity || !bodyB.entity) continue;
        if (bodyA !== entity.body && bodyB !== entity.body) continue;

        if (bodyB.entity.type === 'map' && bodyA.entity.type === 'player') {
          var obj = {
            entity: bodyA.entity,
            sprite: bodyA.sprite,
            body: bodyA
          }
          deleteMes = deleteMes.concat(obj);
        } else if (bodyA.entity.type === 'map' && bodyB.entity.type === 'player') {
          var obj = {
            entity: bodyB.entity,
            sprite: bodyB.sprite,
            body: bodyB
          }
          deleteMes = deleteMes.concat(obj);
        }
    }
    deleteMes.forEach(d => {
      Core.remove(d.entity);
      Render.remove(d.sprite);
      World.remove(core.engine.world, [d.body]);
    })
  });

  const { sprite } = entity;
  const { body } = entity;

  body.entity = entity;
  body.sprite = sprite;

  sprite.position.y = 0;
  sprite.position.x = 0;
  sprite.width = 1660;
  sprite.height = 930;
  //sprite.scale.x = 4;
  //sprite.scale.y = 4;
  World.add(core.engine.world, [body]);
  Render.add(sprite);
  Core.add(entity);

}
