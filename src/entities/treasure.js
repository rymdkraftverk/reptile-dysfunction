import { Core, Render, Entity, Key, Gamepad, Timer} from 'l1-lite';
import { World, Bodies } from 'matter-js'

import syncSpriteBody from '../behaviours/sync-sprite-body.js';

export default function treasure() {
  console.log('treasure');
  const entity = Entity.create('treasure');

  entity.behaviours['appearRandomly'] = appearRandomly;

  Core.add(entity);
}

function getRandomPosition(){
  const x = (Math.random() * 700) + 500;
  const y = (Math.random() * 700) + 100;
  return { x, y };
}

function getRandomTime(){
  return (Math.random()*200) + 100;
}

function getRandomDuration(){
  
}

const appearRandomly = {
  timer: Timer.create(getRandomTime(), (b, e)=>{
    b.create(b, e);
  }),
  create: (b, entity)=>{
    entity.sprite = Render.getAnimation(['baikinman'], 0.05);
    
    const { sprite } = entity;
    const { x, y } = getRandomPosition();
    entity.body = Bodies.circle(x, y, 100);

    sprite.width = 16;
    sprite.height = 16;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.scale.x = 6;
    sprite.scale.y = 6;
    entity.behaviours['sync-sprite-body'] = syncSpriteBody;
    World.add(Core.engine.world, [entity.body]);
    Render.add(sprite);

    entity.body.friction = 0;
  },
  run: (b, entity)=>{
    const { timer } = b;
    if (timer && timer.run(b, entity)){
      delete b.timer;
    }
  }
}