import { Game, Entity, Sound } from 'l1';
import { getPlayers, getEvilPlayer } from './player-handler';
import winnerGood from './winner-good';
import winnerEvil from './winner-evil';

export default function winCheck() {
  const entity = Entity.create('winCheck');
  entity.behaviors.checkForWin = checkForWin();
}

const checkForWin = () => ({
  timer: 200,
  soundTimer: 200,
  run: (b, e) => {
    b.timer--;
    if (b.timer === 0) {
      b.timer = 60;
      const players = getPlayers();
      const evil = getEvilPlayer();
      let gameOver = true;
      let evilWon = true;

      if (players.length === 0 || (evil && players.length === 1)) {
        winnerEvil();
        Game.music.stop();
        Game.music = Sound.getSound('sounds/fail.wav');
        Game.music.play();
      } else if (!evil) {
        winnerGood();
        evilWon = false;
        Game.music.stop();
        Game.music = Sound.getSound('sounds/victory.wav');
        Game.music.play();
      } else {
        gameOver = false;
      }

      if (gameOver) {
        displayEvil(evilWon);
        Entity.destroy(e);
        // eslint-disable-next-line no-undef
        setTimeout(window.location.reload.bind(window.location), 5000);
      }
    }
  },
});

function displayEvil(evilWon) {
  const { evilId } = Game;
  const entity = Entity.create('displayEvil');
  if (evilWon) {
    if (evilId === '0') Entity.addSprite(entity, 'lizard1-evil');
    if (evilId === '1') Entity.addSprite(entity, 'lizard1-p2-evil');
    if (evilId === '2') Entity.addSprite(entity, 'lizard1-p3-evil');
    if (evilId === '3') Entity.addSprite(entity, 'lizard1-p4-evil');
  }
  if (!evilWon) {
    if (evilId === '0') Entity.addSprite(entity, 'lizard1-evil-sad');
    if (evilId === '1') Entity.addSprite(entity, 'lizard1-p2-evil-sad');
    if (evilId === '2') Entity.addSprite(entity, 'lizard1-p3-evil-sad');
    if (evilId === '3') Entity.addSprite(entity, 'lizard1-p4-evil-sad');
  }

  entity.sprite.position.x = 20;
  entity.sprite.position.y = 200;
  entity.sprite.width = 16;
  entity.sprite.height = 16;
  entity.sprite.scale.x = 40;
  entity.sprite.scale.y = 40;
}
