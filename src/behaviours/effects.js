import reversed from '../behaviours/movement-reversed.js';

export function reverseKeys(){
  return {
    init: (b, e) => { 
      delete e['movement-normal'];
      delete e['movement-pushed'];
      e['movement-reversed'] = reversed;
    },
    run: (b, e) => { 
      
    }
  }
}