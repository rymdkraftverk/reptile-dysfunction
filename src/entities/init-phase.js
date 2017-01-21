import { Key, Entity, Timer, Core } from 'l1-lite';
import qs from 'query-string';

// pure
const ready = () => ['up', 'down'].every(Key.isDown)

const registered = () => Key.isDown('left')

const behaviorize = run => ({ run })

const transition = (e, from, to) => {
  delete e.behaviours[from]
  e.behaviours[to] = eval(to)
}

// filthy
const initState = () => {
  const q = qs.parse(window.location.search);
  return q.state || 'waiting'
}

const disableRest = entity => {
  const entities = Core.getEntities()
  entities.forEach(e => {
    if(e != entity) {
      Core.remove(e)
      disabled.push(e)
    }
  })
  return disabled
}

const enableRest = () => {
  disabled.forEach(e => {
    Core.add(e)
  })
  disabled.length = 0
}

// states
const waiting = {
  init: (b, e) => {
    console.log('waiting...')
  },
  run: (b, e) => {
    disableRest(e)
    if(ready()) transition(e, 'waiting', 'registration')
  }
}

const registration = {
  init: (b, e) => {
    console.log('registering')
  },
  run: (b, e) => {
    if(registered()) transition(e, 'registration', 'reveal')
  }
}

const reveal = {
  init: (b, e) => {
    console.log('revealing')
  },
  run: (b, e) => {
    if(ready()) transition(e, 'reveal', 'finished')
  }
}

const finished = {
  init: (b, e) => {
    console.log('finished!')
  },
  run: (b, e) => {
    enableRest()
  }
}

// shitty state
const disabled = []

// init
const phase = Entity.create('initPhase');
transition(phase, null, initState())

// export
export default phase
