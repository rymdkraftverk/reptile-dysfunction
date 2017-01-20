import { Core, Render, Entity, Gamepad} from 'l1-lite';

const controller = Entity.create('controller');
controller.behaviours['scan-for-gamepads'] = {
  run: (b, e) => {
    Gamepad.run();
  }
}

Core.add(controller);

export default controller;