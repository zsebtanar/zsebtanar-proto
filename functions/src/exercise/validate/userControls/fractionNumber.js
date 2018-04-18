import { simplifyFractionNumber } from '../../../utils/math'

export function fractionNumber(control, solution, userInput) {
  const a = simplifyFractionNumber(userInput || {})
  const b = simplifyFractionNumber(solution || {})

  if (!a || !b) {
    return false
  } else {
    return a.numerator === b.numerator && a.denominator === b.denominator
  }
}
