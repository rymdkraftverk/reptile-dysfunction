import { Events } from 'matter-js'
import { Core } from 'l1-lite'

export default function() {
  Events.on(Core.engine, 'collisionStart', (event) => {
      const { pairs } = event;

      for (let i = 0, j = pairs.length; i != j; ++i) {
          const pair = pairs[i];
          const { bodyA, bodyB } = pair;
          if (!bodyA.entity || !bodyB.entity) continue;

          if (bodyB.entity.id === 'push' && bodyA.entity.type === 'player') {
            console.log('ids', bodyB.entity.creatorId);
            console.log('ids2', bodyA.entity.id);
            if (bodyA.entity.id === bodyB.entity.creatorId) return;
            console.log('push collide!!');
          } else if (bodyA.entity.id === 'push' && bodyB.entity.type === 'player') {
            console.log('ids', bodyA.entity.creatorId);
            
            if (bodyB.entity.id === bodyA.entity.creatorId) return;
            console.log('push collide!!');
          }
      }
    });
}
