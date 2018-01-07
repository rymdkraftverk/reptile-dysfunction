import { Game, Entity, Physics } from 'l1';

const { Bodies, Events } = Physics;

export default () => {
  const entity = Entity.create('map');
  Entity.addSprite(entity, 'map', {
    zIndex: -999,
  });
  entity.type = 'map';
  Entity.addBody(entity, Bodies.circle((1660 / 2) + 15, (930 / 2) - 5, 430, {
    isSensor: true,
  }));

  Events.on(Game.getPhysicsEngine(), 'collisionEnd', (event) => {
    const { pairs } = event;

    for (let i = 0, j = pairs.length; i !== j; ++i) {
      const pair = pairs[i];
      const { bodyA, bodyB } = pair;
      if (!bodyA.entity || !bodyB.entity) continue;
      if (bodyA !== entity.body && bodyB !== entity.body) continue;

      if (bodyB.entity.type === 'map' && bodyA.entity.type === 'player') {
        bodyA.entity.behaviors.killed.killed = true;
      } else if (bodyA.entity.type === 'map' && bodyB.entity.type === 'player') {
        bodyB.entity.behaviors.killed.killed = true;
      }
    }
  });

  const { sprite, body } = entity;

  body.sprite = sprite;

  sprite.position.y = 0;
  sprite.position.x = 0;
  sprite.width = 1660;
  sprite.height = 930;
};
