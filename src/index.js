import { Core, Render, Entity, Timer, Key, Debug, Gamepad} from 'l1-lite';
import sprites from './sprites.json';

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

  entity.behaviours['move-up'] = {
    run: (b, e) => {
      if (Key.isDown('up')){
        e.sprite.position.y -= 1;
      }
    }
  }

  entity.behaviours['move-left'] = {
    run: (b, e) => {
      if (Key.isDown('left')){
        e.sprite.position.x -= 1;
      }
    }
  }

  entity.behaviours['move-down'] = {
    run: (b, e) => {
      if (Key.isDown('down')){
        e.sprite.position.y += 1;
      }
    }
  }

  entity.behaviours['move-right'] = {
    run: (b, e) => {
      if (Key.isDown('right')){
        e.sprite.position.x += 1;
      }
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
