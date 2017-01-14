import { Core, Render, Entity, Timer } from 'level1-lite';
import sprites from './sprites.json';

Render.createRenderer(600, 400, sprites).then(() => {
  Core.createCore();
  Core.start();

  const entity = Entity.create();
  entity.sprite = Render.getSprite('anpanman');
  const { sprite } = entity;

  sprite.position.y = 0;
  sprite.position.x = 0;
  sprite.width = 10;
  sprite.height = 10;
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;
  sprite.scale.x = 4;
  sprite.scale.y = 4;

  Render.add(sprite);
  Core.add(entity);

  entity.behaviours['move-y'] = {
    run: (b, e) => {
      e.sprite.position.y += 0.5;
    }
  }

  entity.behaviours['move-x'] = {
    run: (b, e) => {
      e.sprite.position.x += 0.5;
    }
  }

  entity.behaviours['delete-move-y'] = {
    // init: (b, e) => {
    //   console.log("init");
    //   e.timer = Timer.create(160, () => {
    //       delete e.behaviours['move-y'];
    //   });
    // },
    timer: Timer.create(300, (e) => {
      delete e.behaviours['move-y'];
      // Render.remove(e.sprite);
      // Core.remove(e);
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
});
