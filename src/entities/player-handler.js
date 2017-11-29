import { Entity, Gamepad } from 'l1';
import addPlayer from './player';

const playerHandler = Entity.create('playerHandler');
playerHandler.behaviors['track-players'] = {
  players: {},
  run: (b, e) => {
    const controllers = Gamepad.getGamepads();
    const controllerIds = Object.keys(controllers);
    const playerIds = Object.keys(b.players);

    controllerIds.forEach(id => {
      if (!playerIds.includes(id)) {
        b.players[id] = true;
        addPlayer(id);
        console.log('adding player', id);
      }
    });
  },
};

export function getPlayers() {
  return Entity.getAll().filter(e => e.type === 'player');
}

export function getGoodPlayers() {
  const players = getPlayers();
  return players.filter(p => p.alignment !== 'evil');
}

export function getEvilPlayer() {
  const players = getPlayers();
  return players.find(p => p.alignment === 'evil');
}

export default playerHandler;
