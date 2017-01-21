import { Core, Render, Entity, Key, Gamepad, Timer} from 'l1-lite';
import { Bodies, World } from 'matter-js'

export function create(creator){
  const push = Entity.create('push');
  push.creatorId = creator.id;
  const {x, y} = creator.body.position;

  push.body = Bodies.circle(x, y, 100);
  push.body.entity = push;
  push.body.collisionFilter.group = -1 * (creator.id + 1);

  World.add(Core.engine.world, [push.body]);
  Core.add(push);

  push.behaviours['delete-me'] = {
    timer: Timer.create(5, ()=>{}),
    run: (b, e) => {
      if (b.timer && b.timer.run(b, e)){
        Core.remove(e);
      }
    }
  }
}
