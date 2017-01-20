  // Animation Example
  const lizard = Entity.create();
  const animationSpeed = 0.05;
  lizard.animation = Render.getAnimation(['lizard1', 'lizard2'], animationSpeed);
  const { animation } = lizard;
  animation.position.y = 100;
  animation.position.x = 100;
  animation.scale.x = 8;
  animation.scale.y = 8;
  animation.play();

  Render.add(animation);
  Core.add(lizard);