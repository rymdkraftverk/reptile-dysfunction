import { Entity, Render, Timer, Gamepad } from 'l1-lite';
import { create } from '../entities/push';

let animation = undefined

const push = {
  hasPushed: false,
  run: (b, e) => {
    if (b.hasPushed) {

      if (b.timer && b.timer.duration() < 284){
        Render.remove(animation)
        animation = undefined
      }

      if (b.timer && b.timer.run(b, e)){
        delete b.timer;
      }
      return;
    }

    if(Gamepad.isPressed(e.controllerId, 0)){
      b.hasPushed = true;
      animation = Render.getAnimation([
        'push7',
        'push6',
        'push5',
        'push4',
        'push3',
        'push2',
        'push1'
      ], 0.8)
      animation.position.y = e.sprite.position.y;
      animation.position.x = e.sprite.position.x;
      animation.anchor.x = 0.5;
      animation.anchor.y = 0.5;
      animation.scale.x = 5;
      animation.scale.y = 5;
      animation.play()
      Render.add(animation)

      create(e);
      b.timer = Timer.create(300, (b, e)=>{
        b.hasPushed = false;
      });
    }
  }
}

export default push;
