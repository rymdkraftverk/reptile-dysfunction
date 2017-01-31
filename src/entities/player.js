import { Core, Render, Entity, Key, Gamepad, Physics } from 'l1-lite';
const { Bodies, World, Events } = Physics;
import { Howl } from 'howler';

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

const PLAYER5_START_POS = {
  x: 1000,
  y: 600
};

const PLAYER_SCALE = 4;

export function addPlayer(id){
  const player = Entity.create(id);
  player.type = 'player';
  player.controllerId = id;
  
  if (id==0){
    Entity.addAnimation(player, ['lizard1', 'lizard2'], 0.05);
    Entity.addBody(player, Bodies.circle(PLAYER1_START_POS.x, PLAYER1_START_POS.y, 8*PLAYER_SCALE));
  }
  else if (id==1){
    Entity.addAnimation(player, ['lizard1-p2', 'lizard2-p2'], 0.05);
    Entity.addBody(player, Bodies.circle(PLAYER2_START_POS.x, PLAYER2_START_POS.y, 8*PLAYER_SCALE));
  }

  else if (id==2){
    Entity.addAnimation(player, ['lizard1-p3', 'lizard2-p3'], 0.05);
    Entity.addBody(player, Bodies.circle(PLAYER3_START_POS.x, PLAYER3_START_POS.y, 8*PLAYER_SCALE));
  }

  else if (id==3){
    Entity.addAnimation(player, ['lizard1-p4', 'lizard2-p4'], 0.05);
    Entity.addBody(player, Bodies.circle(PLAYER4_START_POS.x, PLAYER4_START_POS.y, 8*PLAYER_SCALE));
  }

  else if (id==4){
    Entity.addAnimation(player, ['pikachu'], 0.05);
    Entity.addBody(player, Bodies.circle(PLAYER5_START_POS.x, PLAYER5_START_POS.y, 8*PLAYER_SCALE));
  }

  const { animation, body } = player;
  animation.width = 16;
  animation.height = 16;
  animation.anchor.x = 0.5;
  animation.anchor.y = 0.5;
  animation.scale.x = PLAYER_SCALE;
  animation.scale.y = PLAYER_SCALE;

  body.collisionFilter.group = -1 * (id + 1);

  Events.on(Core.engine, 'collisionActive', (event) => {
    const { pairs } = event;

    for (let i = 0; i != pairs.length; ++i) {
      const pair = pairs[i];
      const { bodyA, bodyB } = pair;
	  if (bodyA.entity && bodyB.entity) {
        if (bodyA.entity.type === 'player' && (bodyB.entity.type === 'player' || bodyB.entity.type === 'wave' || bodyB.entity.type === 'push')) {
          const idA = bodyA.entity.id;
          bodyA.entity.behaviours.movement = movementPushed(idA);
        }
        if (bodyB.entity.type === 'player' && (bodyA.entity.type === 'player' || bodyA.entity.type === 'wave' || bodyA.entity.type === 'push')) {
          const idB = bodyB.entity.id;
          bodyB.entity.behaviours.movement = movementPushed(idB);
        }
	  }
    }
  });

  body.sprite = animation;

  player.behaviours['movement'] = movementNormal(id);
  player.behaviours['sync-sprite-body'] = syncSpriteBody;
  player.behaviours['push'] = push();
  player.behaviours['summonWave'] = summonWave(id);

  player.behaviours['killed'] = {
    deathTicks: DEATH_TICKS,
    fireEntity: undefined,
    killed: false,
    pushedAnimation: undefined,
    run: (b, e) => {
      if (!b.killed) {
        return
      }

      if (b.deathTicks == DEATH_TICKS && b.killed) {
        player.behaviours['movement'].run = (b, e) => {}
        const fire = Entity.create('fire')
        Entity.addAnimation(fire, ['fire1', 'fire2', 'fire3'], 0.3);
        const sound = new Howl({
          src: ['sounds/death.wav']
        });
        sound.play();
        World.remove(Core.engine.world, [e.body]);
        const { animation } = fire
        animation.position.x = e.animation.position.x - 25
        animation.position.y = e.animation.position.y - 18
        animation.scale.x = 3;
        animation.scale.y = 3;
        animation.play()

        Core.add(fire)

        b.fireEntity = fire
      }

      if (b.deathTicks < 1) {
        Render.remove(b.fireEntity.animation)
        Core.remove(b.fireEntity)

        Render.remove(e.animation)
        Core.remove(e)
        return
      }
      e.body.sprite.scale.x *= 0.98
      e.body.sprite.scale.y *= 0.98

      b.deathTicks--;
    }
  }

  animation.play();
  Core.add(player);
}
