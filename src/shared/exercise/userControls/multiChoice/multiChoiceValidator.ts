import { UCMultiChoice } from 'shared/exercise/types'

export function multiChoiceValidation(
  ctrl: UCMultiChoice,
  solution: UCMultiChoice['solution'],
  userAnswer: boolean[],
): boolean {
  if (!userAnswer?.length) {
    return false
  }

  return solution.every((item, idx) => userAnswer[idx] === item)
}
