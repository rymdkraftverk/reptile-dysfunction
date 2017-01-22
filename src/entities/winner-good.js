import { Core, Render, Entity, Timer, Key, Debug, Gamepad} from 'l1-lite';

export default () => {
  const winnerGoodEntity = Entity.create('winner-good')
  winnerGoodEntity.sprite = Render.getSprite('winner-good')
  winnerGoodEntity.type = 'winner-good'
  const { sprite } = winnerGoodEntity

  sprite.width = 800
  sprite.height = 600
  sprite.anchor.x = 0
  sprite.anchor.y = 0
  sprite.scale.x = 1.5
  sprite.scale.y = 1.5
  sprite.position.x = 250
  sprite.position.y = 20

  winnerGoodEntity.destroy = () => {
    Render.remove(winnerGoodEntity.sprite)
  }

  Render.add(sprite)

  return winnerGoodEntity
}
