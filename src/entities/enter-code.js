import { Core, Render, Entity, Timer, Key, Debug, Gamepad} from 'l1-lite';

let rowCount = 0;
const rowRegistry = {}
const columnRegistry = [0,0,0,0,0]

let spriteCollection = []

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
      for (let i = 0; i < spriteCollection.lenght; i++) {
        Render.remove(spriteCollection[i])
      }
      Render.remove(enterCodeEntity.sprite)
  }

  enterCodeEntity.addKey = (pid) => {
    if (rowRegistry[pid] === undefined) {
      rowRegistry[pid] = rowCount
      rowCount++
    }

    const pRow = rowRegistry[pid]
    const pColumn = columnRegistry[pRow]

    const newsprite = Render.getSprite('code-gray')
    newsprite.width = 102
    newsprite.height = 100
    newsprite.anchor.x = 0.5
    newsprite.anchor.y = 0.5
    newsprite.scale.x = 0.5
    newsprite.scale.y = 0.5
    newsprite.position.x = 620 + (pColumn * 150)
    newsprite.position.y = 190 +  (pRow * 100)

    spriteCollection = spriteCollection.concat(newsprite)
    columnRegistry[pRow]++
    Render.add(newsprite)
  }


  Render.add(sprite)
  return enterCodeEntity
}
