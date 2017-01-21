import { Gamepad, Key, Entity, Timer, Core } from 'l1-lite';
import qs from 'query-string';

// consts
const allowed = ['initPhase', 'input']
const codeKeys = ['h', 'j', 'k', 'l']

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

const disable = () => {
  const entities = Core.getEntities()
  entities.forEach(e => {
    if(!allowed.includes(e.id)) {
      Core.remove(e)
      disabled.push(e)
    }
  })
  return disabled
}

const enable = () => {
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
    disable(e)
    if(ready()) transition(e, 'waiting', 'registration')
  }
}

const registration = {
  players: [],
  init: (b, e) => {
    console.log('registering')
    Core.get('input')
    .addClickListener('codeclick', (cid, btn) => {
      if(codeKeys.includes(btn)) {
        console.log(`[CODE KEY]: ${btn}`)
      }
    })
  },
  run: (b, e) => {
    if(registered()) {
      Core.get('input')
      .removeClickListener('codeclick')

      transition(e, 'registration', 'reveal')
    }
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
    enable()
  }
}

// shitty state
const disabled = []
const codes = []

// init
const phase = Entity.create('initPhase');
transition(phase, null, initState())

// export
export default phase
