import {Core, Entity, Render} from 'l1-lite'

export default () => {
  
const entity = Entity.create('map');
  entity.sprite = Render.getSprite('map');
  const { sprite } = entity;

  sprite.position.y = 0;
  sprite.position.x = 0;
  sprite.width = 1660;
  sprite.height = 930;
  //sprite.scale.x = 4;
  //sprite.scale.y = 4;

  Render.add(sprite);
  Core.add(entity);

}
