import { UCSingleChoice } from 'shared/exercise/types'

export function singleChoiceValidation(
  control: UCSingleChoice,
  solution: UCSingleChoice['solution'],
  userAnswer: number,
): boolean {
  return solution === userAnswer
}
