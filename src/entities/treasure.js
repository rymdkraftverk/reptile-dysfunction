import { Core, Render, Entity, Key, Gamepad, Timer} from 'l1-lite';
import { World, Bodies } from 'matter-js'

import syncSpriteBody from '../behaviours/sync-sprite-body.js';

export default function treasure() {
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
  return (Math.random()*200) + 300;
}

const appearRandomly = {
  timer: Timer.create(getRandomTime(), (b, e)=>{
    b.create(b, e);
  }),
  create: (b, entity)=>{
    console.log("create treasure")
    entity.sprite = Render.getAnimation([
      "gem1",
      "gem1",
      "gem1",
      "gem2",
      "gem3",
      "gem4",
      "gem5",
      "gem6",
      "gem7",
      "gem8",
      "gem9",
      "gem10",
      "gem10",
      "gem11",
      "gem11",
      "gem11",
      "gem10",
      "gem9",
      "gem8",
      "gem7",
      "gem6",
      "gem5",
      "gem4",
      "gem3",
      "gem2",
      "gem1"
    ], 0.5);

    const { sprite } = entity;
    const { x, y } = getRandomPosition();
    entity.body = Bodies.circle(x, y, 100);

    sprite.width = 16;
    sprite.height = 16;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.scale.x = 2;
    sprite.scale.y = 2;
    sprite.play()
    entity.behaviours['sync-sprite-body'] = syncSpriteBody;

    entity.behaviours['delete-me'] = {
      init: (b, e) => {
        const duration = getRandomDuration();
        b.duration = duration;
        b.sprite = e.sprite;
        b.timer = Timer.create(duration, ()=>{});
      },
      run: (b, e) => {
        if (b.timer && b.timer.duration() < b.duration*0.3 && Math.round(b.timer.duration())%2===0){
          Render.remove(e.sprite);
        } else {
          Render.add(b.sprite);
        }

        if (b.timer && b.timer.run(b, e)){
          Core.remove(e);
          Render.remove(e.sprite);
          World.remove(Core.engine.world, [e.body]);
        }
      }
    };
    World.add(Core.engine.world, [entity.body]);
    Render.add(sprite);

    entity.body.friction = 0;
  },
  run: (b, entity)=>{
    const { timer } = b;
    if (timer && timer.run(b, entity)){
      delete b.timer;
    }
    if (entity.sprite.position) {
      entity.sprite.position.x += 5
    }




  }
}
