import { Core, Render, Entity, Key, Gamepad, Timer} from 'l1-lite';
import { getPlayers } from './player-handler';

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
      const players = getPlayers();
      const evil = players.find(p => p.alignment === 'evil');
      let gameOver = true;
      
      console.log("Checking if someone has won...");

      if (players.length === 0){
        console.log("DRAW!");
      }
      else if (evil && players.length===1) {
        console.log("EVIL WON!");
      } else if (!evil){
        console.log("GOOD WON");
      } else {
        console.log("Players still alive...", players);
        gameOver = false;
      }

      if (gameOver) {
        Core.remove(e);
      }
    }
  }
}
