import { Entity } from 'l1';

export default () => {
  const winnerGoodEntity = Entity.create('winner-good');
  const sprite = Entity.addSprite(winnerGoodEntity, 'winner-good');
  winnerGoodEntity.type = 'winner-good';

  sprite.width = 800;
  sprite.height = 600;
  sprite.anchor.x = 0;
  sprite.anchor.y = 0;
  sprite.scale.x = 1.5;
  sprite.scale.y = 1.5;
  sprite.position.x = 250;
  sprite.position.y = 20;

  winnerGoodEntity.destroy = () => {
    Entity.destroy(winnerGoodEntity);
  };

  return winnerGoodEntity;
};
