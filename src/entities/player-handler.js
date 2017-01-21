import { Core, Render, Entity, Gamepad} from 'l1-lite';
import movementNormal from '../behaviours/movement-normal.js';
import {addPlayer} from './player';

const playerHandler = Entity.create('playerHandler');
playerHandler.behaviours['track-players'] = {
  players: {},
  run: (b, e) => {
    const controllers = Gamepad.getGamepads();
    const controllerIds = Object.keys(controllers);
    const playerIds = Object.keys(b.players);

    controllerIds.forEach(id => {
      if (!playerIds.includes(id)){
        b.players[id] = true;
        addPlayer(id);
        console.log('adding player', id);
      }
    });
  }
}

Core.add(playerHandler);

export default playerHandler;