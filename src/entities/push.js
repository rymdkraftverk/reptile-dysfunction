import { Core, Entity, Key, Gamepad, Timer, Physics} from 'l1-lite';
const { Bodies, World } = Physics;
import { Howl } from 'howler';

let count = 0;

export function create(creator){
  const {x, y} = creator.body.position;

  const push = Entity.create('push' + count++);
  Entity.addBody(push, Bodies.circle(x, y, 100));
  push.body.collisionFilter.group = -1 * (creator.id + 1);
  push.creatorId = creator.id;
  
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
