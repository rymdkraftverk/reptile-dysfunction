import {Core, Entity, Render, Physics} from 'l1-lite'
const { Bodies, World, Events } = Physics;

export default () => {

  const entity = Entity.create('map');
  Entity.addSprite(entity, 'map', {
    zIndex: 999
  });
  entity.type = 'map';
  Entity.addBody(entity, Bodies.circle(1660/2+15, (930/2)-5, 430, {
    isSensor: true
  }));

  Events.on(Core.engine, 'collisionEnd', (event) => {
    const { pairs } = event;

    let deleteMes = [];
    for (let i = 0, j = pairs.length; i != j; ++i) {
        const pair = pairs[i];
        const { bodyA, bodyB } = pair;
        if (!bodyA.entity || !bodyB.entity) continue;
        if (bodyA !== entity.body && bodyB !== entity.body) continue;

        if (bodyB.entity.type === 'map' && bodyA.entity.type === 'player') {
          bodyA.entity.behaviours['killed'].killed = true;
        } else if (bodyA.entity.type === 'map' && bodyB.entity.type === 'player') {
          bodyB.entity.behaviours['killed'].killed = true;
        }
    }
  });

  const { sprite, body } = entity;

  body.sprite = sprite;

  sprite.position.y = 0;
  sprite.position.x = 0;
  sprite.width = 1660;
  sprite.height = 930;

  Core.add(entity);
}
