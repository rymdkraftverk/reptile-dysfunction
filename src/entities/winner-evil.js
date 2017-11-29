import { Entity } from 'l1';

export default () => {
  const winnerEvilEntity = Entity.create('winner-evil');
  const sprite = Entity.addSprite('winner-evil');
  winnerEvilEntity.type = 'winner-evil';

  sprite.width = 800;
  sprite.height = 600;
  sprite.anchor.x = 0;
  sprite.anchor.y = 0;
  sprite.scale.x = 1.5;
  sprite.scale.y = 1.5;
  sprite.position.x = 250;
  sprite.position.y = 20;

  winnerEvilEntity.destroy = () => {
    Entity.destroy(winnerEvilEntity);
  };

  return winnerEvilEntity;
};
