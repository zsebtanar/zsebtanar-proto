import { UCSingleNumber } from '../../../../../shared/exercise/types'

export function singleNumber(
  control: UCSingleNumber,
  solution: UCSingleNumber['solution'],
  userInput: UCSingleNumber['solution']
): boolean {
  return solution === userInput
}
