import { literals, PLNumber } from 'pocket-lisp-stdlib'
import { PseudoRandomNumberGenerator } from '../math/random'
import { range } from '../utils/fn'

export const valueSet = (prng: PseudoRandomNumberGenerator) => ({
  /**
   *
   * @param x
   */
  ['range']: (x: PLNumber) =>
    literals.vector.factory(...range(0, x.value, 1).map((v, k) => literals.int.factory(k + 1))),

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
    return literals.int.factory(prng.randomFloat())
  },

  /**
   * Returns an integer, pseudo-random number in the range 0 to less then the given number
   * (inclusive of 0, but not the given number)
   *
   * @param num upper bound
   */
  ['random-int']: (num: PLNumber) => {
    return literals.int.factory(prng.randomInt(num.value))
  },

  /**
   * Returns an integer, pseudo-random number in the range min to less then max
   * (inclusive of min, but not max)
   *
   * @param min   minimum random number
   * @param max   upper bound
   * @param step  step
   */
  ['random-int-range']: (min: PLNumber, max: PLNumber, step: PLNumber) => {
    const range = max.value - min.value
    let randInt = prng.randomInt(range)
    if (step.value > 1 && randInt % step.value > 0) {
      randInt += randInt % step.value
    }
    return literals.int.factory(min.value + randInt)
  },
})
