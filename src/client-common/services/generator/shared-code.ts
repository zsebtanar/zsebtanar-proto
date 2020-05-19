import { PseudoRandomNumberGenerator } from 'client-common/util/random'
import { literals, PLNumber } from 'pocket-lisp-stdlib'

export const valueSet = (prng: PseudoRandomNumberGenerator) => ({
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
  }
})
