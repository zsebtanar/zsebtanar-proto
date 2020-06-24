import { UCSingleNumber } from 'shared/exercise/types'
import { floatEq } from 'shared/utils/math'

export function singleNumberValidation(
  { props: { fractionDigits } }: UCSingleNumber,
  solution: UCSingleNumber['solution'],
  userInput: UCSingleNumber['solution'],
): boolean {
  return floatEq(toPrecision(solution, fractionDigits), toPrecision(userInput, fractionDigits))
}

function toPrecision(num: string, p = 0) {
  const x = 10 ** p
  return Math.round(parseFloat(num) * x) / x
}
