import { Gamepad, Render, Key, Entity, Timer, Core } from 'l1-lite';
import qs from 'query-string';

// consts
const allowed = ['initPhase', 'input']
const codeKeys = ['h', 'j', 'k', 'l']

// pure
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

const controllerIds = () => {
  return Core.get('input')
  .controllerIds()
  .concat(['keyboard']) // remove to disable keyboard
}

const spawnEvil = cid => {
  const kid = getArbitraryNumberInsteadOfSensibleControllerIdForKeyboard(cid)
  const e = Core.getEntities()
  const players = disabled.filter(e => e.type == 'player')
  const evil = players.filter(e => e.controllerId == kid)
  if(!evil) throw new Error('No evil found')
  if(evil.length != 1) throw new Error('Too much evil found')
  evil[0].alignment = 'evil'
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

const getArbitraryNumberInsteadOfSensibleControllerIdForKeyboard = id => {
  return id == 'keyboard' ? '4': id
}

// states
const waiting = {
  complete: () => {
    const count = controllerIds().length
    return readyPlayers.length == count
  },
  init: (b, e) => {
    console.log('waiting...')

    Core.get('input')
    .addClickListener('ready', (cid, btn) => {
      if(!readyPlayers.includes(cid)) {
        readyPlayers.push(cid)

        Core.get('waiting-for-players')
        .behaviours['add-player'].add()
      }
    })
  },
  run: (b, e) => {
    disable()
    if(b.complete()) transition(e, 'waiting', 'registration')
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
    controllerIds()
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
      cid: k,
      code: c
    }
  },
  init: (b, e) => {
    console.log('revealing')
    const p = b.pick(e.codes)
    const code = p.code.map(btn => btn.toUpperCase())
    console.log(`[REVEAL] Player with code [${code}] is EVIL`)
    spawnEvil(p.cid)
  },
  run: (b, e) => {
    transition(e, 'reveal', 'finished')
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
const readyPlayers = []

// init
const phase = Entity.create('initPhase');
transition(phase, null, initState())

// export
export default phase
