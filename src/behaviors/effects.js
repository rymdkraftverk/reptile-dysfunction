import reversed from '../behaviors/movement-reversed';

export default function reverseKeys() {
  return {
    init: (b, e) => {
      delete e['movement-normal'];
      delete e['movement-pushed'];
      e['movement-reversed'] = reversed;
    },
  };
}
