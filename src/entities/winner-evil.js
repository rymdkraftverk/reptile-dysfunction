import { Core, Render, Entity, Timer, Key, Debug, Gamepad} from 'l1-lite';

export default () => {
  const winnerEvilEntity = Entity.create('winner-evil')
  winnerEvilEntity.sprite = Render.getSprite('winner-evil')
  winnerEvilEntity.type = 'winner-evil'
  const { sprite } = winnerEvilEntity

  sprite.width = 800
  sprite.height = 600
  sprite.anchor.x = 0
  sprite.anchor.y = 0
  sprite.scale.x = 1.5
  sprite.scale.y = 1.5
  sprite.position.x = 250
  sprite.position.y = 20

  winnerEvilEntity.destroy = () => {
    Render.remove(winnnerEvilEntity.sprite)
  }

  Render.add(sprite)

  return winnnerEvilEntity
}
