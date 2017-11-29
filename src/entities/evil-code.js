import { Entity } from 'l1';

export default (code) => {
  let codeList = [];

  for (let i = 0; i < code.length; i++) {
    let entity;
    const c = code[i];
    switch (c) {
      case 'y':
        entity = Entity.create('code-yellow');
        Entity.addSprite(entity, 'code-yellow', { zIndex: -10 });
        break;
      case 'r':
        entity = Entity.create('code-red');
        Entity.addSprite(entity, 'code-red', { zIndex: -10 });
        break;
      case 'b':
        entity = Entity.create('code-blue');
        Entity.addSprite(entity, 'code-blue', { zIndex: -10 });
        break;
      case 'g':
        entity = Entity.create('code-green');
        Entity.addSprite(entity, 'code-green', { zIndex: -10 });
        break;
      default:
        break;
    }

    if (entity) {
      codeList = codeList.concat(entity);
    }
  }


  const evilCodeEntity = Entity.create('evil-code');
  const sprite = Entity.addSrpite(evilCodeEntity, 'evil-code');
  evilCodeEntity.type = 'evil-code';

  sprite.width = 515;
  sprite.height = 166;
  sprite.anchor.x = 0;
  sprite.anchor.y = 0;
  sprite.scale.x = 1.5;
  sprite.scale.y = 1.5;
  sprite.position.x = 455;
  sprite.position.y = 15;

  evilCodeEntity.destroy = () => {
    for (let i = 0; i < codeList.length; i++) {
      Entity.destroy(codeList[i]);
    }
  };

  for (let i = 0; i < codeList.length; i++) {
    const codeSprite = codeList[i].sprite;

    codeSprite.width = 102;
    codeSprite.height = 100;
    codeSprite.anchor.x = 0;
    codeSprite.anchor.y = 0;
    codeSprite.scale.x = 0.5;
    codeSprite.scale.y = 0.5;
    codeSprite.position.x = 560 + (i * 150);
    codeSprite.position.y = 180;
  }
  return evilCodeEntity;
};
