import { literals, PLNumber, plNumber } from 'pocket-lisp-stdlib'
import { PseudoRandomNumberGenerator } from '../math/random'
import { assertIntegerRange } from './shared-code/utils'
import { mathUtils } from './shared-code/mathUtils'
import { langUtils } from './shared-code/langUtils'
import { unitConvertUtils } from './shared-code/unitConvertUtils'
import { stringUtils } from './shared-code/stringUtils'

export const valueSet = (prng: PseudoRandomNumberGenerator) => ({
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
   * Returns random number in a given range
   *
   * @param min   minimum random number
   * @param max   upper bound
   */
  ['random-int']: (min: PLNumber, max: PLNumber): PLNumber => {
    assertIntegerRange(min.value, max.value)
    const rnd = Math.floor(prng.randomFloat() * (max.value - min.value + 1) + min.value)
    return plNumber(rnd)
  },
  ...unitConvertUtils,
  ...mathUtils,
  ...langUtils,
  ...stringUtils,
})
