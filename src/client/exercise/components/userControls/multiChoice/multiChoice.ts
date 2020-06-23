import { all, isEmpty, isNil, keys } from 'ramda'
import { UCMultiChoice } from '../../../../../shared/exercise/types'

export function multiChoiceCheck(
  control: UCMultiChoice,
  solution: UCMultiChoice['solution'],
  userInput: UCMultiChoice['solution']
): boolean {
  if (isNil(solution) || isEmpty(solution)) return false

  return all(key => solution[key] === (userInput?.[key] ?? undefined), keys(solution))
}
