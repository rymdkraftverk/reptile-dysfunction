import { Core, Render, Entity, Timer, Key, Debug, Gamepad} from 'l1-lite';

export default () => {
  const enterCodeEntity = Entity.create('enter-code')
  enterCodeEntity.sprite = Render.getSprite('enter-secret-code')
  enterCodeEntity.type = 'enter-code'
  const { sprite } = enterCodeEntity

  sprite.width = 515
  sprite.height = 351
  sprite.anchor.x = 0
  sprite.anchor.y = 0
  sprite.scale.x = 1.5
  sprite.scale.y = 1.5
  sprite.position.x = 455
  sprite.position.y = 15

  enterCodeEntity.destroy = () => {
      Render.remove(enterCodeEntity.sprite)
  }

  Render.add(sprite)
  return enterCodeEntity 
}
