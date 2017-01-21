import { World, Core, Render, Entity, Key, Gamepad} from 'l1-lite';
import Matter from 'matter-js'

import movementNormal from '../behaviours/movement-normal.js';

const DEATH_TICKS = 100

module.exports = core => {
  const entity = Entity.create('lizard');
  entity.type = 'player';
  entity.sprite = Render.getAnimation(['lizard1', 'lizard2'], 0.05);
  const { sprite } = entity;

  // Set position (Pixi)
  entity.body = core.Bodies.circle(800, 450, 10);
  core.World.add(core.engine.world, [entity.body]);
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
  sprite.play();

  const { body } = entity;

  body.entity = entity;
  body.sprite = sprite;

  core.Render.add(sprite);
  core.add(entity);

  entity.behaviours['movement'] = movementNormal;
  entity.behaviours['killed'] =  {
    deathTicks: DEATH_TICKS,
    fireEntity: undefined,
    killed: false,
    run: (b, e) => {
      if (!b.killed) {
        return
      }

      if (b.deathTicks == DEATH_TICKS && b.killed) {
        entity.behaviours['movement'].run = (b, e) => {}
        const fire = Entity.create('fire')
        fire.animation = Render.getAnimation(['fire1', 'fire2', 'fire3'], 0.3)
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
        Matter.World.remove(core.engine.world, [e.body])
        Core.remove(e)
        return
      }
      e.body.sprite.scale.x *= 0.98
      e.body.sprite.scale.y *= 0.98

      b.deathTicks--;
    }
  }
}
