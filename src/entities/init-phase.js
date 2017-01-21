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
  codeLength: 4,
  complete: (b, e) => {
    return Object.keys(e.codes)
    .map(k => e.codes[k].length == b.codeLength)
    .reduce((p, c) => p && c)
  },
  init: (b, e) => {
    console.log('registering')

    // clear codes
    e.codes = {}
    Core.get('input')
    .controllerIds()
    .concat(['keys']) // remove to disable keyboard
    .forEach(id => {
      e.codes[id] = []
    })

    Core.get('input')
    .addClickListener('codeclick', (cid, btn) => {
      if(codeKeys.includes(btn)) {
        // console.log(`[CODE KEY]: cid: ${cid}, btn: ${btn}`)
        const code = e.codes[cid]
        if(code.length < b.codeLength) {
          code.push(btn)
        }
        // console.log(`[CODE]: ${code} (cid: ${cid})`)
        if(b.complete(b, e)) {
          Core.get('input')
          .removeClickListener('codeclick')

          transition(e, 'registration', 'reveal')
        }
      }
    })
  },
  run: () => {}
}

const reveal = {
  pick: (codes) => {
    const controllers = Object.keys(codes)
    const i = Math.floor(Math.random() * controllers.length)
    const k = controllers[i]
    const c = codes[k]
    return {
      controller: k,
      code: c
    }
  },
  init: (b, e) => {
    console.log('revealing')
    const p = b.pick(e.codes)
    const code = p.code.map(btn => btn.toUpperCase())
    console.log(`[REVEAL] Player with code [${code}] is EVIL`)
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
