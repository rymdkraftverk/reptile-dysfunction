import { Core, Render, Entity, Timer, Key, Debug, Gamepad, Physics, Sound } from 'l1-lite';
import sprites from './sprites.json';
import map from './entities/map'
import treasure from './entities/treasure'

import addWave from './entities/wave.js'
import initPhase from './entities/init-phase.js'
import winCheck from './entities/win-check.js'
import collisions from './collisions'
import waitingForPlayers from './entities/waiting-for-players'

import { addPlayer } from './entities/player'

import playerHandler from './entities/player-handler';
import input from './entities/input';

Render.createRenderer(1660, 930, sprites).then(() => {
  Core.createCore();
  Core.start();
  Core.createPhysics();

  Debug.initDebugTools();

  Core.add(input)
  input.registerKeys()

  const music = Sound.getSound('sounds/song.wav', {
    loop: true
  });

  music.play();
  Core.music = music

  map(Core);
  treasure();
  winCheck();
  collisions();
  addPlayer('4');
  Core.add(initPhase)
});
