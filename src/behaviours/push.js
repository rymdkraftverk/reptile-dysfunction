import { Entity, Render, Timer, Gamepad } from 'l1-lite';
import { create } from '../entities/push';

const push = () =>({
  hasPushed: false,
  animation: undefined,
  run: (b, e) => {
    if (b.hasPushed) {

      if (b.timer && b.timer.counter() > 7){
        Render.remove(b.animation)
        b.animation = undefined
      }

      if (b.timer && b.timer.run(b, e)){
        b.hasPushed = false;
        b.timer.reset();
        delete b.timer;
      }
      return;
    }

    if(Gamepad.isPressed(e.controllerId, 0)){
      b.hasPushed = true;
      b.animation = Render.getAnimation([
        'push7',
        'push6',
        'push5',
        'push4',
        'push3',
        'push2',
        'push1'
      ], 0.8)
      const {animation} = b;
      animation.position.y = e.sprite.position.y;
      animation.position.x = e.sprite.position.x;
      animation.anchor.x = 0.5;
      animation.anchor.y = 0.5;
      animation.scale.x = 5;
      animation.scale.y = 5;
      animation.play()
      Render.add(animation)

      create(e);
      b.timer = Timer.create(60);
    }
  }
})

export default push;
