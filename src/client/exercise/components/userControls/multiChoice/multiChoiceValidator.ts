import { UCMultiChoice } from 'shared/exercise/types'

export function multiChoiceValidation(
  ctrl: UCMultiChoice,
  solution: UCMultiChoice['solution'],
  userInput: UCMultiChoice['solution'],
): boolean {
  if (!userInput?.length) return false

  return solution.every((item, idx) => userInput[idx] === item)
}
