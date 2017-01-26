import { Core, Render, Entity, Key, Gamepad, Timer} from 'l1-lite';
import { Bodies, World } from 'matter-js'
import { Howl } from 'howler';

let count = 0;

export function create(creator){
  const {x, y} = creator.body.position;

  const push = Entity.create('push' + count++);
  push.body = Bodies.circle(x, y, 100);
  push.body.entity = push;
  push.body.collisionFilter.group = -1 * (creator.id + 1);
  push.creatorId = creator.id;
  World.add(Core.engine.world, [push.body]);
  Core.add(push);

  const sound = new Howl({
    src: ['sounds/hit.wav'],
    volume: 0.8
  });
  sound.play();

  push.behaviours['delete-me'] = {
    timer: Timer.create(5),
    run: (b, e) => {
      if (b.timer && b.timer.run(b, e)){
        Core.remove(e);
      }
    }
  }
}
