import { Core, Render, Entity, Key, Gamepad, Timer} from 'l1-lite';

export default function winCheck(){
  const entity = Entity.create('winCheck');

  entity.behaviours['checkForWin'] = checkForWin;

  Core.add(entity);
}

const checkForWin = {
  timer: 200,
  init: (b, e) => { 

  },
  run: (b, e) => { 
    b.timer--;
    if (b.timer===0) {
      b.timer = 200;
      console.log("Checking if someone has won...");
    }
  }
}
