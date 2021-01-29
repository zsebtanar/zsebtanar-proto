import { UCBinaryChoice } from 'shared/exercise/types'

export function binaryChoiceValidation(
  ctrl: UCBinaryChoice,
  solution: UCBinaryChoice['solution'],
  userInput: UCBinaryChoice['solution'],
): boolean {
  if (!userInput?.length) return false

  return solution.every((val, idx) => userInput[idx] === val)
}
