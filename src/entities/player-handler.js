import { Core, Render, Entity, Gamepad} from 'l1-lite';

const PLAYER1_START_POS = {
  x: 50,
  y: 50
};

const PLAYER2_START_POS = {
  x: 200,
  y: 200
};

const PLAYER_SCALE = 2;

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

function addPlayer(id){
  const player = Entity.create('player' + parseInt(id)+1);
  if (id==0){
    player.sprite = Render.getSprite('player1');
    const { sprite } = player;
    sprite.position.y = PLAYER1_START_POS.y;
    sprite.position.x = PLAYER1_START_POS.x;
  }  
  else if (id==1){
    player.sprite = Render.getSprite('player2');
    const { sprite } = player;
    sprite.position.y = PLAYER2_START_POS.y;
    sprite.position.x = PLAYER2_START_POS.x;
  }
  const { sprite } = player;
  sprite.width = 16;
  sprite.height = 16;
  sprite.scale.x = PLAYER_SCALE;
  sprite.scale.y = PLAYER_SCALE;
  Render.add(sprite); 
  Core.add(player);
}
