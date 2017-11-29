import { Entity } from 'l1';

let rowCount = 0;
const rowRegistry = {};
const columnRegistry = [0, 0, 0, 0, 0];
const spriteMap = {
  0: ['lizard1', 'lizard2'],
  1: ['lizard1-p2', 'lizard2-p2'],
  2: ['lizard1-p3', 'lizard2-p3'],
  3: ['lizard1-p4', 'lizard2-p4'],
  4: ['pikachu'],
};

let entityCollection = [];

export default () => {
  const enterCodeEntity = Entity.create('enter-code');
  const sprite = Entity.addSprite(enterCodeEntity, 'enter-secret-code', {
    zIndex: 200,
  });
  enterCodeEntity.type = 'enter-code';

  sprite.width = 515;
  sprite.height = 351;
  sprite.anchor.x = 0;
  sprite.anchor.y = 0;
  sprite.scale.x = 1.5;
  sprite.scale.y = 1.5;
  sprite.position.x = 455;
  sprite.position.y = 15;

  enterCodeEntity.destroy = () => {
    for (let i = 0; i < entityCollection.length; i++) {
      Entity.destroy(entityCollection[i]);
    }
    Entity.destroy(enterCodeEntity);
  };

  enterCodeEntity.addKey = (pid) => {
    if (rowRegistry[pid] === undefined) {
      rowRegistry[pid] = rowCount;

      const playerControllerEntity = Entity.create(`playerControllerEntity${pid}`);
      const animation = Entity.addAnimation(playerControllerEntity, spriteMap[pid], 0.05);
      animation.width = 16;
      animation.height = 16;
      animation.anchor.x = 0.5;
      animation.anchor.y = 0.5;
      animation.scale.x = 4;
      animation.scale.y = 4;
      animation.position.x = 520;
      animation.position.y = 190 + (rowCount * 100);

      entityCollection = entityCollection.concat(playerControllerEntity);
      rowCount++;
    }

    const pRow = rowRegistry[pid];
    const pColumn = columnRegistry[pRow];

    const entity = Entity.create('code-gray');
    const newsprite = Entity.addSprite(entity, 'code-gray');
    newsprite.width = 102;
    newsprite.height = 100;
    newsprite.anchor.x = 0.5;
    newsprite.anchor.y = 0.5;
    newsprite.scale.x = 0.5;
    newsprite.scale.y = 0.5;
    newsprite.position.x = 620 + (pColumn * 150);
    newsprite.position.y = 190 + (pRow * 100);

    entityCollection = entityCollection.concat(newsprite);
    columnRegistry[pRow]++;
  };

  return enterCodeEntity;
};
