import { Game, Entity, Physics, Sound } from 'l1';
import movementNormal from '../behaviors/movement-normal';
import syncSpriteBody from '../behaviors/sync-sprite-body';
import movementPushed from '../behaviors/movement-pushed';
import push from '../behaviors/push';
import summonWave from '../behaviors/summon-wave';

const { Bodies, World, Events } = Physics;

const DEATH_TICKS = 100;

const PLAYER1_START_POS = {
  x: 600,
  y: 300,
};

const PLAYER2_START_POS = {
  x: 1100,
  y: 300,
};

const PLAYER3_START_POS = {
  x: 600,
  y: 650,
};

const PLAYER4_START_POS = {
  x: 1100,
  y: 650,
};

const PLAYER5_START_POS = {
  x: 1000,
  y: 600,
};

const PLAYER_SCALE = 4;

export default function addPlayer(id) {
  const player = Entity.create(id);
  player.type = 'player';
  player.controllerId = id;
  if (id === '0') {
    Entity.addAnimation(player, ['lizard1', 'lizard2'], 0.05);
    Entity.addBody(player, Bodies.circle(PLAYER1_START_POS.x, PLAYER1_START_POS.y, 8 * PLAYER_SCALE));
  } else if (id === '1') {
    Entity.addAnimation(player, ['lizard1-p2', 'lizard2-p2'], 0.05);
    Entity.addBody(player, Bodies.circle(PLAYER2_START_POS.x, PLAYER2_START_POS.y, 8 * PLAYER_SCALE));
  } else if (id === '2') {
    Entity.addAnimation(player, ['lizard1-p3', 'lizard2-p3'], 0.05);
    Entity.addBody(player, Bodies.circle(PLAYER3_START_POS.x, PLAYER3_START_POS.y, 8 * PLAYER_SCALE));
  } else if (id === '3') {
    Entity.addAnimation(player, ['lizard1-p4', 'lizard2-p4'], 0.05);
    Entity.addBody(player, Bodies.circle(PLAYER4_START_POS.x, PLAYER4_START_POS.y, 8 * PLAYER_SCALE));
  } else if (id === '4') {
    Entity.addAnimation(player, ['pikachu'], 0.05);
    Entity.addBody(player, Bodies.circle(PLAYER5_START_POS.x, PLAYER5_START_POS.y, 8 * PLAYER_SCALE));
  }

  const { sprite, body } = player;
  sprite.width = 16;
  sprite.height = 16;
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;
  sprite.scale.x = PLAYER_SCALE;
  sprite.scale.y = PLAYER_SCALE;

  body.collisionFilter.group = -1 * (id + 1);

  Events.on(Game.getPhysicsEngine(), 'collisionActive', (event) => {
    const { pairs } = event;

    for (let i = 0; i !== pairs.length; ++i) {
      const pair = pairs[i];
      const { bodyA, bodyB } = pair;
	  if (bodyA.entity && bodyB.entity) {
        if (bodyA.entity.type === 'player' && (bodyB.entity.type === 'player' || bodyB.entity.type === 'wave' || bodyB.entity.type === 'push')) {
          const idA = bodyA.entity.id;
          bodyA.entity.behaviors.movement = movementPushed(idA);
        }
        if (bodyB.entity.type === 'player' && (bodyA.entity.type === 'player' || bodyA.entity.type === 'wave' || bodyA.entity.type === 'push')) {
          const idB = bodyB.entity.id;
          bodyB.entity.behaviors.movement = movementPushed(idB);
        }
	  }
    }
  });

  body.sprite = sprite;

  player.behaviors.movement = movementNormal(id);
  player.behaviors['sync-sprite-body'] = syncSpriteBody;
  player.behaviors.push = push();
  player.behaviors.summonWave = summonWave(id);

  player.behaviors.killed = {
    deathTicks: DEATH_TICKS,
    fireEntity: undefined,
    killed: false,
    pushedAnimation: undefined,
    run: (b, e) => {
      if (!b.killed) {
        return;
      }

      if (b.deathTicks === DEATH_TICKS && b.killed) {
        player.behaviors.movement.run = () => {};
        const fire = Entity.create('fire');
        const fireSprite = Entity.addAnimation(fire, ['fire1', 'fire2', 'fire3'], 0.3);
        const sound = Sound.getSound('sounds/death.wav');
        sound.play();
        World.remove(Game.getPhysicsEngine().world, [e.body]);
        fireSprite.position.x = e.animation.position.x - 25;
        fireSprite.position.y = e.animation.position.y - 18;
        fireSprite.scale.x = 3;
        fireSprite.scale.y = 3;

        b.fireEntity = fire;
      }

      if (b.deathTicks < 1) {
        Entity.destroy(b.fireEntity);
        Entity.destroy(e);
        return;
      }
      e.body.sprite.scale.x *= 0.98;
      e.body.sprite.scale.y *= 0.98;

      b.deathTicks--;
    },
  };
}
