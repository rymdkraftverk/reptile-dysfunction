import { Core, Render, Entity, Key, Gamepad, Timer, Physics} from 'l1-lite';
const { World, Bodies } = Physics;
import { Howl } from 'howler';

import { getPlayers, getGoodPlayers, getEvilPlayer } from './player-handler';
import syncSpriteBody from '../behaviours/sync-sprite-body.js';

import reversed from '../behaviours/movement-reversed';

let playersNear = [];

export default function treasure() {
  const entity = Entity.create('treasure');

  entity.behaviours['appearRandomly'] = appearRandomly;
  appearRandomly.new(appearRandomly);

  Core.add(entity);
}

function getRandomPosition(){
  const x = Math.floor((Math.random() * 700) + 500);
  const y = Math.floor((Math.random() * 700) + 100);
  return { x, y };
}

function getRandomTime(){
  return Math.floor((Math.random()*200) + 300);
}

function getRandomDuration(){
  return Math.floor((Math.random()*200) + 300);
}

const appearRandomly = {
  new: (b) => {
    b.timer = Timer.create(getRandomTime());
  },
  create: (b, entity)=>{
    Entity.addAnimation(entity, [
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

    const { animation } = entity;
    const { x, y } = getRandomPosition();
    Entity.addBody(entity, Bodies.circle(x, y, 100, {
      isSensor: true
    }));

    animation.width = 16;
    animation.height = 16;
    animation.anchor.x = 0.5;
    animation.anchor.y = 0.5;
    animation.scale.x = 2;
    animation.scale.y = 2;
    animation.play()
    entity.behaviours['sync-sprite-body'] = syncSpriteBody;

    entity.behaviours['delete-me'] = {
      init: (b, e) => {
        const duration = getRandomDuration();
        b.duration = duration;
        b.animation = e.animation;
        b.timer = Timer.create(duration);
      },
      run: (b, e) => {
        if (b.timer && b.timer.counter() > b.duration*0.7 && Math.round(b.timer.counter())%2===0){
          Render.remove(e.animation);
        } else {
          Render.add(b.animation);
        }
        if (b.timer && b.timer.counter() > 40){
          e.behaviours['checkPlayers'] = checkPlayers;
        }

        //Remove the treasure after a set amount of time
        if (b.timer && b.timer.run(b, e)){
          treasureFail(b, e);
          
        }
      }
    };

    // World.add(Core.engine.world, [entity.body]);
    // Render.add(sprite);

    const sound = new Howl({
      src: ['sounds/ruby.wav'],
      volume: 0.5
    });
    sound.play();

    entity.body.friction = 0;
  },
  run: (b, entity)=>{
    const { timer } = b;
    if (timer && timer.run(b, entity)){
      timer.reset();
      b.create(b, entity);
      delete b.timer;
    }
    if (entity.animation) {
      entity.animation.position.x += 5
    }
  }
}

const checkPlayers = {
  run: (b, e) => {
    if (playersNear.length === getPlayers().length - 1){
      treasureWin(b, e);
    }
  }
}

function treasureFail(b, e){
  e.behaviours['appearRandomly'] = appearRandomly;
  appearRandomly.new(appearRandomly);
  b.timer.reset();
  delete e.behaviours['delete-me'];

  Render.remove(e.animation);
  World.remove(Core.engine.world, [e.body]);

  const sound = new Howl({
    src: ['sounds/treasureFail.wav'],
    volume: 0.2
  });
  sound.play();

  //Make all good players controlled reversed
  const good = getGoodPlayers();
  good.forEach(e => {
    e.behaviours['movement-normal'] = reversed(e.controllerId);
  });
}

function treasureWin(b, e){
  e.behaviours['appearRandomly'] = appearRandomly;
  appearRandomly.new(appearRandomly);
  e.behaviours['delete-me'].timer.reset();
  delete e.behaviours['delete-me'];
  delete e.behaviours['checkPlayers'];

  Render.remove(e.animation);
  World.remove(Core.engine.world, [e.body]);

  const sound = new Howl({
    src: ['sounds/powerup.wav']
  });
  sound.play();

  //Make the evil player controlls reversed
  const evil = getEvilPlayer();
  evil.behaviours['movement-normal'] = reversed(evil.controllerId);
}

export function checkTreasureEnter(entityA, entityB){
  if (entityA.id === 'treasure' && entityB.type === 'player'){
    playersNear.push(entityB);
  }
  else if (entityB.id === 'treasure' && entityA.type === 'player'){
    playersNear.push(entityA);
  }
}

export function checkTreasureLeave(entityA, entityB){
  if (entityA.id === 'treasure' && entityB.type === 'player'){
    playersNear = playersNear.filter(p => p.id !== entityB.id);
  }
  else if (entityB.id === 'treasure' && entityA.type === 'player'){
    playersNear = playersNear.filter(p => p.id !== entityA.id);
  }
}