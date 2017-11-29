import { Entity, Physics, Sound } from 'l1';
import waveMovement from '../behaviors/wave-movement';
import syncSpriteBody from '../behaviors/sync-sprite-body';

const {
  Bodies, Body,
} = Physics;


const WAVE_LIFESPAN = 10 * 60;
const WAVE_COLLISION_GROUP = -3234;
let waveCounter = 0;

module.exports = (initPos, direction) => {
  const entity = Entity.create(waveCounter++);

  Entity.addAnimation(entity, [
    'wave-1',
    'wave-1',
    'wave-2',
    'wave-2',
    'wave-3',
    'wave-3',
  ], 0.3);
  entity.type = 'wave';

  Entity.addBody(entity, Bodies.rectangle(initPos.x, initPos.y, 150, 150, {
    chamfer: { radius: [170, 0, 150, 0] },
  }));
  Body.rotate(entity.body, (Math.PI / 4) + (Math.PI / 2));
  Body.setInertia(entity.body, Infinity);
  const { animation, body } = entity;
  body.restitution = 1;
  body.collisionFilter.group = WAVE_COLLISION_GROUP;

  let angle = Math.atan(direction.y / direction.x);
  if (direction.x < 0) { angle += Math.PI; }
  animation.rotation += angle;
  Body.rotate(body, angle);

  animation.width = 16;
  animation.height = 16;
  animation.anchor.x = 0.5;
  animation.anchor.y = 0.5;
  animation.scale.x = 3;
  animation.scale.y = 3;
  animation.play();

  const sound = Sound.getSound('sounds/waves.wav');
  sound.play();

  body.friction = 0;

  entity.behaviors['sync-sprite-body'] = syncSpriteBody;
  entity.behaviors.movement = waveMovement(direction);
  entity.behaviors['suicide-switch'] = {
    timer: 0,
    run: (b, e) => {
      b.timer++;
      if (b.timer > WAVE_LIFESPAN) {
        Entity.destroy(e);
      }
    },
  };
};
