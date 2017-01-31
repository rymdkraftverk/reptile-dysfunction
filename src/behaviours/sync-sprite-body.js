
const b = {
  run: (b, e)=>{
    const { x, y } = e.body.position;

    if (e.sprite){
      e.sprite.position.y = y;
      e.sprite.position.x = x;
    }

    if (e.animation){
      e.animation.position.y = y;
      e.animation.position.x = x;
    }
  }
}

export default b;