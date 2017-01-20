import { Core, Render, Entity, Timer, Key, Debug, Gamepad} from 'l1-lite';
import sprites from './sprites.json';

import Matter from 'matter-js'

var Engine = Matter.Engine;
var engine = Engine.create();
var World = Matter.World;
var Bodies = Matter.Bodies;
engine.world.gravity.y = 0;
Engine.run(engine);

import playerHandler from './entities/player-handler';
import controller from './entities/controller';

Render.createRenderer(600, 400, sprites).then(() => {
  Core.createCore();
  Core.start();
  Debug.initDebugTools();
  Key.add('up');
  Key.add('right');
  Key.add('down');
  Key.add('left');

  const entity = Entity.create();
  entity.sprite = Render.getSprite('lizard1');
  const { sprite } = entity;

  // Set position (Pixi)
  entity.body = Bodies.circle(0, 0, 10);
  World.add(engine.world, [entity.body]);
  /*
  sprite.position.y = 0;
  sprite.position.x = 0;
  */
  sprite.width = 10;
  sprite.height = 10;
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;
  sprite.scale.x = 4;
  sprite.scale.y = 4;

  // Make clickable (Pixi)
  sprite.interactive = true;
  sprite.on('mousedown', () => console.log('mousedown'))
    .on('mouseup', () => console.log('mouseup'))
    .on('mouseupoutside', () => console.log('mouseupoutside'))
    .on('touchstart', () => console.log('touchstart'))
    .on('touchend', () => console.log('touchend'))
    .on('touchendoutside', () => console.log('touchendoutside'));

  Render.add(sprite);
  Core.add(entity);

  entity.behaviours['movement'] = {
    run: (b, e) => {
      Matter.Body.setVelocity(e.body, Matter.Vector.create(x, y))
      e.sprite.position.x = e.body.position.x;
      e.sprite.position.y = e.body.position.y;
      var x = 0;
      var y = 0;
      if (Key.isDown('right')) {
        x += 1;
      }
      if (Key.isDown('down')) {
        y += 1;
      }
      if (Key.isDown('left')) {
        x -= 1;
      }
      if (Key.isDown('up')) {
        y -= 1;
      }
      const direction = Matter.Vector.create(x, y)
      //Matter.Body.applyForce(e.body, e.body, direction);
      Matter.Body.setVelocity(e.body, direction)
    }
  }
});


/*
  entity.behaviours['delete-move-y'] = {
    timer: Timer.create(300, (b, e) => {
      delete e.behaviours['move-y'];
    }),
    run: (b, e) => {
      const { timer } = b;
      if (timer){
        if (timer.run(b, e)){
          delete b.timer;
        }
      }
    }
  }
*/
