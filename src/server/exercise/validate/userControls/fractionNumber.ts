import { isValid, simplifyFractionNumber, INVALID_FRACTION_NUMBER } from 'server/utils/math'

export function fractionNumber(
  control: DB.UCFractionNumber,
  solution: DB.UCFractionNumberSolution,
  userInput: DB.UCFractionNumberSolution
): boolean {
  const a = simplifyFractionNumber(userInput || INVALID_FRACTION_NUMBER)
  const b = simplifyFractionNumber(solution || INVALID_FRACTION_NUMBER)

  if (isValid(a) && isValid(b)) {
    return a.numerator === b.numerator && a.denominator === b.denominator
  } else {
    return false
  }
}
