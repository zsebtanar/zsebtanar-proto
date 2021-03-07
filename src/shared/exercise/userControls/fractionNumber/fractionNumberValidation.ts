import {
  FractionNumber,
  INVALID_FRACTION_NUMBER,
  isValid,
  simplifyFractionNumber,
} from 'shared/math/fractionNumber'
import { UCFractionNumber } from 'shared/exercise/types'

export function fractionNumberValidation(
  ctrl: UCFractionNumber,
  solution: UCFractionNumber['solution'],
  userAnswer: FractionNumber,
): boolean {
  const a = simplifyFractionNumber(userAnswer || INVALID_FRACTION_NUMBER)
  const b = simplifyFractionNumber(solution || INVALID_FRACTION_NUMBER)

  if (isValid(a) && isValid(b)) {
    return a.numerator === b.numerator && a.denominator === b.denominator
  } else {
    return false
  }
}
