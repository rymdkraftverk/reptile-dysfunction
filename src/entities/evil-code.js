import { Core, Render, Entity, Timer, Key, Debug, Gamepad} from 'l1-lite';

export default (code) => {
  let codeList = []

  for (let i = 0; i < code.length; i++){
    let newCodeSprite = undefined
      const c = code[i]
      switch(c) {
        case 'y':
          newCodeSprite = Render.getSprite('code-yellow')
        break
        case 'r':
          newCodeSprite = Render.getSprite('code-red')
        break
        case 'b':
          newCodeSprite = Render.getSprite('code-blue')
        break
        case 'g':
          newCodeSprite = Render.getSprite('code-green')
        break
      }

    if (newCodeSprite) {
      newCodeSprite.zIndex = -10;
      codeList = codeList.concat(newCodeSprite)
    }
  }


  const evilCodeEntity = Entity.create('evil-code')
  evilCodeEntity.sprite = Render.getSprite('evil-code')
  evilCodeEntity.type = 'evil-code'
  const { sprite } = evilCodeEntity

  sprite.width = 515
  sprite.height = 166
  sprite.anchor.x = 0
  sprite.anchor.y = 0
  sprite.scale.x = 1.5
  sprite.scale.y = 1.5
  sprite.position.x = 455
  sprite.position.y = 15

  evilCodeEntity.destroy = () => {
      Render.remove(evilCodeEntity.sprite)
  }

  evilCodeEntity.destroy = () => {
    for (let i = 0; i < codeList.length; i++) {
      Render.remove(codeList[i])
    }

    Render.remove(evilCodeEntity.sprite)
    Core.remove(evilCodeEntity)
  }

  Render.add(sprite)

  for (let i = 0; i < codeList.length; i++){
    const sprite = codeList[i]

    sprite.width = 102
    sprite.height = 100
    sprite.anchor.x = 0
    sprite.anchor.y = 0
    sprite.scale.x = 0.5
    sprite.scale.y = 0.5
    sprite.position.x = 560 + (i * 150)
    sprite.position.y = 180

    Render.add(sprite)
  }
  return evilCodeEntity
}
