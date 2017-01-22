import { Core, Render, Entity, Key, Gamepad, Timer} from 'l1-lite';
import { Howl } from 'howler';
import { getPlayers, getEvilPlayer } from './player-handler';

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
      const evil = getEvilPlayer();
      let gameOver = true;
      
      console.log("Checking if someone has won...");

      if (players.length === 0){
        console.log("DRAW!");
      }
      else if (evil && players.length===1) {
        console.log("EVIL WON!");
        Core.music.stop();
        Core.music = new Howl({
          src: ['sounds/fail.wav'],
          loop: false
        });
        Core.music.play();
      } else if (!evil){
        console.log("GOOD WON");
        Core.music.stop();
        Core.music = new Howl({
          src: ['sounds/victory.wav'],
          loop: false
        });
        Core.music.play();
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
