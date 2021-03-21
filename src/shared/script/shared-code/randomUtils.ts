import { literals, plNumber, PLNumber, plVector, PLVector } from 'pocket-lisp-stdlib'
import { assertIntegerRange } from './utils'
import { PseudoRandomNumberGenerator } from '../../math/random'

function random(prng: PseudoRandomNumberGenerator) {
  /**
   * Returns a floating-point, pseudo-random number in the range 0 to less than 1
   * (inclusive of 0, but not 1)
   */
  return (): PLNumber => literals.Int.nativeConstructor(prng.randomFloat())
}

function randomInt(prng: PseudoRandomNumberGenerator) {
  /**
   * Returns random number in a given range
   *
   * @param min   minimum random number
   * @param max   upper bound
   */
  return (min: PLNumber, max: PLNumber): PLNumber => {
    assertIntegerRange(min.value, max.value)
    const rnd = Math.floor(prng.randomFloat() * (max.value - min.value + 1) + min.value)
    return plNumber(rnd)
  }
}

function shuffle(prng: PseudoRandomNumberGenerator) {
  return (v: PLVector<any>): PLVector<any> => {
    const vv = [...v.value]
    // based on: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
    let j, x, i
    for (i = vv.length - 1; i > 0; i--) {
      j = Math.floor(prng.randomFloat() * (i + 1))
      x = vv[i]
      vv[i] = vv[j]
      vv[j] = x
    }
    return plVector(...vv)
  }
}

export const randomUtils = (prng: PseudoRandomNumberGenerator) => ({
  random: random(prng),
  ['random-int']: randomInt(prng),
  shuffle: shuffle(prng),
})
