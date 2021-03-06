import { Entity, Timer, Physics, Sound } from 'l1';

const { Bodies } = Physics;

let count = 0;

export default function create(creator) {
  const { x, y } = creator.body.position;

  const push = Entity.create(`push${count++}`);
  Entity.addBody(push, Bodies.circle(x, y, 100));
  push.body.collisionFilter.group = -1 * (creator.id + 1);
  push.creatorId = creator.id;

  const sound = Sound.getSound('sounds/hit.wav', { volume: 0.8 });
  sound.play();

  push.behaviors['delete-me'] = {
    timer: Timer.create(5),
    run: (b, e) => {
      if (b.timer && b.timer.run(b, e)) {
        Entity.destroy(e);
      }
    },
  };
}
