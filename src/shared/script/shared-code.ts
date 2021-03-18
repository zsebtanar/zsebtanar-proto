import { PseudoRandomNumberGenerator } from '../math/random'
import { mathUtils } from './shared-code/mathUtils'
import { langUtils } from './shared-code/langUtils'
import { unitConvertUtils } from './shared-code/unitConvertUtils'
import { stringUtils } from './shared-code/stringUtils'
import { suffixUtils } from './shared-code/suffixUtils'
import { randomUtils } from './shared-code/randomUtils'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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

  ...randomUtils(prng),
  ...unitConvertUtils,
  ...mathUtils,
  ...langUtils,
  ...suffixUtils,
  ...stringUtils,
})
