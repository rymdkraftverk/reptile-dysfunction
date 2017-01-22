import { Core, Render, Entity, Timer, Key, Debug, Gamepad} from 'l1-lite';

let rowCount = 0;
const rowRegistry = {}
const columnRegistry = [0,0,0,0,0]
const spriteMap = {
  '0': ['lizard1', 'lizard2'],
  '1': ['lizard1-p2', 'lizard2-p2'],
  '2': ['lizard1-p3', 'lizard2-p3'],
  '3': ['lizard1-p4', 'lizard2-p4'],
  '4': ['pikachu']
}

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

      const animation = Render.getAnimation(spriteMap[pid], 0.05)
      animation.width = 16;
      animation.height = 16;
      animation.anchor.x = 0.5;
      animation.anchor.y = 0.5;
      animation.scale.x = 4;
      animation.scale.y = 4;
      animation.position.x = 520
      animation.position.y = 190 + (rowCount * 100)

      animation.play()
      Render.add(animation)
      spriteCollection = spriteCollection.concat(animation)
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
