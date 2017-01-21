import { Core, Render, Entity, Timer, Key, Debug, Gamepad} from 'l1-lite';
import sprites from './sprites.json';
import map from './entities/map'
import treasure from './entities/treasure'

import Matter from 'matter-js'

import addWave from './entities/wave.js'
import initPhase from './entities/init-phase.js'

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
import controller from './entities/controller';

Render.createRenderer(1660, 930, sprites).then(() => {
  
  Core.createCore();
  Core.start();
  Debug.initDebugTools();
  Key.add('up');
  Key.add('right');
  Key.add('down');
  Key.add('left');

  Core.add(initPhase)
  map(Core);
  addWave(Core);
  treasure();

  addPlayer('1');

});
