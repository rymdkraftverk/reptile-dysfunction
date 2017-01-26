  entity.behaviours['delete-move-y'] = {
    timer: Timer.create(300),
    run: (b, e) => {
      const { timer } = b;
      if (timer){
        if (timer.run(b, e)){
          delete b.timer;
          delete e.behaviours['move-y'];
        }
      }
    }
  }

  // Controller test
  const controller = Entity.create();
  controller.behaviours['scan-for-gamepads'] = {
    run: (b, e) => {
      Gamepad.run();
      if (Key.isDown('up')){
        console.log('gamepads', Gamepad.getGamepads());
      }
    }
  }
  Core.add(controller);