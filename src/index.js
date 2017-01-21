import { Core, Render, Entity, Timer, Key, Debug, Gamepad} from 'l1-lite';
import { Howl } from 'howler';
import sprites from './sprites.json';
import map from './entities/map'
import treasure from './entities/treasure'

import Matter from 'matter-js'
import addWave from './entities/wave.js'
import initPhase from './entities/init-phase.js'
import winCheck from './entities/win-check.js'
import collisions from './collisions'

import { addPlayer } from './entities/player'

var Engine = Matter.Engine;
var engine = Engine.create();
var World = Matter.World;
var Bodies = Matter.Bodies;
engine.world.gravity.y = 0;
Engine.run(engine);

Core.engine = engine;
Core.World = World;
Core.Bodies = Bodies;

Core.Render = Render;

import playerHandler from './entities/player-handler';
import input from './entities/input';

Render.createRenderer(1660, 930, sprites).then(() => {
  Core.createCore();
  Core.start();
  Debug.initDebugTools();

  Core.add(input)
  input.registerKeys()

  const sound = new Howl({
    src: ['sounds/song.wav'],
    loop: true
  });
  sound.play();

  map(Core);
  treasure();
  winCheck();
  collisions();
  addPlayer('4');
  Core.add(initPhase)
});
