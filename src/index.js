import { Core, Render, Entity, Timer, Key, Debug, Gamepad} from 'l1-lite';
import sprites from './sprites.json';
import Matter from 'matter-js'

var Engine = Matter.Engine;
var engine = Engine.create();
var World = Matter.World;
var Bodies = Matter.Bodies;
engine.world.gravity.y = 0;
Engine.run(engine);

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
	  //TODO Make button IDs into named constants. 
	  //0 is left-right stick, 
	  //1 up-down stick, 
	  //4 left-right button, 
	  //5 up-down stick.
      if (Key.isDown('right')) {
        x += 1;
      } else if (Key.isDown('left')) {
        x -= 1;
      } else if (Gamepad.axisDir(0, 0) != 0) {
        x += Gamepad.axisDir(0, 0);
	  } else {
		x += Gamepad.axisDir(0, 4);
	  }
      if (Key.isDown('down')) {
        y += 1;
      } else if (Key.isDown('up')) {
        y -= 1;
      } else if (Gamepad.axisDir(0, 1) != 0) {
        y += Gamepad.axisDir(0, 1);
	  } else {
		y += Gamepad.axisDir(0, 5);
	  }
      const direction = Matter.Vector.create(x, y)
      //Matter.Body.applyForce(e.body, e.body, direction);
      Matter.Body.setVelocity(e.body, direction)
    }
  }

  // Animation Example
  const lizard = Entity.create();
  const animationSpeed = 0.05;
  lizard.animation = Render.getAnimation(['lizard1', 'lizard2'], animationSpeed);
  const { animation } = lizard;
  animation.position.y = 100;
  animation.position.x = 100;
  animation.scale.x = 8;
  animation.scale.y = 8;
  animation.play();

  Render.add(animation);
  Core.add(lizard);

  // Controller test
  const controller = Entity.create();
  controller.behaviours['scan-for-gamepads'] = {
    run: (b, e) => {
      Gamepad.run();
      if (Key.isDown('up')){
        console.log('gamepads', Gamepad.getGamepads());
      }
    }
  }
  Core.add(controller);
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
