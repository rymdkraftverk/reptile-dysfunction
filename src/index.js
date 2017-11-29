import 'babel-polyfill';
import { Game, Sound } from 'l1';
import sprites from './sprites.json';
import map from './entities/map';
import treasure from './entities/treasure';
import './entities/init-phase';

import collisions from './collisions';

import input from './entities/input';

Game.init(1660, 930, sprites, { physics: true, debug: true }).then(() => {
  Game.start();

  input.registerKeys();

  const music = Sound.getSound('sounds/song.wav', {
    loop: true,
  });

  music.play();
  Game.music = music;

  map();
  treasure();
  collisions();
  // addPlayer('4');
});
