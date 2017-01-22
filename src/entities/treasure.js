import { Core, Render, Entity, Key, Gamepad, Timer} from 'l1-lite';
import { World, Bodies } from 'matter-js'

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
  return Math.floor((Math.random()*200) + 600);
}

function getRandomDuration(){
  return Math.floor((Math.random()*200) + 300);
}

const appearRandomly = {
  new: (b) => {
    b.timer = Timer.create(getRandomTime(), (b, e)=>{});
  },
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
    entity.body = Bodies.circle(x, y, 100, {
      isSensor: true
    });
    entity.body.entity = entity;

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
        if (b.timer && b.timer.duration() < b.duration-40){
          e.behaviours['checkPlayers'] = checkPlayers;
        }

        //Remove the treasure after a set amount of time
        if (b.timer && b.timer.run(b, e)){
          treasureFail(b, e);
          
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
      timer.reset();
      b.create(b, entity);
      delete b.timer;
    }
    if (entity.sprite.position) {
      entity.sprite.position.x += 5
    }
  }
}

const checkPlayers = {
  run: (b, e) => {
    if (playersNear.length === getPlayers().length){
      treasureWin(b, e);
    }
  }
}

function treasureFail(b, e){
  e.behaviours['appearRandomly'] = appearRandomly;
  appearRandomly.new(appearRandomly);
  b.timer.reset();
  delete e.behaviours['delete-me'];

  Render.remove(e.sprite);
  World.remove(Core.engine.world, [e.body]);

  //Make all good players controlled reversed
  const good = getGoodPlayers();
  good.forEach(e => {
    console.log('applying reverse');
    e.behaviours['movement-normal'] = reversed(e.controllerId);
  });
}

function treasureWin(b, e){
  e.behaviours['appearRandomly'] = appearRandomly;
  appearRandomly.new(appearRandomly);
  e.behaviours['delete-me'].timer.reset();
  delete e.behaviours['delete-me'];
  delete e.behaviours['checkPlayers'];

  Render.remove(e.sprite);
  World.remove(Core.engine.world, [e.body]);

  //Make the evil player controlls reversed
  // const evil = getEvilPlayer();
  // evil['movement-normal'] = reversed;
}

export function checkTreasureEnter(entityA, entityB){
  if (entityA.id === 'treasure' && entityB.type === 'player'){
    playersNear.push(entityB);
  }
  else if (entityB.id === 'treasure' && entityA.type === 'player'){
    playersNear.push(entityA);
  }
  console.log('near treasure', playersNear);
}

export function checkTreasureLeave(entityA, entityB){
  if (entityA.id === 'treasure' && entityB.type === 'player'){
    playersNear = playersNear.filter(p => p.id !== entityB.id);
  }
  else if (entityB.id === 'treasure' && entityA.type === 'player'){
    playersNear = playersNear.filter(p => p.id !== entityA.id);
  }
  console.log('near treasure', playersNear);
}