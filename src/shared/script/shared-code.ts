import { literals, PLNumber } from 'pocket-lisp-stdlib'
import { PseudoRandomNumberGenerator } from '../math/random'
import { range } from '../utils/fn'

export const valueSet = (prng: PseudoRandomNumberGenerator) => ({
  ['range']: (x: PLNumber) =>
    literals.vector.factory(...range(0, x.value, 1).map((v, k) => literals.int.factory(k + 1))),
  ['const']: x => () => x,
  ['random']: () => {
    return literals.int.factory(prng.randomFloat())
  },

  ['random-int']: () => {
    return literals.int.factory(prng.randomInt())
  },

  ['random-int-range']: (min: PLNumber, max: PLNumber, step: PLNumber) => {
    const range = max.value - min.value
    let randInt = prng.randomInt(range)
    if (step.value > 1 && randInt % step.value > 0) {
      randInt += randInt % step.value
    }
    return literals.int.factory(min.value + randInt)
  },
})
