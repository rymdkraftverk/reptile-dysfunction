import { Entity, Timer, Physics, Util, Sound, Text } from 'l1';
import { getPlayers, getGoodPlayers, getEvilPlayer } from './player-handler';
import syncSpriteBody from '../behaviors/sync-sprite-body';
import reversed from '../behaviors/movement-reversed';

const { Bodies } = Physics;

let playersNear = [];
let entity;
let evilReversedText;
let goodReversedText;

export default function treasure() {
  entity = Entity.create('treasure');

  entity.behaviors.appearRandomly = appearRandomly;
  appearRandomly.new(appearRandomly);

  evilReversedText = getReversedText('Evil Reversed!', 'red');
  goodReversedText = getReversedText('Good Reversed!', 'green');
  entity.behaviors.reversedTextHandler = reversedTextHandler;
}

function getReversedText(text, color) {
  const reversedText = Text.create(text, {
    fontFamily: 'Press Start 2P',
    fontSize: 36,
    fill: color,
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
  });
  reversedText.x = 600;
  reversedText.y = 300;
  reversedText.zIndex = -20;
  return reversedText;
}

function getRandomPosition() {
  const x = Util.getRandomInRange(550, 1120);
  const y = Util.getRandomInRange(160, 750);
  return { x, y };
}

function getRandomTime() {
  return Util.getRandomInRange(400, 500);
}

function getRandomDuration() {
  return Util.getRandomInRange(300, 450);
}

const appearRandomly = {
  new: (b) => {
    b.timer = Timer.create(getRandomTime());
  },
  create: () => {
    Entity.addAnimation(entity, [
      'gem1',
      'gem1',
      'gem1',
      'gem2',
      'gem3',
      'gem4',
      'gem5',
      'gem6',
      'gem7',
      'gem8',
      'gem9',
      'gem10',
      'gem10',
      'gem11',
      'gem11',
      'gem11',
      'gem10',
      'gem9',
      'gem8',
      'gem7',
      'gem6',
      'gem5',
      'gem4',
      'gem3',
      'gem2',
      'gem1',
    ], 0.5);
    entity.active = true;
    setCircleSprite();

    const { animation } = entity;
    const { x, y } = getRandomPosition();
    Entity.addBody(entity, Bodies.circle(x, y, 100, {
      isSensor: true,
    }));

    animation.width = 16;
    animation.height = 16;
    animation.anchor.x = 0.5;
    animation.anchor.y = 1;
    animation.scale.x = 2;
    animation.scale.y = 2;
    animation.play();
    entity.behaviors['sync-sprite-body'] = syncSpriteBody;

    entity.behaviors['delete-me'] = {
      init: (b, e) => {
        const duration = getRandomDuration();
        b.duration = duration;
        b.animation = e.animation;
        b.timer = Timer.create(duration);
      },
      run: (b, e) => {
        if (b.timer && b.timer.counter() > b.duration * 0.7 && Math.round(b.timer.counter()) % 2 === 0) {
          Render.remove(e.animation);
        } else {
          Render.add(b.animation);
        }
        if (b.timer && b.timer.counter() > 40) {
          e.behaviors.checkPlayers = checkPlayers;
        }

        // Remove the treasure after a set amount of time
        if (b.timer && b.timer.run(b, e)) {
          treasureFail(b, e);
        }
      },
    };
    const sound = Sound.getSound('sounds/ruby.wav', { volume: 0.5 });
    sound.play();

    entity.body.friction = 0;
  },
  run: (b) => {
    const { timer } = b;
    if (timer && timer.run(b, entity)) {
      timer.reset();
      b.create(b, entity);
      delete b.timer;
    }
    if (entity.animation) {
      entity.animation.position.x += 5;
    }
  },
};

const reversedTextHandler = {
  init: (b, e) => {
    b.timer = Timer.create(60);
    b.timer.active = false;
  },
  run: (b, e) => {
    if (b.timer.active && b.timer.run()) {
      b.timer.active = false;
      Text.remove(evilReversedText);
      Text.remove(goodReversedText);
      b.timer.reset();
    }
  },
};

const checkPlayers = {
  timer: Timer.create(30),
  run: (b, e) => {
    if (playersNear.length >= getPlayers().length - 1) {
      if (b.timer.run()) {
        treasureWin(b, e);
        b.timer.reset();
      }
    } else if (b.timer.counter() > 0) {
      b.timer.reset();
    }
  },
};

function treasureFail(b, e) {
  e.active = false;

  e.behaviors.reversedTextHandler.timer.active = true;
  Render.add(goodReversedText);

  e.behaviors.appearRandomly = appearRandomly;
  appearRandomly.new(appearRandomly);
  b.timer.reset();
  delete e.behaviors['delete-me'];

  Entity.destroy(e);

  const sound = Sound.getSound('sounds/treasureFail.wav', {
    volume: 0.2,
  });
  sound.play();

  // Make all good players controlled reversed
  const good = getGoodPlayers();
  good.forEach(e => {
    e.behaviors['movement-normal'] = reversed(e.controllerId);
  });
}

function treasureWin(b, e) {
  e.active = false;

  e.behaviors.reversedTextHandler.timer.active = true;
  Render.add(evilReversedText);

  e.behaviors.appearRandomly = appearRandomly;
  appearRandomly.new(appearRandomly);
  if (e.behaviors['delete-me']) e.behaviors['delete-me'].timer.reset();
  delete e.behaviors['delete-me'];
  delete e.behaviors.checkPlayers;

  Entity.destroy(e);

  const sound = Sound.getSound('sounds/powerup.wav');
  sound.play();

  // Make the evil player controlls reversed
  const evil = getEvilPlayer();
  evil.behaviors['movement-normal'] = reversed(evil.controllerId);
}

export function checkTreasureEnter(entityA, entityB) {
  if (entityA.id === 'treasure' && entityB.type === 'player') {
    playersNear.push(entityB);
  } else if (entityB.id === 'treasure' && entityA.type === 'player') {
    playersNear.push(entityA);
  }
  setCircleSprite();
}

export function checkTreasureLeave(entityA, entityB) {
  if (entityA.id === 'treasure' && entityB.type === 'player') {
    playersNear = playersNear.filter(p => p.id !== entityB.id);
  } else if (entityB.id === 'treasure' && entityA.type === 'player') {
    playersNear = playersNear.filter(p => p.id !== entityA.id);
  }
  setCircleSprite();
}

function setCircleSprite() {
  if (!entity.active) return;
  if (entity.sprite) Entity.destroy(entity);

  let powerUpSprite = 'powerup3';
  const options = { zIndex: 10 };

  if (getPlayers().length === 4) {
    if (playersNear.length >= 3) {
      powerUpSprite = 'powerup3-3';
    } else if (playersNear.length === 2) {
      powerUpSprite = 'powerup3-2';
    } else if (playersNear.length === 1) {
      powerUpSprite = 'powerup3-1';
    } else if (playersNear.length === 0) {
      powerUpSprite = 'powerup3';
    }
  } else if (getPlayers().length === 3) {
    if (playersNear.length >= 2) {
      powerUpSprite = 'powerup2-2';
    } else if (playersNear.length === 1) {
      powerUpSprite = 'powerup2-1';
    } else if (playersNear.length === 0) {
      powerUpSprite = 'powerup2';
    }
  } if (getPlayers().length <= 2) {
    if (playersNear.length >= 1) {
      powerUpSprite = 'powerup1-1';
    } else if (playersNear.length === 0) {
      powerUpSprite = 'powerup1';
    }
  }

  Entity.addSprite(entity, powerUpSprite, options);

  const { sprite } = entity;
  sprite.height = 63;
  sprite.height = 59;
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;
  sprite.scale.x = 4;
  sprite.scale.y = 4;
}
