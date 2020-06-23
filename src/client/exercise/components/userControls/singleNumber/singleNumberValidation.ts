import { UCSingleNumber } from 'shared/exercise/types'
import { floatEq } from 'shared/utils/math'

export function singleNumberValidation(
  { isDynamic, name, props: { fractionDigits }, solution }: UCSingleNumber,
  userInput: UCSingleNumber['solution'],
  interpret: (src: string) => unknown,
): boolean {
  if (isDynamic) {
    solution = (interpret(`(solution-${name})`) as object).toString()
  }

  return floatEq(toPrecision(solution, fractionDigits), toPrecision(userInput, fractionDigits))
}

function toPrecision(num: string, p = 0) {
  const x = 10 ** p
  return Math.round(parseFloat(num) * x) / x
}
