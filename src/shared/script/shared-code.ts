import { literals, PLNumber } from 'pocket-lisp-stdlib'
import { PseudoRandomNumberGenerator } from '../math/random'
import { range } from '../utils/fn'
import { langUtils } from './shared-code/langUtils'
import { stringUtils } from './shared-code/stringUtils'
import { suffixUtils } from './shared-code/suffixUtils'

export const valueSet = (prng: PseudoRandomNumberGenerator) => ({
  /**
   *
   * @param x
   */
  ['range']: (x: PLNumber) =>
    literals.Vector.factory(...range(-1, x.value - 1, 1).map((v, k) => literals.Int.factory(k))),

  /**
   * Constant function
   *
   * @example:
   *   (def PIfn (const 3.14))
   *   (print (PIfn))
   *
   * @param x
   */
  ['const']: (x) => () => x,

  /**
   * Returns a floating-point, pseudo-random number in the range 0 to less than 1
   * (inclusive of 0, but not 1)
   */
  ['random']: () => {
    return literals.Int.factory(prng.randomFloat())
  },

  /**
   * Returns an integer, pseudo-random number in the range 1 to the given number
   *
   * @param num upper bound
   */
  ['random-int']: (num: PLNumber) => {
    return literals.Int.factory(prng.randomInt(num.value + 1))
  },

  /**
   * Returns an integer, pseudo-random number in the range 0 to the given number
   *
   * @param num upper bound
   */
  ['random-int-0']: (num: PLNumber) => {
    return literals.Int.factory(prng.randomInt(num.value))
  },

  /**
   * Returns an integer, pseudo-random number in the range min to max
   *
   * @param min   minimum random number
   * @param max   upper bound
   * @param step  step
   */
  ['random-int-range']: (min: PLNumber, max: PLNumber, step: PLNumber) => {
    const range = max.value - min.value
    let randInt = prng.randomInt(range + 1)
    if (step.value > 1 && randInt % step.value > 0) {
      randInt += randInt % step.value
    }
    return literals.Int.factory(min.value + randInt)
  },
  ...langUtils,
  ...suffixUtils,
  ...stringUtils,
})
