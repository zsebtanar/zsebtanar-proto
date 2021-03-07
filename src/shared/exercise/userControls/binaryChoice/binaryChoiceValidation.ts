import { UCBinaryChoice } from 'shared/exercise/types'

export function binaryChoiceValidation(
  ctrl: UCBinaryChoice,
  solution: UCBinaryChoice['solution'],
  userAnswer: boolean[],
): boolean {
  if (!userAnswer?.length) {
    return false
  }

  return solution.every((val, idx) => userAnswer[idx] === val)
}
