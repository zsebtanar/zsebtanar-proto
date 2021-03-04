import { UCSingleNumber } from 'shared/exercise/types'
import { floatEq } from 'shared/utils/math'
import { toPrecision } from '../../../math/base'

export function singleNumberValidation(
  desc: UCSingleNumber,
  solution: UCSingleNumber['solution'],
  userAnswer: string,
): boolean {
  const fractionDigits = desc?.props?.fractionDigits ?? 0
  return floatEq(toPrecision(solution, fractionDigits), toPrecision(userAnswer, fractionDigits))
}
