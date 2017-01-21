import { Core, Render, Entity, Key, Gamepad} from 'l1-lite';
import { Bodies, World, Events } from 'matter-js'

import movementNormal from '../behaviours/movement-normal.js';
import syncSpriteBody from '../behaviours/sync-sprite-body.js';
import movementPushed from '../behaviours/movement-pushed.js';
import push from '../behaviours/push.js';
import summonWave from '../behaviours/summon-wave.js'

const DEATH_TICKS = 100

const PLAYER1_START_POS = {
  x: 500,
  y: 400
};

const PLAYER2_START_POS = {
  x: 700,
  y: 400
};

const PLAYER3_START_POS = {
  x: 800,
  y: 500
};

const PLAYER4_START_POS = {
  x: 900,
  y: 600
};

const PLAYER_SCALE = 4;

export function addPlayer(id){
  const player = Entity.create('player' + parseInt(id)+1);
  player.type = 'player';
  player.controllerId = id;
  let body;
  if (id==0){
    player.sprite = Render.getAnimation(['lizard1', 'lizard2'], 0.05);
    body = Bodies.circle(PLAYER1_START_POS.x, PLAYER1_START_POS.y, 8*PLAYER_SCALE);
  }  
  else if (id==1){
    player.sprite = Render.getAnimation(['lizard1-p2', 'lizard2-p2'], 0.05);
    body = Bodies.circle(PLAYER2_START_POS.x, PLAYER2_START_POS.y, 8*PLAYER_SCALE);
  }

  else if (id==2){
    player.sprite = Render.getAnimation(['lizard1-p3', 'lizard2-p3'], 0.05);
    body = Bodies.circle(PLAYER3_START_POS.x, PLAYER3_START_POS.y, 8*PLAYER_SCALE);
  }

  else if (id==3){
    player.sprite = Render.getAnimation(['lizard1-p4', 'lizard2-p4'], 0.05);
    body = Bodies.circle(PLAYER4_START_POS.x, PLAYER4_START_POS.y, 8*PLAYER_SCALE);
  }

  player.body = body;
  const { sprite } = player;
  sprite.width = 16;
  sprite.height = 16;
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;
  sprite.scale.x = PLAYER_SCALE;
  sprite.scale.y = PLAYER_SCALE;

  World.add(Core.engine.world, [player.body]);

  Events.on(Core.engine, 'collisionActive', (event) => {
    const { pairs } = event;

    for (let i = 0; i != pairs.length; ++i) {
      const pair = pairs[i];
      const { bodyA, bodyB } = pair;
	  if (bodyA.entity && bodyB.entity) {
        if (bodyA.entity.type === 'player' && (bodyB.entity.type === 'player' || bodyB.entity.type === 'wave')) {
          const idA = bodyA.entity.id[bodyA.entity.id.length - 2];
          bodyA.entity.behaviours.movement = movementPushed(idA);//Ful-hack
        }
        if (bodyB.entity.type === 'player' && (bodyA.entity.type === 'player' || bodyA.entity.type === 'wave')) {
          const idB = bodyB.entity.id[bodyB.entity.id.length - 2];
          bodyB.entity.behaviours.movement = movementPushed(idB);//Ful-hack
        }
	  }
    }
  });

  /*
  sprite.position.y = 0;
  sprite.position.x = 0;
  */

  body.entity = player;
  body.sprite = sprite;

  player.behaviours['movement'] = movementNormal(id);
  player.behaviours['sync-sprite-body'] = syncSpriteBody;
  player.behaviours['push'] = push;
  player.behaviours['summonWave'] = summonWave(id);

  player.behaviours['killed'] = {
    deathTicks: DEATH_TICKS,
    fireEntity: undefined,
    killed: false,
    run: (b, e) => {
      if (!b.killed) {
        return
      }
      
      if (b.deathTicks == DEATH_TICKS && b.killed) {
        player.behaviours['movement'].run = (b, e) => {}
        const fire = Entity.create('fire')
        fire.animation = Render.getAnimation(['fire1', 'fire2', 'fire3'], 0.3);
        World.remove(Core.engine.world, [e.body]);
        const { animation } = fire
        animation.position.x = e.sprite.position.x - 25
        animation.position.y = e.sprite.position.y - 18
        animation.scale.x = 3;
        animation.scale.y = 3;
        animation.play()

        Render.add(animation)
        Core.add(fire)

        b.fireEntity = fire
      }

      if (b.deathTicks < 1) {
        Render.remove(b.fireEntity.animation)
        Core.remove(b.fireEntity)

        Render.remove(e.sprite)
        Core.remove(e)
        return
      }
      e.body.sprite.scale.x *= 0.98
      e.body.sprite.scale.y *= 0.98

      b.deathTicks--;
    }
  }

  sprite.play();
  Render.add(sprite); 
  Core.add(player);
}
