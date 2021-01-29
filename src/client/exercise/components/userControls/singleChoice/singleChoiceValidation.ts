import { UCSingleChoice } from 'shared/exercise/types'

export function singleChoiceValidation(
  control: UCSingleChoice,
  solution: UCSingleChoice['solution'],
  userInput: UCSingleChoice['solution'],
): boolean {
  return solution === userInput
}
