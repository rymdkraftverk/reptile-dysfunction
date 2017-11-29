import { Entity } from 'l1';

export default () => {
  const waitingForPlayersEntity = Entity.create('waiting-for-players');
  const sprite = Entity.addSprite(waitingForPlayersEntity, 'waiting-for-players');
  waitingForPlayersEntity.type = 'waiting-for-players';

  sprite.width = 515;
  sprite.height = 162;
  sprite.anchor.x = 0;
  sprite.anchor.y = 0;
  sprite.scale.x = 1.5;
  sprite.scale.y = 1.5;
  sprite.position.x = 455;
  sprite.position.y = 20;

  const newPlayers = [];
  let currentPlayers = 0;
  let playerSprites = [];

  // const sprites = {
  //   0: 'lizard1',
  //   1: 'lizard1-p2',
  //   2: 'lizard1-p3',
  //   3: 'lizard1-p4',
  // };

  waitingForPlayersEntity.behaviors['add-player'] = {
    add: (newPlayer) => {
      newPlayers.push(newPlayer);
    },
    run: (b, e) => {
      if (newPlayers.length > 0) {
        const newPlayerEntity = Entity.create(`waiting-for-player-player-${currentPlayers}`);
        // const newPlayerSprite = sprites[newPlayers.pop()];
        Entity.addSprite(newPlayerEntity, sprite);
        newPlayerEntity.type = 'waiting-for-player-player';
        newPlayerEntity.sprite.width = 12;
        newPlayerEntity.sprite.height = 13;
        newPlayerEntity.sprite.anchor.x = 0;
        newPlayerEntity.sprite.anchor.y = 0;
        newPlayerEntity.sprite.scale.x = 5;
        newPlayerEntity.sprite.scale.y = 5;
        newPlayerEntity.sprite.position.x = 500 + (currentPlayers * 180);
        newPlayerEntity.sprite.position.y = 170;

        currentPlayers++;
        playerSprites = playerSprites.concat(newPlayerEntity.sprite);
      }
    },
  };

  waitingForPlayersEntity.destroy = () => {
    playerSprites.forEach(ps => {
      Render.remove(ps);
    });

    Entity.destroy(waitingForPlayersEntity);
  };
};
