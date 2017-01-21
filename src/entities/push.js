import { Core, Render, Entity, Key, Gamepad, Timer} from 'l1-lite';
import { Bodies, World } from 'matter-js'

export function create(creator){
  const push = Entity.create('push');
  push.creatorId = creator.id;
  const {x, y} = creator.body.position;

  push.body = Bodies.rectangle(x, y, 50, 50);
  push.body.entity = push;

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