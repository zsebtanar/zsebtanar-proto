import { all, isEmpty, isNil, keys } from 'ramda'
import { UCBinaryChoice } from 'shared/exercise/types'

export function binaryChoiceCheck(
  control: UCBinaryChoice,
  solution: UCBinaryChoice['solution'],
  userInput: UCBinaryChoice['solution'],
): boolean {
  if (isNil(solution) || isEmpty(solution)) return false

  return all(
    key => solution[key].toString() === (userInput?.[key].toString() ?? ''),
    keys(solution),
  )
}
