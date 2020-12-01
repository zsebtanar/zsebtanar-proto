import { literals, PLNumber } from 'pocket-lisp-stdlib'
import { PseudoRandomNumberGenerator } from '../math/random'
import { assertInteger, assert } from './shared-code/utils'
import { range } from '../utils/fn'
import { listDivisors, randomIntBetween, rangeBetween } from '../utils/math'
import { langUtils } from './shared-code/langUtils'
import { stringUtils } from './shared-code/stringUtils'

export const valueSet = (prng: PseudoRandomNumberGenerator) => ({
  /**
   *
   * @param x
   */
  ['range']: (x: PLNumber) =>
    literals.Vector.factory(...range(-1, x.value - 1, 1).map((v, k) => literals.Int.factory(k))),

  /**
   * Generate list of numbers within range
   *  
   * @param start first element
   * @param end   last element
   */
  ['range-between']: (start: PLNumber, end: PLNumber) => {
    assertInteger(start.value)
    assertInteger(end.value)
    const rng = rangeBetween(start.value, end.value);
    return literals.Vector.factory(...rng.map((v, k) => literals.Int.factory(k)))
  },


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
  
  /**
   * Returns random number in a given range
   *
   * @param min   minimum random number
   * @param max   upper bound
   */
  ['rand-between']: (min: PLNumber, max: PLNumber) => {
    assertInteger(min.value)
    assertInteger(max.value)
    const rnd = randomIntBetween(min.value, max.value)
    return literals.Int.factory(rnd)
  },

  /**
   * Returns list of divisors of a number
   *
   * @param n number
   */
  ['divisors']: (n: PLNumber) => {
    assertInteger(n.value)
    assert(n.value < 1, `Number out of range (< 1): ${n.value}`)
    assert(n.value >= 1000000, `Number too large`)
		const divisorList = listDivisors(n.value)
    return literals.Vector.factory(...divisorList.map((v, k) => literals.Int.factory(v)))
  },
  ...langUtils,
  ...stringUtils,
})