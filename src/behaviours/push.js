import { Timer, Gamepad } from 'l1-lite';
import { create } from '../entities/push';

const push = {
  hasPushed: false,
  run: (b, e) => { 
    if (b.hasPushed) {
      if (b.timer && b.timer.run(b, e)){
        delete b.timer;
      }
      return;
    }

    if(Gamepad.isPressed(e.controllerId, 0)){
      b.hasPushed = true;
      create(e);
      b.timer = Timer.create(300, (b, e)=>{
        b.hasPushed = false;
      });
    }
  }
}

export default push;
