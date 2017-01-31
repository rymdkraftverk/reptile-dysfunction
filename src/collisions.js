import { Core, Physics } from 'l1-lite'
const { Events } = Physics;
import { checkTreasureEnter, checkTreasureLeave } from './entities/treasure';

export default function() {
  Events.on(Core.engine, 'collisionStart', (event) => {
      const { pairs } = event;

      for (let i = 0, j = pairs.length; i != j; ++i) {
          const pair = pairs[i];
          const { bodyA, bodyB } = pair;
          if (!bodyA.entity || !bodyB.entity) continue;
          checkTreasureEnter(bodyA.entity, bodyB.entity);
      }
    });

    Events.on(Core.engine, 'collisionEnd', (event) => {
      const { pairs } = event;

      for (let i = 0, j = pairs.length; i != j; ++i) {
          const pair = pairs[i];
          const { bodyA, bodyB } = pair;
          if (!bodyA.entity || !bodyB.entity) continue;
          checkTreasureLeave(bodyA.entity, bodyB.entity);
      }
    });
}
