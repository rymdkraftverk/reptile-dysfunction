import { Core, Render, Entity, Timer, Key, Debug, Gamepad} from 'l1-lite';
import sprites from './sprites.json';

Render.createRenderer(600, 400, sprites).then(() => {
  Core.createCore();
  Core.start();
  Debug.initDebugTools();
  Key.add('up');

  const entity = Entity.create();
  entity.sprite = Render.getSprite('anpanman');
  const { sprite } = entity;

  // Set position (Pixi)
  sprite.position.y = 0;
  sprite.position.x = 0;
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

  entity.behaviours['move-y'] = {
    run: (b, e) => {
      e.sprite.position.y += 0.5;
      if (Key.isDown('up')){
        e.sprite.position.y -= 1;
      }
    }
  }

  entity.behaviours['move-x'] = {
    run: (b, e) => {
      e.sprite.position.x += 0.5;
    }
  }

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
